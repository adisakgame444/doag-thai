// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { Minus, Plus, Trash2 } from "lucide-react";
// import {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   useTransition,
// } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { formatPrice } from "@/lib/format-price";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   selectCartHydrated,
//   selectCartItems,
//   selectCartTotals,
//   selectCartUserId,
//   useCartStore,
// } from "@/stores/cart-store";
// import { CartItemDTO } from "@/types/cart";
// import { toast } from "sonner";
// import {
//   clearCartAction,
//   prepareCheckoutAction,
//   syncCartUpdatesAction,
// } from "./actions";
// import { useRouter } from "next/navigation";

// const FALLBACK_IMAGE = "/images/no-product-image.webp";

// interface CartViewProps {
//   initialItems: CartItemDTO[];
//   userId: string;
// }

// function calculateTotals(items: CartItemDTO[]) {
//   return items.reduce(
//     (acc, item) => {
//       acc.quantity += item.quantity;
//       acc.total += item.subtotal;
//       return acc;
//     },
//     { quantity: 0, total: 0 }
//   );
// }

// export default function CartView({ initialItems, userId }: CartViewProps) {
//   const router = useRouter();
//   const hydrated = useCartStore(selectCartHydrated);
//   const storeUserId = useCartStore(selectCartUserId);
//   const storeItems = useCartStore(selectCartItems);
//   const storeTotals = useCartStore(selectCartTotals);
//   const selectedIds = useCartStore((state) => state.selectedIds);
//   const syncFromServer = useCartStore((state) => state.syncFromServer);
//   const updateLocalQuantity = useCartStore(
//     (state) => state.updateLocalQuantity
//   );
//   const removeLocalItem = useCartStore((state) => state.removeLocalItem);
//   const setItemSelection = useCartStore((state) => state.setItemSelection);
//   const setAllSelected = useCartStore((state) => state.setAllSelected);

//   const items = hydrated && storeUserId === userId ? storeItems : initialItems;
//   const fallbackTotals = useMemo(
//     () => calculateTotals(initialItems),
//     [initialItems]
//   );
//   const totals =
//     hydrated && storeUserId === userId
//       ? storeTotals
//       : { quantity: fallbackTotals.quantity, price: fallbackTotals.total };

//   const [pendingId, setPendingId] = useState<string | null>(null);
//   const [isClearing, setIsClearing] = useState(false);
//   const [isSyncing, setIsSyncing] = useState(false);
//   const [isPending, startTransition] = useTransition();
//   const [isCheckoutPending, startCheckoutTransition] = useTransition();

//   const pendingUpdatesRef = useRef<Record<string, number>>({});
//   const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const latestItemsRef = useRef(items);

//   useEffect(() => {
//     latestItemsRef.current = items;
//   }, [items]);

//   const totalPrice = totals.price;
//   const totalQuantity = totals.quantity;

//   const selectedItems = useMemo(
//     () => items.filter((item) => Boolean(selectedIds[item.id])),
//     [items, selectedIds]
//   );
//   const selectedItemCount = selectedItems.length;
//   const selectedQuantity = selectedItems.reduce(
//     (sum, item) => sum + item.quantity,
//     0
//   );
//   const selectedTotalPrice = selectedItems.reduce(
//     (sum, item) => sum + item.subtotal,
//     0
//   );
//   const allSelected = items.length > 0 && selectedItemCount === items.length;
//   const partiallySelected =
//     selectedItemCount > 0 && selectedItemCount < items.length;

//   const runSync = useCallback(async () => {
//     if (syncTimerRef.current) {
//       clearTimeout(syncTimerRef.current);
//       syncTimerRef.current = null;
//     }

//     const entries = Object.entries(pendingUpdatesRef.current);
//     pendingUpdatesRef.current = {};

//     if (entries.length === 0) {
//       setPendingId(null);
//       return;
//     }

//     setIsSyncing(true);

//     try {
//       const updates = entries.map(([cartItemId, quantity]) => ({
//         cartItemId,
//         quantity,
//       }));

//       const result = await syncCartUpdatesAction(updates);

//       if (!result.success || !result.cart) {
//         toast.error(result.message ?? "ไม่สามารถอัปเดตตะกร้าได้");
//         syncFromServer(userId, latestItemsRef.current);
//       } else {
//         syncFromServer(userId, result.cart);
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("เกิดข้อผิดพลาดในการซิงก์ตะกร้า");
//       syncFromServer(userId, latestItemsRef.current);
//     } finally {
//       setPendingId(null);
//       setIsSyncing(false);
//     }
//   }, [syncFromServer, userId]);

