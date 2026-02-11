"use client";

import Modal from "@/components/modal";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dayjs from "@/lib/dayjs";
import { formatPrice } from "@/lib/format-price";
import { calculateDiscountPercent } from "@/lib/pricing";
import { ProductVariant, ProductWithMainImage } from "@/types/product";
import { Banknote, Clock, Package, Tag } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const getStockPresentation = (stock: number, lowStock?: number) => {
  if (stock <= 0) {
    return { color: "text-red-600", label: "Out of stock" };
  }

  if (lowStock !== undefined && stock <= lowStock) {
    return { color: "text-amber-500", label: "Low stock" };
  }

  return { color: "text-green-600", label: "In stock" };
};

const calculateProfit = ({
  price,
  weight,
  cost,
  totalStock,
}: {
  price: number;
  weight: number;
  cost: number | null | undefined;
  totalStock: number | null | undefined;
}) => {
  const productCost = cost ?? 0;
  const stockGrams = totalStock ?? 0;
  if (productCost <= 0 || stockGrams <= 0 || weight <= 0) return 0;
  const costPerGram = productCost / stockGrams;
  const allocatedCost = costPerGram * weight;
  return price - allocatedCost;
};

const calculateMarginPercent = (price: number, profit: number) => {
  if (!price || price <= 0) return 0;
  return Math.round((profit / price) * 100);
};

const getTrendColor = (
  value: number,
  positiveColor = "text-emerald-600",
  negativeColor = "text-red-600",
  neutralColor = "text-muted-foreground"
) => {
  if (value > 0) return positiveColor;
  if (value < 0) return negativeColor;
  return neutralColor;
};

const getVariantSalesSummary = (
  variant: ProductVariant,
  profitPerUnit: number
) => {
  const soldUnits = variant.sold ?? 0;
  const weight = variant.weight ?? 0;
  const soldGrams = soldUnits * weight;
  const income = soldUnits * (variant.price ?? 0);
  const totalProfit = profitPerUnit * soldUnits;

  return {
    soldGrams,
    income,
    totalProfit,
    totalProfitColor: getTrendColor(totalProfit, "text-emerald-700"),
  };
};

interface VariantCardProps {
  variant: ProductVariant;
  cost: number | null;
  totalStock: number | null;
}

function VariantCard({ variant, cost, totalStock }: VariantCardProps) {
  const discountPercent = calculateDiscountPercent(
    variant.basePrice,
    variant.price
  );
  const profitPerUnit = calculateProfit({
    price: variant.price,
    weight: variant.weight,
    cost,
    totalStock,
  });
  const marginPercent = calculateMarginPercent(variant.price, profitPerUnit);
  const profitColor = getTrendColor(profitPerUnit);
  const { soldGrams, income, totalProfit, totalProfitColor } =
    getVariantSalesSummary(variant, profitPerUnit);

  return (
    <div className="border rounded-lg p-3 sm:p-4 hover:shadow-sm transition-shadow h-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Badge
          variant="outline"
          className="text-[12px] font-medium bg-slate-100 text-slate-700 border-slate-200"
        >
          {variant.weight.toLocaleString()} g
        </Badge>
        {discountPercent > 0 && (
          <Badge
            variant="secondary"
            className="text-[11px] bg-emerald-100 text-emerald-700 border-emerald-200"
          >
            {discountPercent.toFixed(2)}% off
          </Badge>
        )}
      </div>

      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold">
            {formatPrice(variant.price)}
          </span>
          {variant.basePrice > variant.price && (
            <span className="text-sm line-through text-muted-foreground">
              {formatPrice(variant.basePrice)}
            </span>
          )}
        </div>
        <div className={`text-xs mt-1 ${profitColor}`}>
          Profit per unit: {profitPerUnit >= 0 ? "+" : ""}
          {formatPrice(profitPerUnit)} ({marginPercent.toFixed(2)}%)
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-[11px]">
        <div className="flex flex-col">
          <span className="text-muted-foreground">Sold</span>
          <span className="text-muted-foreground">
            {soldGrams.toLocaleString()} g
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground">Income</span>
          <span className="font-medium">{formatPrice(income)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground">Profit</span>
          <span className={`font-medium ${totalProfitColor}`}>
            {formatPrice(totalProfit)}
          </span>
        </div>
      </div>
    </div>
  );
}

interface ProductDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductWithMainImage | null;
}

