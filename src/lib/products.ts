interface ProductImageLike {
  isMain: boolean
  [key: string]: unknown
}

interface ProductWithImages<TImage extends ProductImageLike = ProductImageLike> {
  ProductImage: TImage[]
  [key: string]: unknown
}

export function withMainImage<
  TImage extends ProductImageLike,
  TProduct extends ProductWithImages<TImage>,
>(product: TProduct) {
  const mainImage = product.ProductImage.find((image) => image.isMain) ?? null

  return {
    ...product,
    mainImage,
  } as TProduct & { mainImage: TImage | null }
}

export function mapProductsWithMainImage<TProduct extends ProductWithImages>(
  products: TProduct[]
) {
  return products.map((product) => withMainImage(product))
}
