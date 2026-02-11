import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'
import { NextRequest } from 'next/server'

// เช็คว่ามี Upstash Redis config หรือไม่
const hasRedis =
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN &&
  !process.env.UPSTASH_REDIS_REST_URL.includes('your-redis-instance')

const authHandler = toNextJsHandler(auth)

// ถ้าไม่มี Redis (Local) ใช้ handler ธรรมดา
if (!hasRedis) {
  console.log(' Running without rate limiting (Local mode)')
}

// Security headers helper
function secure(res: Response) {
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(), microphone=()')
  return res
}

// GET Handler
export const GET = async (req: NextRequest) => {
  if (!hasRedis) {
    return secure(await authHandler.GET(req))
  }

  // Rate limiting logic for production (with Redis)
  const { Ratelimit } = await import('@upstash/ratelimit')
  const { Redis } = await import('@upstash/redis')

  const redis = Redis.fromEnv()
  const ipLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '10 s'),
    analytics: true,
    prefix: '@auth/ip',
  })

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'

  const { success } = await ipLimiter.limit(ip)

  if (!success) {
    return secure(new Response('Too Many Requests', { status: 429 }))
  }

  return secure(await authHandler.GET(req))
}

// POST Handler
export const POST = async (req: NextRequest) => {
  if (!hasRedis) {
    return secure(await authHandler.POST(req))
  }

  // Rate limiting logic for production (with Redis)
  const { Ratelimit } = await import('@upstash/ratelimit')
  const { Redis } = await import('@upstash/redis')

  const redis = Redis.fromEnv()

  const ipLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '10 s'),
    analytics: true,
    prefix: '@auth/ip',
  })

  const authFailLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    analytics: true,
    prefix: '@auth/fail',
  })

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'

  const { success: ipAllowed } = await ipLimiter.limit(ip)
  if (!ipAllowed) {
    return secure(new Response('Too Many Requests', { status: 429 }))
  }

  const clone = req.clone()
  let email: string | null = null

  try {
    const text = await clone.text()

    if (text.length > 50 * 1024) {
      return secure(new Response('Payload too large', { status: 413 }))
    }

    const json = JSON.parse(text)
    if (json?.email) {
      email = String(json.email).toLowerCase().trim()
    }
  } catch {
    // ignore
  }

  if (email) {
    const rate = await authFailLimiter.limit(email)

    if (!rate.success) {
      const ms = 300 + Math.floor(Math.random() * 300)
      await new Promise((resolve) => setTimeout(resolve, ms))

      return secure(
        new Response(
          JSON.stringify({
            message: 'Too many failed attempts. Try again later.',
          }),
          {
            status: 429,
            headers: { 'Content-Type': 'application/json' },
          },
        ),
      )
    }
  }

  try {
    const res = await authHandler.POST(req)

    if (res.ok) {
      return secure(res)
    }

    if (res.status === 400 || res.status === 422) {
      return secure(res)
    }

    const ms = 300 + Math.floor(Math.random() * 300)
    await new Promise((resolve) => setTimeout(resolve, ms))

    return secure(
      new Response(JSON.stringify({ message: 'Invalid email or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
  } catch (err) {
    console.error('Auth Critical Error:', err)
    return secure(new Response('Internal Server Error', { status: 500 }))
  }
}
