export function calculateDiscountPercent(basePrice: number, price: number) {
  if (!basePrice || basePrice <= 0) return 0
  if (price >= basePrice) return 0
  return ((basePrice - price) / basePrice) * 100
}

export function getMaxDiscountPercent(
  weights: Array<{ basePrice: number | null | undefined; price: number | null | undefined }>
) {
  if (!weights || weights.length === 0) return 0

  return weights.reduce((max, weight) => {
    const discount = calculateDiscountPercent(
      Number(weight.basePrice ?? 0),
      Number(weight.price ?? 0)
    )
    return Math.max(max, discount)
  }, 0)
}