export default function ProductDetailModal({
  open,
  onOpenChange,
  product,
}: ProductDetailModalProps) {
  const fallbackImageId = "fallback-main-image";
  type GalleryImage = { fileId: string; url: string; isMain: boolean };

  const galleryImages = useMemo<GalleryImage[]>(() => {
    if (!product) return [];

    if (product.ProductImage.length > 0) {
      return product.ProductImage.map((image) => ({
        fileId: image.fileId,
        url: image.url,
        isMain: image.isMain,
      }));
    }

    const fallbackUrl = product.mainImage?.url ?? "";
    return [
      {
        fileId: fallbackImageId,
        url: fallbackUrl,
        isMain: true,
      },
    ];
  }, [product]);

  const [activeImageId, setActiveImageId] = useState<string>(fallbackImageId);

  useEffect(() => {
    if (!product || galleryImages.length === 0) {
      setActiveImageId(fallbackImageId);
      return;
    }

    const mainImage =
      galleryImages.find((image) => image.isMain) ?? galleryImages[0];
    setActiveImageId(mainImage?.fileId ?? fallbackImageId);
  }, [product, galleryImages]);

  if (!product) return null;

  const skuLabel =
    product.sku && product.sku.trim().length > 0 ? product.sku : "N/A";
  const formattedDate = dayjs(product.createdAt).fromNow();
  const { color: stockColor, label: stockStatus } = getStockPresentation(
    product.stock,
    product.lowStock
  );
  const mainProductImage =
    galleryImages.find((image) => image.isMain) ?? galleryImages[0];

  const activeImage =
    galleryImages.find((image) => image.fileId === activeImageId) ??
    mainProductImage;
  const activeImageUrl =
    activeImage?.url ??
    product.mainImage?.url ??
    "/images/no-product-image.webp";

  const hasThumbnails = galleryImages.length > 1;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={product.title}
      description={`SKU: ${skuLabel}`}
      className="md:max-w-3xl"
    >
      <div>
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-3 mb-4 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="images">
              Images ({product.ProductImage.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ScrollArea className="max-h-[500px] overflow-y-auto">
              <Card className="mb-4">
                <div className="p-4 pb-0">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg border">
                    <Image
                      alt={product.title}
                      src={activeImageUrl}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 70vw, 640px"
                      className="object-cover"
                    />
                  </div>

                  {hasThumbnails && (
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                      {galleryImages.map((image, index) => {
                        const isActive = image.fileId === activeImageId;
                        return (
                          <button
                            key={image.fileId}
                            type="button"
                            onClick={() => setActiveImageId(image.fileId)}
                            className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                              isActive ? "ring-2 ring-primary" : ""
                            }`}
                            // aria-pressed={isActive}
                            aria-current={isActive ? "true" : undefined}
                            aria-label={`Select product image ${index + 1}`}
                          >
                            <Image
                              alt={product.title}
                              src={image.url}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col">
                  <div className="mb-2 flex items-center justify-between">
                    <Badge
                      variant={
                        product.status === "active" ? "default" : "destructive"
                      }
                    >
                      {product.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Tag size={12} />
                      <span>{product.category.name}</span>
                    </Badge>
                  </div>

                  <h2 className="text-xl font-bold line-clamp-2 mb-1">
                    {product.title}
                  </h2>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <Clock size={12} />
                    <span>Added {formattedDate}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Package size={14} />
                      <span className={`text-xs font-medium ${stockColor}`}>
                        {stockStatus}
                      </span>
                    </div>

                    <span className="text-sm text-muted-foreground">
                      {product.stock} g
                    </span>
                  </div>

                  <div className="mt-auto">
                    <div className="flex flex-col gap-2">
                      <div className="text-sm font-medium text-muted-foreground">
                        Variants & pricing
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {product.ProductWeight.length > 0 &&
                          product.ProductWeight.map((variant) => (
                            <VariantCard
                              key={variant.id}
                              variant={variant}
                              cost={product.cost}
                              totalStock={product.stock}
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="details">
            <ScrollArea className="max-h-[500px] overflow-y-auto">
              <Card className="p-4 space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                      Product Information
                    </h3>
                    <dl className="mt-2 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                      <div>
                        <dt className="text-muted-foreground">SKU</dt>
                        <dd className="font-medium">{skuLabel}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Category</dt>
                        <dd className="font-medium">{product.category.name}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Status</dt>
                        <dd className="font-medium capitalize">
                          {product.status}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">COD</dt>
                        <dd className="flex items-center gap-2 font-medium">
                          <Banknote
                            size={16}
                            className={
                              product.cod
                                ? "text-emerald-600"
                                : "text-muted-foreground"
                            }
                          />
                          <span>
                            {product.cod ? "Available" : "Unavailable"}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Cost</dt>
                        <dd className="font-medium">
                          {formatPrice(product.cost ?? 0)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Total stock</dt>
                        <dd className="font-medium">
                          {product.stock.toLocaleString()} g
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">
                          Low stock threshold
                        </dt>
                        <dd className="font-medium">
                          {product.lowStock.toLocaleString()} g
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Variants</dt>
                        <dd className="font-medium">
                          {product.ProductWeight.length}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <h4 className="text-muted-foreground">Created</h4>
                      <p className="font-medium">
                        {dayjs(product.createdAt).format("DD MMM YYYY HH:mm")}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-muted-foreground">Last updated</h4>
                      <p className="font-medium">
                        {dayjs(product.updatedAt).format("DD MMM YYYY HH:mm")}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Description
                  </h3>
                  <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                    {product.description}
                  </p>
                </div>
              </Card>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="images">
            <ScrollArea className="max-h-[500px] overflow-y-auto">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {product.ProductImage.length === 0 ? (
                  <Card className="p-6 text-center text-sm text-muted-foreground">
                    No images uploaded for this product.
                  </Card>
                ) : (
                  product.ProductImage.map((image) => (
                    <Card key={image.fileId} className="p-3">
                      <div className="relative aspect-square overflow-hidden rounded-md border">
                        <Image
                          src={image.url}
                          alt={product.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 240px"
                          className="object-cover"
                        />
                        {image.isMain && (
                          <Badge className="absolute left-2 top-2 bg-primary text-primary-foreground">
                            Main image
                          </Badge>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </Modal>
  );
}