//   const queueSync = useCallback(
//     (cartItemId: string, quantity: number, immediate = false) => {
//       pendingUpdatesRef.current[cartItemId] = quantity;

//       if (syncTimerRef.current) {
//         clearTimeout(syncTimerRef.current);
//         syncTimerRef.current = null;
//       }

//       if (immediate) {
//         runSync();
//       } else {
//         syncTimerRef.current = setTimeout(runSync, 500);
//       }
//     },
//     [runSync]
//   );

//   useEffect(() => {
//     return () => {
//       if (syncTimerRef.current) {
//         clearTimeout(syncTimerRef.current);
//         syncTimerRef.current = null;
//       }

//       if (Object.keys(pendingUpdatesRef.current).length > 0) {
//         runSync();
//       }
//     };
//   }, [runSync]);

//   const handleQuantityChange = (item: CartItemDTO, nextQuantity: number) => {
//     const normalized = Number.isFinite(nextQuantity)
//       ? Math.max(0, Math.floor(nextQuantity))
//       : item.quantity;
//     const bounded =
//       item.maxQuantity > 0
//         ? Math.min(normalized, item.maxQuantity)
//         : normalized;

//     if (bounded === item.quantity) return;

//     setPendingId(item.id);

//     if (bounded <= 0) {
//       removeLocalItem(item.id);
//     } else {
//       updateLocalQuantity(item.id, bounded);
//     }

//     queueSync(item.id, bounded);
//   };

//   const handleRemove = (item: CartItemDTO) => {
//     setPendingId(item.id);
//     removeLocalItem(item.id);
//     queueSync(item.id, 0, true);
//   };

//   const handleRemoveSelected = () => {
//     if (!selectedItems.length) return;

//     if (syncTimerRef.current) {
//       clearTimeout(syncTimerRef.current);
//       syncTimerRef.current = null;
//     }

//     for (const item of selectedItems) {
//       removeLocalItem(item.id);
//       pendingUpdatesRef.current[item.id] = 0;
//     }

//     runSync();
//   };

//   const handleSelectAllChange = (checked: boolean | "indeterminate") => {
//     setAllSelected(checked === true);
//   };

//   const handleClear = () => {
//     if (syncTimerRef.current) {
//       clearTimeout(syncTimerRef.current);
//       syncTimerRef.current = null;
//     }
//     pendingUpdatesRef.current = {};
//     setIsClearing(true);
//     startTransition(async () => {
//       const result = await clearCartAction();

//       if (!result.success || !result.cart) {
//         toast.error(result.message ?? "ไม่สามารถล้างตะกร้าได้");
//         setIsClearing(false);
//         return;
//       }

//       syncFromServer(userId, result.cart);
//       toast.success("ล้างตะกร้าเรียบร้อยแล้ว");
//       setIsClearing(false);
//     });
//   };

//   const isBusy = isPending || isClearing || isSyncing;
//   const checkoutDisabled =
//     selectedItemCount === 0 ||
//     isBusy ||
//     isCheckoutPending ||
//     selectedTotalPrice <= 0;

//   const handleCheckout = () => {
//     if (selectedItemCount === 0) {
//       toast.error("กรุณาเลือกรายการสินค้าที่ต้องการชำระเงิน");
//       return;
//     }

//     const ids = selectedItems.map((item) => item.id);

//     startCheckoutTransition(async () => {
//       const result = await prepareCheckoutAction({ cartItemIds: ids });

//       if (!result.success || !result.items) {
//         toast.error(result.message ?? "ไม่สามารถเตรียมข้อมูลชำระเงินได้");
//         return;
//       }

//       const params = new URLSearchParams();
//       params.set("items", ids.join(","));
//       router.push(`/checkout?${params.toString()}`);
//     });
//   };

//   if (items.length === 0) {
//     return (
//       <Card className="mx-auto max-w-3xl border-dashed">
//         <CardHeader>
//           <CardTitle className="text-center text-xl">
//             ตะกร้าของคุณยังว่างอยู่
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-3 text-center text-muted-foreground">
//           <p>เลือกชมสินค้าแล้วเพิ่มลงตะกร้าเพื่อเริ่มสั่งซื้อ</p>
//         </CardContent>
//         <CardFooter className="justify-center">
//           <Button asChild size="lg">
//             <Link href="/products">ไปหน้าสินค้า</Link>
//           </Button>
//         </CardFooter>
//       </Card>
//     );
//   }

