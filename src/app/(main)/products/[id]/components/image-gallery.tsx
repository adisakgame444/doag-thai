// components/product/product-detail/image-gallery.tsx
import Image from "next/image";
import { Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductImageInfo } from "@/types/product-types";

interface ImageGalleryProps {
  images: ProductImageInfo[];
  title: string;
  activeImageId: string | null;
  setActiveImageId: (id: string) => void;
  displayImage: string;
  isSoldOut: boolean;
}

export function ImageGallery({ images, title, activeImageId, setActiveImageId, displayImage, isSoldOut }: ImageGalleryProps) {
  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted">
        <Image src={displayImage} alt={title} fill className="object-cover" 
          sizes="(min-width: 1280px) 520px, (min-width: 1024px) 460px, (min-width: 768px) 60vw, 100vw" priority />
        {isSoldOut && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm">
            <div className="flex items-center gap-2 rounded-md bg-[#DC2626] px-6 py-2 text-white shadow-md transition-transform hover:scale-105">
              <Ban className="h-4 w-4 stroke-3" />
              <span className="text-sm font-bold tracking-wide">สินค้าหมด</span>
            </div>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveImageId(image.id)}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                image.id === activeImageId ? "border-primary ring-2 ring-primary/30" : "border-border/60 hover:border-primary/40"
              )}
            >
              <Image src={image.url} alt={title} fill className="object-cover" sizes="80px" />
              {isSoldOut && <div className="absolute inset-0 z-10 bg-background/60 backdrop-blur-[1px]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}