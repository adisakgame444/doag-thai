"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface ProductSearchBoxProps {
  initialValue?: string;
}

const DEBOUNCE_MS = 400;

export default function ProductSearchBox({
  initialValue = "",
}: ProductSearchBoxProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsString = useMemo(
    () => searchParams.toString(),
    [searchParams]
  );

  const [keyword, setKeyword] = useState(initialValue);

  // useEffect(() => {
  //   setKeyword(initialValue);
  // }, [initialValue]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParamsString);
      const normalized = keyword.trim();
      const current = params.get("search") ?? "";

      if (normalized === current) {
        return;
      }

      if (normalized) {
        params.set("search", normalized);
      } else {
        params.delete("search");
      }

      params.delete("page");

      const query = params.toString();
      router.push(query ? `/products?${query}` : "/products");
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(handler);
    };
  }, [keyword, router, searchParamsString]);

  const clearSearch = () => {
    setKeyword("");
    router.push("/products");
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">ค้นหาสินค้า</h2>
        <p className="text-sm text-muted-foreground">
          พิมพ์ชื่อสินค้า, SKU หรือหมวดหมู่ที่ต้องการ
        </p>
      </div>

      <div className="flex w-full max-w-xl items-center gap-2">
        <div className="flex w-full items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-4 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="เช่น ดอกไม้, Santa, Sativa"
            className="h-9 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
          />
          {keyword && (
            <button
              type="button"
              onClick={clearSearch}
              className="text-muted-foreground transition-colors hover:text-destructive"
              aria-label="ลบข้อความค้นหา"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Button type="button" variant="outline" size="sm" onClick={clearSearch}>
          ล้าง
        </Button>
      </div>
    </div>
  );
}