//   return (
//     <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
//       <section className="space-y-4">
//         <div className="space-y-3">
//           <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//             <h1 className="text-2xl font-semibold text-foreground">
//               ตะกร้าสินค้า
//             </h1>
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={handleRemoveSelected}
//                 disabled={isBusy || selectedItemCount === 0}
//                 className="text-destructive"
//               >
//                 ลบรายการที่เลือก
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleClear}
//                 disabled={isBusy}
//               >
//                 ล้างตะกร้า
//               </Button>
//             </div>
//           </div>

//           <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border/60 bg-muted/50 px-4 py-2 text-sm">
//             <div className="flex items-center gap-2">
//               <Checkbox
//                 checked={
//                   allSelected
//                     ? true
//                     : partiallySelected
//                     ? "indeterminate"
//                     : false
//                 }
//                 onCheckedChange={handleSelectAllChange}
//                 disabled={isBusy}
//                 aria-label="เลือกทั้งหมด"
//               />
//               <span>
//                 เลือกทั้งหมด ({selectedItemCount.toLocaleString()} /{" "}
//                 {items.length.toLocaleString()} รายการ)
//               </span>
//             </div>
//             {selectedItemCount > 0 && (
//               <span className="text-muted-foreground">
//                 สินค้าที่เลือก {selectedQuantity.toLocaleString()} ชิ้น •{" "}
//                 {formatPrice(selectedTotalPrice)}
//               </span>
//             )}
//           </div>
//         </div>

//         <div className="space-y-4">
//           {items.map((item) => {
//             const imageUrl = item.productImageUrl ?? FALLBACK_IMAGE;
//             const quantityAtCap =
//               item.maxQuantity > 0 && item.quantity >= item.maxQuantity;
//             const disableIncrease =
//               item.maxQuantity > 0 && item.quantity >= item.maxQuantity;
//             const disableDecrease = item.quantity <= 1;
//             const isItemSyncing = isSyncing || pendingId === item.id;

//             return (
//               <Card key={item.id} className="overflow-hidden">
//                 <CardContent className="flex flex-col gap-4 p-4 md:flex-row">
//                   <div className="flex items-start gap-3">
//                     <Checkbox
//                       checked={Boolean(selectedIds[item.id])}
//                       onCheckedChange={(checked) =>
//                         setItemSelection(item.id, checked === true)
//                       }
//                       disabled={isItemSyncing}
//                       aria-label={`เลือก ${item.productTitle}`}
//                       className="mt-1"
//                     />
//                     <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
//                       <Image
//                         src={imageUrl}
//                         alt={item.productTitle}
//                         fill
//                         className="object-cover"
//                       />
//                     </div>
//                   </div>

//                   <div className="flex flex-1 flex-col gap-3">
//                     <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
//                       <div>
//                         <Link
//                           href={`/products/${item.productId}`}
//                           className="text-base font-semibold text-foreground hover:underline"
//                         >
//                           {item.productTitle}
//                         </Link>
//                         <div className="text-sm text-muted-foreground">
//                           น้ำหนัก {item.weight.toLocaleString()} กรัม
//                           {item.categoryName && ` • ${item.categoryName}`}
//                         </div>
//                       </div>

//                       <div className="text-right">
//                         <div className="text-base font-semibold text-foreground">
//                           {formatPrice(item.unitPrice)}
//                         </div>
//                         {item.basePrice && item.basePrice > item.unitPrice && (
//                           <div className="text-xs text-muted-foreground line-through">
//                             {formatPrice(item.basePrice)}
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <div className="flex flex-wrap items-center gap-3">
//                       <div className="flex items-center gap-2">
//                         <Button
//                           type="button"
//                           size="icon"
//                           variant="outline"
//                           onClick={() =>
//                             handleQuantityChange(item, item.quantity - 1)
//                           }
//                           disabled={disableDecrease || isItemSyncing}
//                           aria-label="ลดจำนวน"
//                         >
//                           <Minus className="size-4" />
//                         </Button>
//                         <Input
//                           type="number"
//                           min={1}
//                           max={
//                             item.maxQuantity > 0 ? item.maxQuantity : undefined
//                           }
//                           value={item.quantity}
//                           onChange={(event) =>
//                             handleQuantityChange(
//                               item,
//                               Number(event.target.value)
//                             )
//                           }
//                           className="h-10 w-16 text-center"
//                           disabled={isItemSyncing}
//                         />
//                         <Button
//                           type="button"
//                           size="icon"
//                           variant="outline"
//                           onClick={() =>
//                             handleQuantityChange(item, item.quantity + 1)
//                           }
//                           disabled={disableIncrease || isItemSyncing}
//                           aria-label="เพิ่มจำนวน"
//                         >
//                           <Plus className="size-4" />
//                         </Button>
//                       </div>

