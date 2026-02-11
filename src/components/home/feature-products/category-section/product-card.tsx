"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Eye, MoreVertical, ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPrice } from "@/lib/format-price";
import { calculateDiscountPercent, getMaxDiscountPercent } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { ProductWithMainImage } from "@/types/product";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: ProductWithMainImage;
}

const FALLBACK_IMAGE = "/images/no-product-image.webp";

export default function ProductCard({ product }: ProductCardProps) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const router = useRouter();

  const variants = useMemo(
    () => product.ProductWeight ?? [],
    [product.ProductWeight]
  );

  const { primaryVariant, maxDiscountPercent } = useMemo(() => {
    if (!variants.length) {
      return { primaryVariant: undefined, maxDiscountPercent: 0 };
    }

    const sortedByPrice = [...variants].sort((a, b) => a.price - b.price);
    const topDiscount = getMaxDiscountPercent(variants);

    return {
      primaryVariant: sortedByPrice[0],
      maxDiscountPercent: topDiscount,
    };
  }, [variants]);

  const currentPrice = primaryVariant?.price;
  const basePrice = primaryVariant?.basePrice;
  const discountPercent = calculateDiscountPercent(
    Number(basePrice ?? 0),
    Number(currentPrice ?? 0)
  );

  const categoryName = product.category?.name ?? "ไม่มีหมวดหมู่";
  const mainImageUrl = product.mainImage?.url ?? FALLBACK_IMAGE;

  const stockBadge = () => {
    if (product.stock <= 0) {
      return (
        <Badge
          variant="outline"
          className="text-destructive border-destructive text-xs px-2 py-0.5"
        >
          สินค้าหมด
        </Badge>
      );
    }

    if (product.stock <= product.lowStock) {
      return (
        <Badge
          variant="outline"
          className="text-amber-500 border-amber-500 text-xs md:text-sm px-2 py-0.5"
        >
          เหลือน้อย
        </Badge>
      );
    }

    return (
      <Badge
        variant="outline"
        className="text-green-600 border-green-500 text-xs md:text-sm px-2 py-0.5"
      >
        พร้อมส่ง
      </Badge>
    );
  };

  const priceDisplay = currentPrice ? formatPrice(currentPrice) : "ราคาไม่ระบุ";
  const basePriceDisplay =
    currentPrice && basePrice && basePrice > currentPrice
      ? formatPrice(basePrice)
      : null;

  const discountLabel = Math.max(maxDiscountPercent, discountPercent);

  return (
    <>
      <Card className="group h-full overflow-hidden p-0 transition-all duration-300 hover:border-primary/50 hover:shadow-md">
        <div className="relative overflow-hidden bg-muted-foreground pt-[100%]">
          <Image
            alt={product.title}
            src={mainImageUrl}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 200px, 45vw"
          />

          {discountLabel > 0 && (
            <Badge className="absolute left-2 top-2 z-10 rounded-full bg-destructive px-2 py-1 text-xs font-semibold text-white shadow-md">
              -{Math.round(discountLabel)}%
            </Badge>
          )}

          {product.stock <= 0 && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/45">
              <Badge variant="destructive" className="px-3 py-1 text-sm">
                สินค้าหมด
              </Badge>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-2">
          <span className="inline-block rounded-full border border-green-500 bg-white px-1.5 py-[1px] text-[9px] font-medium text-black shadow-sm transition hover:border-green-600 hover:shadow-md md:text-[10px] lg:text-xs">
            {categoryName}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 md:size-9">
                <MoreVertical size={14} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsDetailOpen(true)}>
                <Eye size={14} />
                <span className="text-[12px] md:text-sm">
                  ดูลายละเอียดสินค้า
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardContent className="flex flex-1 flex-col px-2 pt-1 pb-1">
          <div className="space-y-1.5">
            {/* ชื่อสินค้า */}
            <h3 className="mt-1 text-[12px] font-medium leading-snug line-clamp-2 md:text-[14px] lg:text-[15px]">
              {product.title}
            </h3>

            {/* ส่วนราคาและป้ายพร้อมส่ง */}
            <div className="flex items-baseline justify-between">
              <div className="flex flex-col leading-tight">
                <span className="text-[13px] font-semibold md:text-[15px] lg:text-[16px]">
                  {priceDisplay}
                </span>
                {basePriceDisplay && (
                  <span className="text-[11px] font-medium text-muted-foreground line-through md:text-[13px] lg:text-[14px]">
                    {basePriceDisplay}
                  </span>
                )}
              </div>

              {stockBadge()}
            </div>
          </div>
        </CardContent>

        <CardFooter className="gap-2 p-2">
          <Button
            className="w-full gap-1 text-xs"
            onClick={() => router.push("/products")} // ไปยังหน้าสินค้าทั้งหมด
          >
            <ShoppingCart size={12} /> {/* เปลี่ยนไอคอนเป็นรถเข็น */}
            <span>ซื้อสินค้า</span>
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{product.title}</DialogTitle>
            <DialogDescription>{categoryName}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <Image
                src={mainImageUrl}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col gap-4 text-sm">
              <p className="whitespace-pre-line text-muted-foreground">
                {product.description}
              </p>

              <div className="space-y-2 rounded-md border bg-muted/40 p-3">
                <h4 className="text-sm font-semibold text-foreground">
                  ตัวเลือกสินค้า
                </h4>
                {variants.length > 0 ? (
                  <ul className="space-y-1">
                    {variants.map((variant) => {
                      const variantDiscount = calculateDiscountPercent(
                        variant.basePrice,
                        variant.price
                      );

                      return (
                        <li
                          key={variant.id}
                          className="flex items-center justify-between gap-3 rounded border border-transparent bg-background px-3 py-2 text-xs transition hover:border-primary/30"
                        >
                          <span className="font-medium">
                            {variant.weight.toLocaleString()} กรัม
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {formatPrice(variant.price)}
                            </span>
                            {variant.basePrice > variant.price && (
                              <span className="text-xs text-muted-foreground line-through">
                                {formatPrice(variant.basePrice)}
                              </span>
                            )}
                            {variantDiscount > 0 && (
                              <Badge
                                variant="secondary"
                                className="text-[11px]"
                              >
                                -{variantDiscount.toFixed(0)}%
                              </Badge>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    ยังไม่มีข้อมูลตัวเลือกสินค้า
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-2 text-xs md:text-sm">
                <span className="font-medium text-muted-foreground">
                  สต็อกคงเหลือ
                </span>
                <span
                  className={cn("font-semibold", {
                    "text-destructive": product.stock <= 0,
                    "text-amber-500":
                      product.stock > 0 && product.stock <= product.lowStock,
                    "text-emerald-600": product.stock > product.lowStock,
                  })}
                >
                  {product.stock.toLocaleString()} ชิ้น
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
