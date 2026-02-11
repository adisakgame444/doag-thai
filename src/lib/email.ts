const resendApiKey = process.env.RESEND_API_KEY
const RESEND_ENDPOINT = 'https://api.resend.com/emails'

interface SendEmailValues {
  to: string
  subject: string
  text: string
}

export async function sendEmail({ to, subject, text }: SendEmailValues) {
  if (!resendApiKey) {
    console.warn('Resend API key missing; skipping email send')
    return
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'onboarding@resend.dev',
      to,
      subject,
      text,
    }),
  })

  if (!response.ok) {
    console.error('Failed to send email via Resend', await response.text())
  }
}