//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => handleRemove(item)}
//                         disabled={isItemSyncing}
//                         className="text-destructive"
//                       >
//                         <Trash2 className="mr-1 size-4" /> ลบออก
//                       </Button>

//                       <div className="ml-auto text-right md:text-left">
//                         <div className="text-sm text-muted-foreground">
//                           ยอดรวม
//                         </div>
//                         <div className="text-lg font-semibold text-foreground">
//                           {formatPrice(item.subtotal)}
//                         </div>
//                       </div>
//                     </div>

//                     {item.maxQuantity === 0 && (
//                       <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
//                         สินค้าในสต็อกไม่เพียงพอสำหรับน้ำหนักนี้
//                         กรุณาลบออกจากตะกร้า
//                       </div>
//                     )}

//                     {quantityAtCap && item.maxQuantity > 0 && (
//                       <div className="rounded-md bg-amber-100 px-3 py-2 text-xs text-amber-700">
//                         ถึงจำนวนสูงสุดตามสต็อกแล้ว
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>
//       </section>

//       <aside className="space-y-4">
//         <Card>
//           <CardHeader>
//             <CardTitle>สรุปคำสั่งซื้อ</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3 text-sm">
//             <div className="flex items-center justify-between">
//               <span>จำนวนรายการ</span>
//               <span>{items.length.toLocaleString()} รายการ</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span>จำนวนสินค้า</span>
//               <span>{totalQuantity.toLocaleString()} ชิ้น</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span>รายการที่เลือก</span>
//               <span>{selectedItemCount.toLocaleString()} รายการ</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <span>จำนวนที่เลือก</span>
//               <span>{selectedQuantity.toLocaleString()} ชิ้น</span>
//             </div>
//             <div className="flex items-center justify-between text-base font-semibold text-foreground">
//               <span>ยอดรวม</span>
//               <span>{formatPrice(totalPrice)}</span>
//             </div>
//             <div className="flex items-center justify-between text-base font-semibold text-primary">
//               <span>ยอดรวมที่เลือก</span>
//               <span>{formatPrice(selectedTotalPrice)}</span>
//             </div>
//           </CardContent>
//           <CardFooter className="flex flex-col gap-2">
//             <Button
//               size="lg"
//               onClick={handleCheckout}
//               disabled={checkoutDisabled}
//               aria-busy={isCheckoutPending}
//             >
//               ดำเนินการชำระเงิน
//             </Button>
//             <Button variant="outline" asChild>
//               <Link href="/products">เลือกซื้อสินค้าต่อ</Link>
//             </Button>
//           </CardFooter>
//         </Card>
//       </aside>
//     </div>
//   );
// }

"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Minus,
  Plus,
  Receipt,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format-price";
import { Checkbox } from "@/components/ui/checkbox";
import {
  selectCartHydrated,
  selectCartItems,
  selectCartTotals,
  selectCartUserId,
  useCartStore,
} from "@/stores/cart-store";
import { CartItemDTO } from "@/types/cart";
import { toast } from "sonner";
import {
  clearCartAction,
  prepareCheckoutAction,
  syncCartUpdatesAction,
} from "./actions";
import { useRouter } from "next/navigation";

const FALLBACK_IMAGE = "/images/no-product-image.webp";

interface CartViewProps {
  initialItems: CartItemDTO[];
  userId: string;
}

function calculateTotals(items: CartItemDTO[]) {
  return items.reduce(
    (acc, item) => {
      acc.quantity += item.quantity;
      acc.total += item.subtotal;
      return acc;
    },
    { quantity: 0, total: 0 },
  );
}

