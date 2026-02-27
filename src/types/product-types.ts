// components/product/product-detail/product-types.ts
export interface WeightOption {
  id: string;
  weight: number;
  price: number;
  basePrice: number;
  name: string | null;
}

export interface ProductImageInfo {
  id: string;
  url: string;
  isMain: boolean;
}

export interface ReviewItem {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
}

export interface ProductDetailPayload {
  id: string;
  title: string;
  description: string;
  cod: boolean;
  stock: number;
  lowStock: number;
  categoryName: string | null;
  mainImageUrl: string;
  images: ProductImageInfo[];
  weights: WeightOption[];
  type: "WEIGHT" | "UNIT";
  unitLabel: string;
  averageRating?: number;
  totalReviews?: number;
  reviews: ReviewItem[];
}

export interface PreparedWeightOption extends WeightOption {
  priceLabel: string;
  basePriceLabel: string;
  discount: number;
  hasDiscount: boolean;
  showBasePrice: boolean;
  displayName: string;
}