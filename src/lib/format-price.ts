export const formatPrice = (price: number) => {
  const newPrice = new Intl.NumberFormat('th-TH', {
    // style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0, // ไม่ให้แสดงทศนิยม
    maximumFractionDigits: 0, // ไม่ให้แสดงทศนิยม
  })

  return `${newPrice.format(price)} ฿`
}