export default function CartView({ initialItems, userId }: CartViewProps) {
  const router = useRouter();
  const hydrated = useCartStore(selectCartHydrated);
  const storeUserId = useCartStore(selectCartUserId);
  const storeItems = useCartStore(selectCartItems);
  const storeTotals = useCartStore(selectCartTotals);
  const selectedIds = useCartStore((state) => state.selectedIds);
  const syncFromServer = useCartStore((state) => state.syncFromServer);
  const updateLocalQuantity = useCartStore(
    (state) => state.updateLocalQuantity,
  );
  const removeLocalItem = useCartStore((state) => state.removeLocalItem);
  const setItemSelection = useCartStore((state) => state.setItemSelection);
  const setAllSelected = useCartStore((state) => state.setAllSelected);
  // ใน CartView function
  const [isSynced, setIsSynced] = useState(false); // 🟢 1. เพิ่มตัวนี้

  // const items = hydrated && storeUserId === userId ? storeItems : initialItems;
  // const items =
  //   hydrated && isSynced && storeUserId === userId ? storeItems : initialItems;
  const items =
    hydrated && isSynced && storeUserId === userId ? storeItems : initialItems;
  const fallbackTotals = useMemo(
    () => calculateTotals(initialItems),
    [initialItems],
  );
  const totals =
    hydrated && storeUserId === userId
      ? storeTotals
      : { quantity: fallbackTotals.quantity, price: fallbackTotals.total };

  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isCheckoutPending, startCheckoutTransition] = useTransition();

  const pendingUpdatesRef = useRef<Record<string, number>>({});
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestItemsRef = useRef(items);

  useEffect(() => {
    latestItemsRef.current = items;
  }, [items]);

  // 🟢 2. แก้ useEffect เป็นแบบนี้
  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      // 1. ยัดข้อมูลใหม่ใส่ Store
      syncFromServer(userId, initialItems);
      // 2. บอกระบบว่า "Sync เสร็จแล้วนะ" ใช้ข้อมูลในเครื่องได้เลย
      setIsSynced(true);
    }
  }, [initialItems, userId, syncFromServer]);

  const totalPrice = totals.price;
  const totalQuantity = totals.quantity;

  const selectedItems = useMemo(
    () => items.filter((item) => Boolean(selectedIds[item.id])),
    [items, selectedIds],
  );
  const selectedItemCount = selectedItems.length;
  const selectedQuantity = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const selectedTotalPrice = selectedItems.reduce(
    (sum, item) => sum + item.subtotal,
    0,
  );
  const allSelected = items.length > 0 && selectedItemCount === items.length;
  const partiallySelected =
    selectedItemCount > 0 && selectedItemCount < items.length;

  const runSync = useCallback(async () => {
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
      syncTimerRef.current = null;
    }

    const entries = Object.entries(pendingUpdatesRef.current);
    pendingUpdatesRef.current = {};

    if (entries.length === 0) {
      setPendingId(null);
      return;
    }

    setIsSyncing(true);

    try {
      const updates = entries.map(([cartItemId, quantity]) => ({
        cartItemId,
        quantity,
      }));

      const result = await syncCartUpdatesAction(updates);

      if (!result.success || !result.cart) {
        toast.error(result.message ?? "ไม่สามารถอัปเดตตะกร้าได้");
        syncFromServer(userId, latestItemsRef.current);
      } else {
        syncFromServer(userId, result.cart);
      }
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาดในการซิงก์ตะกร้า");
      syncFromServer(userId, latestItemsRef.current);
    } finally {
      setPendingId(null);
      setIsSyncing(false);
    }
  }, [syncFromServer, userId]);

  const queueSync = useCallback(
    (cartItemId: string, quantity: number, immediate = false) => {
      pendingUpdatesRef.current[cartItemId] = quantity;

      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
        syncTimerRef.current = null;
      }

      if (immediate) {
        runSync();
      } else {
        syncTimerRef.current = setTimeout(runSync, 500);
      }
    },
    [runSync],
  );

  useEffect(() => {
    return () => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
        syncTimerRef.current = null;
      }

      if (Object.keys(pendingUpdatesRef.current).length > 0) {
        runSync();
      }
    };
  }, [runSync]);

  const handleQuantityChange = (item: CartItemDTO, nextQuantity: number) => {
    const normalized = Number.isFinite(nextQuantity)
      ? Math.max(0, Math.floor(nextQuantity))
      : item.quantity;
    const bounded =
      item.maxQuantity > 0
        ? Math.min(normalized, item.maxQuantity)
        : normalized;

    if (bounded === item.quantity) return;

    setPendingId(item.id);

    if (bounded <= 0) {
      removeLocalItem(item.id);
    } else {
      updateLocalQuantity(item.id, bounded);
    }

    queueSync(item.id, bounded);
  };

  const handleRemove = (item: CartItemDTO) => {
    setPendingId(item.id);
    removeLocalItem(item.id);
    queueSync(item.id, 0, true);
  };

  const handleRemoveSelected = () => {
    if (!selectedItems.length) return;

    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
      syncTimerRef.current = null;
    }

    for (const item of selectedItems) {
      removeLocalItem(item.id);
      pendingUpdatesRef.current[item.id] = 0;
    }

    runSync();
  };

  const handleSelectAllChange = (checked: boolean | "indeterminate") => {
    setAllSelected(checked === true);
  };

  const handleClear = () => {
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
      syncTimerRef.current = null;
    }
    pendingUpdatesRef.current = {};
    setIsClearing(true);
    startTransition(async () => {
      const result = await clearCartAction();

      if (!result.success || !result.cart) {
        toast.error(result.message ?? "ไม่สามารถล้างตะกร้าได้");
        setIsClearing(false);
        return;
      }

      syncFromServer(userId, result.cart);
      toast.success("ล้างตะกร้าเรียบร้อยแล้ว");
      setIsClearing(false);
    });
  };

  const isBusy = isPending || isClearing || isSyncing;
  const checkoutDisabled =
    selectedItemCount === 0 ||
    isBusy ||
    isCheckoutPending ||
    selectedTotalPrice <= 0;

  const handleCheckout = () => {
    if (selectedItemCount === 0) {
      toast.error("กรุณาเลือกรายการสินค้าที่ต้องการชำระเงิน");
      return;
    }

    const ids = selectedItems.map((item) => item.id);

    startCheckoutTransition(async () => {
      const result = await prepareCheckoutAction({ cartItemIds: ids });

      if (!result.success || !result.items) {
        toast.error(result.message ?? "ไม่สามารถเตรียมข้อมูลชำระเงินได้");
        return;
      }

      const params = new URLSearchParams();
      params.set("items", ids.join(","));
      router.push(`/checkout?${params.toString()}`);
    });
  };

  if (items.length === 0) {
    return (
      <Card className="mx-auto max-w-3xl border-dashed">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            ตะกร้าของคุณยังว่างอยู่
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-center text-muted-foreground">
          <p>เลือกชมสินค้าแล้วเพิ่มลงตะกร้าเพื่อเริ่มสั่งซื้อ</p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button asChild size="lg">
            <Link href="/products">ไปหน้าสินค้า</Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(260px,1fr)]">
      <section className="space-y-4">
        {/* HEADER */}
        <div className="space-y-3">
          {/* ✅ ใช้ flex-row (แนวนอน) และ justify-between (ชิดขอบซ้ายขวา) */}
          <div className="flex flex-row items-center justify-between gap-2">
            {/* 1. หัวข้อ (จะอยู่ซ้ายสุดโดยอัตโนมัติ) */}
            <h1 className="text-xl font-semibold text-foreground shrink-0">
              ตะกร้าสินค้า
            </h1>

            {/* 2. กลุ่มปุ่ม (จะถูกดันไปขวาสุด) */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveSelected}
                disabled={isBusy || selectedItemCount === 0}
                className="text-destructive text-[10px] px-2 h-8" // ปรับขนาดให้พอดีมือถือ
              >
                ลบที่เลือก
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={isBusy}
                className="text-[10px] px-2 h-8"
              >
                ล้างตะกร้า
              </Button>
            </div>
          </div>

          {/* SELECT ALL */}
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border/60 bg-muted/50 px-4 py-2 text-sm">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={
                  allSelected
                    ? true
                    : partiallySelected
                      ? "indeterminate"
                      : false
                }
                onCheckedChange={handleSelectAllChange}
                disabled={isBusy}
              />
              <span className="text-responsive-info">
                เลือกทั้งหมด ({selectedItemCount.toLocaleString()} /{" "}
                {items.length.toLocaleString()} รายการ)
              </span>
            </div>

            {selectedItemCount > 0 && (
              <span className="text-muted-foreground text-responsive-info">
                สินค้าที่เลือก {selectedQuantity.toLocaleString()} ชิ้น •{" "}
                {formatPrice(selectedTotalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* CART ITEMS */}
        <div className="space-y-4">
          {items.map((item) => {
            const imageUrl = item.productImageUrl ?? FALLBACK_IMAGE;
            const quantityAtCap =
              item.maxQuantity > 0 && item.quantity >= item.maxQuantity;
            const disableIncrease =
              item.maxQuantity > 0 && item.quantity >= item.maxQuantity;
            const disableDecrease = item.quantity <= 1;
            const isItemSyncing = isSyncing || pendingId === item.id;

            return (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="flex flex-col gap-4 p-4 md:flex-row ">
                  {/* LEFT: checkbox + image */}
                  {/* <div className="flex items-start gap-3">
                    <Checkbox
                      checked={Boolean(selectedIds[item.id])}
                      onCheckedChange={(checked) =>
                        setItemSelection(item.id, checked === true)
                      }
                      disabled={isItemSyncing}
                      className="mt-1"
                    />

                    <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={imageUrl}
                        alt={item.productTitle}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* RIGHT OF IMAGE: price block */}
                  {/* <div className="flex flex-col justify-between text-right min-w-[90px]">
                      <div>
                        <div className="text-base font-semibold text-foreground">
                          {formatPrice(item.unitPrice)}
                        </div>

                        {item.basePrice && item.basePrice > item.unitPrice && (
                          <div className="text-xs text-muted-foreground line-through">
                            {formatPrice(item.basePrice)}
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="text-sm text-muted-foreground">
                          ยอดรวม
                        </div>
                        <div className="text-lg font-semibold text-foreground">
                          {formatPrice(item.subtotal)}
                        </div>
                      </div>
                    </div>
                  </div>  */}

                  <div className="flex items-start gap-3 w-full -mt-6">
                    <Checkbox
                      checked={Boolean(selectedIds[item.id])}
                      onCheckedChange={(checked) =>
                        setItemSelection(item.id, checked === true)
                      }
                      disabled={isItemSyncing}
                      className="mt-1"
                    />

                    <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={imageUrl}
                        alt={item.productTitle}
                        fill
                        className="object-cover"
                        unoptimized={true}
                      />
                    </div>

                    {/* ⭐ ราคาอยู่ขวาสุดจริง ด้วย ml-auto */}
                    <div className="ml-auto flex flex-col items-end text-right min-w-[100px]">
                      <div>
                        <div className="text-base font-semibold text-foreground">
                          {formatPrice(item.unitPrice)}
                        </div>

                        {item.basePrice && item.basePrice > item.unitPrice && (
                          <div className="text-xs text-muted-foreground line-through">
                            {formatPrice(item.basePrice)}
                          </div>
                        )}
                      </div>

                      {/* ⭐ ยอดรวมอยู่ข้างหน้าตัวเลข */}
                      <div className="mt-1 text-right">
                        <div className="text-sm text-muted-foreground">
                          ยอดรวม {formatPrice(item.subtotal)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SECTION — product info + quantity controls */}
                  <div className="flex flex-1 flex-col gap-3 -mb-6">
                    {/* PRODUCT TITLE */}
                    <div>
                      <Link
                        href={`/products/${item.productId}`}
                        className="text-base font-semibold text-foreground hover:underline text-responsive-detail"
                      >
                        {item.productTitle}
                      </Link>

                      {/* <div className="text-sm text-muted-foreground">
                        น้ำหนัก {item.weight.toLocaleString()} กรัม
                        {item.categoryName && ` • ${item.categoryName}`}
                      </div> */}
                      <div className="text-responsive-detail text-muted-foreground">
                        {/* เช็คว่ามีข้อมูล Variant Name (เลข 100) หรือไม่ ถ้ามีให้ใช้ก่อน ถ้าไม่มีค่อยใช้ Weight */}
                        {item.weight > 0 ? (
                          <>
                            {/* ✅ แก้ตรงนี้: ให้เช็ค variantName ก่อน */}
                            ตัวเลือก{" "}
                            {item.variantName ||
                              item.weight.toLocaleString()}{" "}
                            {item.unitLabel}
                          </>
                        ) : (
                          <span>-</span>
                        )}

                        {/* ส่วนแสดงหมวดหมู่ */}
                        {item.categoryName && ` • ${item.categoryName}`}
                      </div>
                    </div>

                    {/* QUANTITY + REMOVE + subtotal */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            handleQuantityChange(item, item.quantity - 1)
                          }
                          disabled={disableDecrease || isItemSyncing}
                          className="h-8 w-8 md:h-10 md:w-10"
                        >
                          <Minus className="size-4" />
                        </Button>

                        <Input
                          type="number"
                          min={1}
                          max={
                            item.maxQuantity > 0 ? item.maxQuantity : undefined
                          }
                          value={item.quantity}
                          onChange={(event) =>
                            handleQuantityChange(
                              item,
                              Number(event.target.value),
                            )
                          }
                          // className="h-10 w-16 text-center"
                          className="h-8 w-12 text-center text-xs md:h-10 md:w-16 md:text-base p-0"
                          disabled={isItemSyncing}
                        />

                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          onClick={() =>
                            handleQuantityChange(item, item.quantity + 1)
                          }
                          disabled={disableIncrease || isItemSyncing}
                          className="h-8 w-8 md:h-10 md:w-10"
                        >
                          <Plus className="size-4" />
                        </Button>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(item)}
                        disabled={isItemSyncing}
                        // className="text-destructive"
                        className="text-destructive h-8 px-2 text-xs md:h-10 md:px-3 md:text-sm"
                      >
                        <Trash2 className="mr-1 size-4" /> ลบออก
                      </Button>
                    </div>

                    {/* STATUS MESSAGES */}
                    {item.maxQuantity === 0 && (
                      <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        สินค้าในสต็อกไม่เพียงพอ กรุณาลบออกจากตะกร้า
                      </div>
                    )}

                    {quantityAtCap && item.maxQuantity > 0 && (
                      <div className="rounded-md bg-amber-100 px-3 py-2 text-xs text-amber-700">
                        ถึงจำนวนสูงสุดตามสต็อกแล้ว
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
      {/* SUMMARY */}

      {/* SUMMARY SECTION - REDESIGNED */}
      <aside className="space-y-4">
        <Card className="border-border/60 shadow-lg shadow-black/5 overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Receipt className="size-5 text-primary" />
              สรุปคำสั่งซื้อ
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4  text-sm">
            {/* รายละเอียด */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>จำนวนรายการทั้งหมด</span>
                <span className="font-medium text-foreground">
                  {items.length.toLocaleString()} รายการ
                </span>
              </div>

              <div className="flex items-center justify-between text-muted-foreground">
                <span>จำนวนสินค้าทั้งหมด</span>
                <span className="font-medium text-foreground">
                  {totalQuantity.toLocaleString()} ชิ้น
                </span>
              </div>

              {/* แสดงส่วนลด (ถ้ามีในอนาคต) - ใส่เตรียมไว้ให้ดูโปร */}
              {/* <div className="flex items-center justify-between text-green-600">
                <span>ส่วนลด</span>
                <span>- 0 ฿</span>
              </div> */}
            </div>

            {/* <Separator className="my-4" /> */}

            {/* ส่วนแสดงราคา */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">ยอดรวมสินค้า</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>

              {/* Highlight ยอดที่ต้องจ่ายจริง */}
              <div className="flex items-center justify-between rounded-lg bg-primary/10 p-3 mt-2">
                <span className="text-base font-semibold text-primary">
                  ยอดสุทธิที่เลือก
                </span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(selectedTotalPrice)}
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-6">
            <Button
              size="lg"
              className="w-full"
              onClick={handleCheckout}
              disabled={checkoutDisabled}
              aria-busy={isCheckoutPending}
            >
              {isCheckoutPending ? (
                "กำลังประมวลผล..."
              ) : (
                <>
                  ดำเนินการชำระเงิน <ArrowRight className="size-5" />
                </>
              )}
            </Button>

            <Button
              size="lg"
              variant="outline" // ใช้แบบ Outline ให้ดูพรีเมียมคู่กัน
              className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground" // ✅ บังคับสีให้เป็นธีมเดียวกับปุ่มหลัก
              asChild
            >
              <Link href="/products">เลือกซื้อสินค้าต่อ</Link>
            </Button>

            {/* Trust Signal: เพิ่มความน่าเชื่อถือ */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground py-1">
              <ShieldCheck className="size-3.5" />
              <span>ชำระเงินปลอดภัย 100%</span>
            </div>
          </CardFooter>
        </Card>
      </aside>
    </div>
  );
}
