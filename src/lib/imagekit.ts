import ImageKit from 'imagekit'
import sharp from 'sharp'

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
})

export async function uploadToImageKit(file: File, label: string) {
  try {
    if (!file) {
      return { message: 'File is required' }
    }

    if (file.size > 5 * 1024 * 1024) {
      return { message: 'File size exceeds 5MB limit' }
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Quick validation: try to read metadata first to detect corrupted images early
    let processedImageBuffer: Buffer | null = null
    try {
      await sharp(buffer).metadata()
      processedImageBuffer = await sharp(buffer)
        .webp({ quality: 80, lossless: false, effort: 4 })
        .resize({
          width: 1200,
          height: 1200,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .toBuffer()
    } catch (err) {
      console.error(
        'Sharp processing failed, falling back to original buffer:',
        err,
      )
      // If processing fails (corrupt header etc), fall back to uploading original file buffer
      // ImageKit accepts base64 data URIs, so convert to that as a safe fallback
    }

    // Prefer uploading raw Buffers — ImageKit handles both Buffers and base64 strings.
    const fileToUploadBuffer = processedImageBuffer
      ? processedImageBuffer
      : buffer

    const fileName = processedImageBuffer
      ? `${label}_${Date.now()}_${file.name.replace(/\.[^.]+$/, '')}.webp`
      : `${label}_${Date.now()}_${file.name}`

    console.info('Uploading to ImageKit', {
      fileName,
      size: fileToUploadBuffer.length,
      mime: processedImageBuffer ? 'image/webp' : file.type,
    })

    const result = await imagekit.upload({
      file: fileToUploadBuffer,
      fileName,
      folder: `/${label}`,
    })

    return {
      url: result.url,
      fileId: result.fileId,
    }
  } catch (error) {
    console.error(error)
    return { message: 'Something went wrong' }
  }
}

export async function uploadBase64ToImageKit(
  base64String: string,
  label: string,
) {
  try {
    if (!base64String) return { message: 'Image data is required' }

    // 🛡️ Security Check: ต้องเป็นรูปภาพเท่านั้น
    if (!base64String.startsWith('data:image/')) {
      return { message: 'Invalid image format (Not an image)' }
    }

    // แปลง Base64 เป็น Buffer
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    // Process รูปภาพด้วย Sharp
    const processedImageBuffer = await sharp(buffer)
      .webp({ quality: 80, effort: 4 })
      .resize({
        width: 1200,
        height: 1200,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toBuffer()

    // อัปโหลด
    const result = await imagekit.upload({
      file: processedImageBuffer,
      fileName: `${label}_${Date.now()}.webp`,
      folder: `/${label}`,
    })

    return { url: result.url, fileId: result.fileId }
  } catch (error) {
    console.error('Base64 Upload Error:', error)
    return { message: 'Upload failed' }
  }
}
