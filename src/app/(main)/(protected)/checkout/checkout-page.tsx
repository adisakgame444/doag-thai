"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { CartItemDTO } from "@/types/cart";
import { AddressDTO } from "@/types/address";
import { addressSchema, AddressFormValues } from "@/lib/validation/address";
import {
  createAddressAction,
  deleteAddressAction,
  listAddressesAction,
  setDefaultAddressAction,
  updateAddressAction,
} from "./address-actions";
import { formatPrice } from "@/lib/format-price";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowRight, MoreVertical, Receipt, ShieldCheck } from "lucide-react";
import { useCheckoutStore } from "@/stores/checkout-store";

interface CheckoutPageProps {
  cartItems: CartItemDTO[];
  addresses: AddressDTO[];
  subtotal: number;
  codEligible: boolean;
  itemsParam: string;
}

export default function CheckoutPage({
  cartItems,
  addresses,
  subtotal,
  codEligible,
  itemsParam,
}: CheckoutPageProps) {
  const router = useRouter();
  const setSelection = useCheckoutStore((state) => state.setSelection);
  const [addressList, setAddressList] = useState<AddressDTO[]>(addresses);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressDTO | null>(null);
  const [isListPending, startListTransition] = useTransition();
  const [isMutationPending, startMutationTransition] = useTransition();
  const [isCheckoutPending, startCheckoutTransition] = useTransition();
  const itemsQueryParam = useMemo(() => {
    if (itemsParam && itemsParam.length > 0) {
      return itemsParam;
    }
    return cartItems.map((item) => item.id).join(",");
  }, [itemsParam, cartItems]);

  useEffect(() => {
    const defaultAddress = addressList.find((address) => address.isDefault);
    const hasSelectedAddress = selectedAddressId
      ? addressList.some((address) => address.id === selectedAddressId)
      : false;

    if (defaultAddress && (!hasSelectedAddress || selectedAddressId === null)) {
      setSelectedAddressId(defaultAddress.id);
    } else if (!hasSelectedAddress && addressList.length > 0) {
      setSelectedAddressId(addressList[0].id);
    } else if (addressList.length === 0) {
      setSelectedAddressId(null);
    }
  }, [addressList, selectedAddressId]);

  const totalQuantity = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const loadAddresses = () => {
    startListTransition(async () => {
      const result = await listAddressesAction();
      if (result.success && result.addresses) {
        setAddressList(result.addresses);
      } else if (!result.success) {
        toast.error(result.message ?? "ไม่สามารถโหลดที่อยู่ได้");
      }
    });
  };

  const handleCreateAddress = (values: AddressFormValues) => {
    startMutationTransition(async () => {
      const result = await createAddressAction(values);
      if (!result.success) {
        toast.error(result.message ?? "ไม่สามารถเพิ่มที่อยู่ได้");
        return;
      }

      toast.success("เพิ่มที่อยู่เรียบร้อยแล้ว");
      setIsCreateDialogOpen(false);
      setEditingAddress(null);
      loadAddresses();
    });
  };

  const handleUpdateAddress = (
    addressId: string,
    values: AddressFormValues,
  ) => {
    startMutationTransition(async () => {
      const result = await updateAddressAction(addressId, values);
      if (!result.success) {
        toast.error(result.message ?? "ไม่สามารถบันทึกที่อยู่ได้");
        return;
      }

      toast.success("บันทึกที่อยู่เรียบร้อยแล้ว");
      setEditingAddress(null);
      setIsCreateDialogOpen(false);
      loadAddresses();
    });
  };

  const handleDeleteAddress = (addressId: string) => {
    startMutationTransition(async () => {
      const result = await deleteAddressAction(addressId);
      if (!result.success) {
        toast.error(result.message ?? "ไม่สามารถลบที่อยู่นี้ได้");
        return;
      }

      toast.success("ลบที่อยู่เรียบร้อยแล้ว");
      if (result.addresses) {
        setAddressList(result.addresses);
      } else {
        loadAddresses();
      }
    });
  };

  const handleSetDefault = (addressId: string) => {
    startMutationTransition(async () => {
      const result = await setDefaultAddressAction(addressId);
      if (!result.success) {
        toast.error(result.message ?? "ไม่สามารถตั้งค่าที่อยู่เริ่มต้นได้");
        return;
      }

      toast.success("ตั้งค่าที่อยู่เริ่มต้นเรียบร้อยแล้ว");
      if (result.addresses) {
        setAddressList(result.addresses);
      } else {
        loadAddresses();
      }
    });
  };

  const selectedAddress = selectedAddressId
    ? (addressList.find((address) => address.id === selectedAddressId) ?? null)
    : null;

  useEffect(() => {
    if (selectedAddressId) {
      setSelection({
        itemsParam: itemsQueryParam,
        addressId: selectedAddressId,
      });
    }
  }, [selectedAddressId, itemsQueryParam, setSelection]);

  return (
    <div className="container mx-auto space-y-6 py-6 md:py-8 md:px-0 px-[15px]">
      <div className="space-y-2">
        <h1 className="text-lg font-semibold text-foreground md:text-2xl">
          ชำระเงิน
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          ตรวจสอบสินค้าและกรอกข้อมูลเพื่อดำเนินการสั่งซื้อ
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <section className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>สินค้าที่เลือก</CardTitle>
              <CardDescription>
                ทั้งหมด {cartItems.length} รายการ •{" "}
                {totalQuantity.toLocaleString()} ชิ้น
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-lg border border-border/60 bg-card px-4 py-3 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground md:text-base">
                      {item.productTitle}
                    </p>
                    <p className="text-xs text-muted-foreground md:text-sm">
                      น้ำหนัก {item.weight.toLocaleString()} กรัม •{" "}
                      {item.quantity.toLocaleString()} ชิ้น
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-foreground md:text-base">
                    {formatPrice(item.subtotal)}
                  </div>
                </div>
              ))} */}

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-lg border border-border/60 bg-card px-4 py-3 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground md:text-base">
                      {item.productTitle}
                    </p>
                    {/* ✅✅✅ แก้ไขจุดนี้ครับ ✅✅✅ */}
                    <p className="text-xs text-muted-foreground md:text-sm">
                      ตัวเลือก {item.weight.toLocaleString()} {item.unitLabel} •{" "}
                      จำนวน {item.quantity.toLocaleString()} ชิ้น
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-foreground md:text-base">
                    {formatPrice(item.subtotal)}
                  </div>
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between text-sm font-semibold text-foreground md:text-base">
                <span>ยอดรวมสินค้า</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {!codEligible && (
                <div className="rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  สินค้าบางรายการไม่รองรับการเก็บเงินปลายทาง จะสามารถชำระผ่าน
                  PromptPay ได้เท่านั้น
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>ที่อยู่สำหรับจัดส่ง</CardTitle>

                <CardDescription className="text-xs md:text-sm mb-1">
                  เลือกที่อยู่หรือเพิ่มใหม่เพื่อใช้ในการจัดส่ง
                </CardDescription>
              </div>
              <Button
                size="sm"
                onClick={() => setIsCreateDialogOpen(true)}
                className="px-2 py-1 text-xs h-7 md:px-4 md:py-2 md:text-sm md:h-9"
              >
                เพิ่มที่อยู่
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 mt-1">
              {addressList.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border/60 px-4 py-6 text-center text-sm text-muted-foreground">
                  ยังไม่มีที่อยู่ กรุณาเพิ่มที่อยู่ใหม่ก่อนดำเนินการต่อ
                </div>
              ) : (
                <div className="space-y-3">
                  {addressList.map((address) => {
                    const isSelected = selectedAddressId === address.id;
                    return (
                      <div
                        key={address.id}
                        className={cn(
                          "flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 transition-colors",
                          isSelected && "border-primary shadow-sm",
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (!isListPending && !isMutationPending) {
                              setSelectedAddressId(address.id);
                            }
                          }}
                          className="flex flex-1 cursor-pointer items-start gap-3 text-left"
                          disabled={isListPending || isMutationPending}
                        >
                          <span
                            className={cn(
                              "mt-1 inline-flex size-3 rounded-full border",
                              isSelected
                                ? "border-primary bg-primary"
                                : "border-muted-foreground",
                            )}
                            aria-hidden="true"
                          />
                          <span className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-semibold text-foreground md:text-base">
                                {address.recipient}
                              </span>
                              {address.isDefault && (
                                <Badge variant="secondary" className="text-xs">
                                  ค่าเริ่มต้น
                                </Badge>
                              )}
                              {address.label && (
                                <Badge variant="outline" className="text-xs">
                                  {address.label}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground md:text-sm">
                              เบอร์ {address.phone}
                            </p>
                            <p className="text-xs text-muted-foreground md:text-sm">
                              {address.line1}
                              {address.line2 ? `, ${address.line2}` : ""}
                            </p>
                            <p className="text-xs text-muted-foreground md:text-sm">
                              {address.subdistrict}, {address.district},{" "}
                              {address.province} {address.postalCode}
                            </p>
                          </span>
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!address.isDefault && (
                              <DropdownMenuItem
                                onClick={() => handleSetDefault(address.id)}
                                disabled={isMutationPending}
                              >
                                ตั้งเป็นค่าเริ่มต้น
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingAddress(address);
                                setIsCreateDialogOpen(true);
                              }}
                              disabled={isMutationPending}
                            >
                              แก้ไข
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteAddress(address.id)}
                              disabled={isMutationPending}
                              className="text-destructive focus:text-destructive"
                            >
                              ลบที่อยู่
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Receipt className="size-5 text-primary" />
                สรุปคำสั่งซื้อ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 mb-1 text-sm">
              <div className="flex items-center justify-between">
                <span>ยอดรวมสินค้า</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>ค่าจัดส่ง (คำนวณในขั้นตอนถัดไป)</span>
                <span>-</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full mt-3"
                size="lg"
                onClick={() => {
                  if (!selectedAddress) {
                    toast.error("กรุณาเลือกที่อยู่สำหรับจัดส่ง");
                    return;
                  }

                  // 🟢 เริ่ม Transition เพื่อให้ปุ่มหมุนติ้วๆ
                  startCheckoutTransition(() => {
                    const params = new URLSearchParams();
                    if (itemsQueryParam) {
                      params.set("items", itemsQueryParam);
                    }
                    params.set("address", selectedAddress.id);

                    setSelection({
                      itemsParam: itemsQueryParam,
                      addressId: selectedAddress.id,
                    });

                    router.push(`/checkout/payment?${params.toString()}`);
                  });
                }}
                disabled={
                  !selectedAddress ||
                  isListPending ||
                  isMutationPending ||
                  isCheckoutPending // 🟢 ปิดปุ่มเมื่อกำลังโหลด
                }
              >
                {isCheckoutPending ? (
                  <>กำลังประมวลผล...</>
                ) : (
                  <>
                    ไปขั้นตอนเลือกวิธีชำระเงิน <ArrowRight className="size-5" />
                  </>
                )}
              </Button>
            </CardFooter>
            {/* ✅ Trust Signal */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-3">
              <ShieldCheck className="size-3.5 text-green-600" />
              <span>ข้อมูลของคุณปลอดภัย 100%</span>
            </div>
          </Card>
        </aside>
      </div>

      <AddressDialog
        open={isCreateDialogOpen}
        onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) {
            setEditingAddress(null);
          }
        }}
        onSubmit={(values) => {
          if (editingAddress) {
            handleUpdateAddress(editingAddress.id, values);
          } else {
            handleCreateAddress(values);
          }
        }}
        isSubmitting={isMutationPending}
        defaultValues={editingAddress ?? undefined}
        mode={editingAddress ? "edit" : "create"}
      />
    </div>
  );
}

interface AddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AddressFormValues) => void;
  isSubmitting: boolean;
  defaultValues?: AddressDTO;
  mode: "create" | "edit";
}

function AddressDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  defaultValues,
  mode,
}: AddressDialogProps) {
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      label: defaultValues?.label ?? "",
      recipient: defaultValues?.recipient ?? "",
      phone: defaultValues?.phone ?? "",
      line1: defaultValues?.line1 ?? "",
      line2: defaultValues?.line2 ?? "",
      province: defaultValues?.province ?? "",
      district: defaultValues?.district ?? "",
      subdistrict: defaultValues?.subdistrict ?? "",
      postalCode: defaultValues?.postalCode ?? "",
      isDefault: defaultValues?.isDefault ?? false,
    },
  });

  useEffect(() => {
    form.reset({
      label: defaultValues?.label ?? "",
      recipient: defaultValues?.recipient ?? "",
      phone: defaultValues?.phone ?? "",
      line1: defaultValues?.line1 ?? "",
      line2: defaultValues?.line2 ?? "",
      province: defaultValues?.province ?? "",
      district: defaultValues?.district ?? "",
      subdistrict: defaultValues?.subdistrict ?? "",
      postalCode: defaultValues?.postalCode ?? "",
      isDefault: defaultValues?.isDefault ?? false,
    });
  }, [defaultValues, form]);

  const title = mode === "edit" ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่";
  const description =
    mode === "edit"
      ? "ปรับปรุงข้อมูลสำหรับการจัดส่ง"
      : "กรอกข้อมูลที่อยู่เพื่อใช้งานในการจัดส่งสินค้า";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <DialogContent className='max-w-lg'> */}
      <DialogContent
        className="
      w-[92vw] max-w-sm sm:max-w-md md:max-w-lg 
      max-h-[90vh] overflow-y-auto
      px-3 sm:px-6 py-4 sm:py-6
      rounded-xl sm:rounded-2xl
    "
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values) => onSubmit(values))}
          >
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ป้ายกำกับ</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="บ้าน, ที่ทำงาน ฯลฯ (ไม่จำเป็น)"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recipient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อผู้รับ</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ชื่อผู้รับสินค้า"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>เบอร์โทรศัพท์</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="กรอกเบอร์โทรศัพท์"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="line1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ที่อยู่</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="บ้านเลขที่ หมู่ ซอย ถนน"
                      rows={3}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="line2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ข้อมูลเพิ่มเติม (ถ้ามี)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="เช่น จุดสังเกต หรือคำแนะนำเพิ่มเติม"
                      rows={2}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-3 md:grid-cols-2">
              <FormField
                control={form.control}
                name="province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>จังหวัด</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="กรอกจังหวัด"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>อำเภอ / เขต</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="กรอกอำเภอหรือเขต"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subdistrict"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ตำบล / แขวง</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="กรอกตำบลหรือแขวง"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>รหัสไปรษณีย์</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="กรอกรหัสไปรษณีย์"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0 rounded-md border border-dashed border-border/60 px-3 py-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                  </FormControl>
                  <div className="space-y-0.5">
                    <FormLabel>ตั้งเป็นที่อยู่ค่าเริ่มต้น</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      ใช้ที่อยู่นี้เป็นตัวเลือกแรกสำหรับคำสั่งซื้อถัดไป
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                บันทึกที่อยู่
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
