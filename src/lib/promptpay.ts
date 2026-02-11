import QRCode from 'qrcode'
import generatePayload from 'promptpay-qr'

interface PromptPayPayload {
  promptPayId: string
  amount: number
  reference?: string
}

export function generatePromptPayPayload({ promptPayId, amount, reference }: PromptPayPayload) {
  const options: { amount: number; reference?: string } = { amount }
  if (reference) {
    options.reference = reference
  }
  return generatePayload(promptPayId, options)
}

export async function generatePromptPayQrCode(data: PromptPayPayload) {
  const payload = generatePromptPayPayload(data)
  return QRCode.toDataURL(payload, {
    errorCorrectionLevel: 'M',
    scale: 6,
  })
}
