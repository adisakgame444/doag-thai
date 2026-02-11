"use client";

import { LoadingButton } from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CategoryWithProducts } from "@/types/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Plus, Trash2, Scale, Package, Milk } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import ProductImageUpload from "./product-image-upload";
import { useCallback, useEffect } from "react";
import { createProduct, updateProduct } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ProductWithMainImage } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductFormProps {
  categories: CategoryWithProducts[];
  product?: ProductWithMainImage;
}

const productSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Product title must be at least 3 characters" }),
  type: z.enum(["WEIGHT", "UNIT"]),
  unitLabel: z.string().min(1),
  lowStock: z.coerce
    .number()
    .min(1, { message: "Low stock must be at least 1" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  cod: z.boolean(),
  cost: z.coerce.number().positive({ message: "Cost must be at least 0" }),
  // stock: z.coerce.number().positive({ message: "Stock must be at least 0" }),
  stock: z.coerce.number().min(0, { message: "Stock must be at least 0" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
  images: z
    .array(
      z.custom<File>(
        (val) => typeof File !== "undefined" && val instanceof File,
        {
          message: "Invalid file",
        },
      ),
    )
    .min(0)
    .default([]),
  mainImageIndex: z.number().int().or(z.literal(-1)),
  deletedImageIds: z.array(z.string()).default([]),
  weights: z
    .array(
      z.object({
        name: z.string().optional(), // เพิ่ม name (สำหรับสินค้า UNIT)
        weight: z.coerce
          .number()
          .positive({ message: "Weight must be at least 0" }),
        basePrice: z.coerce
          .number()
          .positive({ message: "Base price must be at least 0" }),
        price: z.coerce
          .number()
          .positive({ message: "Price must be at least 0" }),
      }),
    )
    .default([])
    .optional(),
});

// ✅ 3. สร้างตัวเลือกปุ่ม (Config)
const UNIT_OPTIONS = [
  { id: "gram", value: "gram", label: "กรัม", type: "WEIGHT", icon: Scale },
  { id: "piece", value: "piece", label: "ชิ้น", type: "UNIT", icon: Package },
  { id: "bottle", value: "bottle", label: "ขวด", type: "UNIT", icon: Milk },
] as const;

type ProductFormValues = z.input<typeof productSchema>;

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();

  const form = useForm<ProductFormValues>({
    mode: "onSubmit",
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      type: "WEIGHT",
      unitLabel: "กรัม",
      lowStock: 10,
      description: "",
      cod: false,
      cost: 0,
      stock: 0,
      categoryId: "",
      images: [],
      mainImageIndex: -1,
      deletedImageIds: [],
      weights: [{ weight: 0, basePrice: 0, price: 0 }],
    },
  });

  // ตัวแปรสำหรับเช็คสถานะปัจจุบัน
  const productType = form.watch("type");
  const unitLabel = form.watch("unitLabel");

  // Prefill form when editing
  // useEffect(() => {
  //   if (!product) return;
  //   const mainIndex =
  //     product.ProductImage?.findIndex((img) => img.isMain) ?? -1;
  //   form.reset({
  //     title: product.title ?? "",
  //     lowStock: (product.lowStock as number) ?? 1,
  //     description: product.description ?? "",
  //     cod: Boolean(product.cod),
  //     cost: (product.cost as number) ?? 0,
  //     stock: (product.stock as number) ?? 0,
  //     categoryId: product.categoryId ?? "",
  //     images: [], // new uploads only; existing shown via prop
  //     mainImageIndex: mainIndex >= 0 ? mainIndex : -1,
  //     deletedImageIds: [],
  //     weights:
  //       product.ProductWeight && product.ProductWeight.length > 0
  //         ? product.ProductWeight.map((w) => ({
  //             weight: Number(w.weight) || 0,
  //             basePrice: Number(w.basePrice) || 0,
  //             price: Number(w.price) || 0,
  //           }))
  //         : [{ weight: 0, basePrice: 0, price: 0 }],
  //   });
  // }, [product, form]);

  useEffect(() => {
    if (!product) return;

    const sortedWeights =
      product.ProductWeight && product.ProductWeight.length > 0
        ? [...product.ProductWeight]
            .sort((a, b) => Number(a.weight) - Number(b.weight))
            .map((w) => ({
              name: w.name || "", // Map ชื่อ
              weight: Number(w.weight) || 0,
              basePrice: Number(w.basePrice) || 0,
              price: Number(w.price) || 0,
            }))
        : [{ weight: 0, basePrice: 0, price: 0 }];

    const mainIndex =
      product.ProductImage?.findIndex((img) => img.isMain) ?? -1;

    form.reset({
      title: product.title ?? "",
      type: (product.type as "WEIGHT" | "UNIT") ?? "WEIGHT",
      unitLabel: product.unitLabel ?? "กรัม",
      lowStock: (product.lowStock as number) ?? 1,
      description: product.description ?? "",
      cod: Boolean(product.cod),
      cost: (product.cost as number) ?? 0,
      stock: (product.stock as number) ?? 0,
      categoryId: product.categoryId ?? "",
      images: [],
      mainImageIndex: mainIndex >= 0 ? mainIndex : -1,
      deletedImageIds: [],
      weights: sortedWeights,
    });
  }, [product, form]);

  const handleImagesChange = useCallback(
    (files: File[], mainIndex: number, deletedIds: string[]) => {
      const hasImages = files && files.length > 0;
      form.setValue("images", files, {
        shouldValidate: hasImages,
        shouldDirty: true,
      });
      form.setValue("mainImageIndex", mainIndex, {
        shouldValidate: hasImages || mainIndex >= 0,
        shouldDirty: true,
      });
      if (deletedIds) {
        form.setValue("deletedImageIds", deletedIds, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    },
    [form],
  );

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "weights",
  });

  // ✅ 5. ฟังก์ชันเปลี่ยนหน่วยสินค้า (กดปุ่มแล้วเปลี่ยนค่าอัตโนมัติ)
  const handleSelectUnit = (option: (typeof UNIT_OPTIONS)[number]) => {
    form.setValue("type", option.type as "WEIGHT" | "UNIT");
    form.setValue("unitLabel", option.label);

    // Reset weights ให้เป็นค่าเริ่มต้นที่ถูกต้อง
    const currentWeights = form.getValues("weights");
    if (currentWeights) {
      form.setValue(
        "weights",
        currentWeights.map((w) => ({
          ...w,
          // ถ้าเป็น UNIT (ชิ้น/ขวด) ให้ weight=1 ไว้เสมอ
          weight: option.type === "UNIT" ? 1 : 0,
          name: "", // เคลียร์ชื่อ
        })),
      );
    }
  };

  async function onSubmit(values: ProductFormValues) {
    // If creating and there are no existing images and no new images, prevent submit
    if (!product && (!values.images || values.images.length === 0)) {
      toast.error("Please upload at least one image");
      return;
    }

    const weightsPayload =
      values.weights?.map((w) => ({
        name: w.name,
        weight: Number(w.weight),
        basePrice: Number(w.basePrice),
        price: Number(w.price),
      })) ?? [];

    const result = product
      ? await updateProduct({
          id: product.id,
          title: values.title,
          type: values.type,
          unitLabel: values.unitLabel,
          lowStock: values.lowStock as number,
          description: values.description,
          cod: values.cod,
          cost: values.cost as number,
          stock: values.stock as number,
          categoryId: values.categoryId,
          mainImageIndex: values.mainImageIndex,
          images: values.images ?? [],
          weights: weightsPayload,
          deletedImageIds: values.deletedImageIds ?? [],
        })
      : await createProduct({
          title: values.title,
          type: values.type,
          unitLabel: values.unitLabel,
          lowStock: values.lowStock as number,
          description: values.description,
          cod: values.cod,
          cost: values.cost as number,
          stock: values.stock as number,
          categoryId: values.categoryId,
          mainImageIndex: values.mainImageIndex,
          images: values.images ?? [],
          weights: weightsPayload,
        });

    const { message, error } = result;

    if (error) {
      toast.error(error);
    } else {
      toast.success(message);
      router.push("/admin/product");
      form.reset();
    }
  }

  const loading = form.formState.isSubmitting;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">
          {product ? "Edit Product" : "Product Information"}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {product
            ? "Update the details of your product"
            : "Enter the details of your new product"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-3">
              <FormLabel className="text-base font-semibold">
                Product Unit Type
              </FormLabel>
              <div className="grid grid-cols-3 gap-3">
                {UNIT_OPTIONS.map((option) => {
                  const isSelected = unitLabel === option.label;
                  return (
                    <div
                      key={option.value}
                      onClick={() => handleSelectUnit(option)}
                      className={cn(
                        "cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all hover:bg-muted/50",
                        isSelected
                          ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                          : "border-muted bg-background text-muted-foreground",
                      )}
                    >
                      <option.icon
                        className={cn(
                          "w-6 h-6",
                          isSelected ? "text-primary" : "text-muted-foreground",
                        )}
                      />
                      <div className="text-center font-bold text-sm sm:text-base">
                        {option.label}
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Hidden Inputs เพื่อให้ Form รู้จักค่า */}
              <input type="hidden" {...form.register("type")} />
              <input type="hidden" {...form.register("unitLabel")} />
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-medium">Basic Information</h3>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-20"
                        placeholder="Enter product description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={
                          (field.value as string) || (product?.categoryId ?? "")
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem
                              key={c.id}
                              value={c.id}
                              disabled={c.status !== "active"}
                            >
                              {c.name}
                              {c.status !== "active" ? " (inactive)" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="images"
              render={() => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <ProductImageUpload
                      onImageChange={handleImagesChange}
                      existingImages={product?.ProductImage}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <h3 className="font-medium">Pricing Information</h3>

              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost (from stock)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value as number | string | undefined}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="0.00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <h3 className="font-medium">Stock Information</h3>

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value as number | string | undefined}
                          onChange={(e) => field.onChange(e.target.value)}
                          placeholder="0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lowStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Low Stock (Alert when stock is less than this value)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value as number | string | undefined}
                          onChange={(e) => field.onChange(e.target.value)}
                          placeholder="0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Weights & Prices</h3>
                <Button
                  type="button"
                  onClick={() => append({ weight: 0, basePrice: 0, price: 0 })}
                  variant="outline"
                >
                  <Plus size={16} />
                  <span>Add weight</span>
                </Button>
              </div> */}

              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">
                  {productType === "WEIGHT"
                    ? "Weights & Prices"
                    : "Variants & Prices"}
                </h3>
                <Button
                  type="button"
                  // ถ้าเป็น UNIT ให้ default weight=1, ถ้าเป็น WEIGHT ให้ default 0
                  onClick={() =>
                    append({
                      name: "",
                      weight: productType === "UNIT" ? 1 : 0,
                      basePrice: 0,
                      price: 0,
                    })
                  }
                  variant="outline"
                  size="sm"
                >
                  <Plus size={16} />
                  <span>
                    Add {productType === "WEIGHT" ? "weight" : "option"}
                  </span>
                </Button>
              </div>

              {/* <div className="grid gap-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id || index}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
                  >
                    <div className="sm:col-span-3">
                      <FormField
                        control={form.control}
                        name={`weights.${index}.weight`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weight (g)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g. 10"
                                {...field}
                                value={
                                  field.value as number | string | undefined
                                }
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div> */}

              <div className="grid gap-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id || index}
                    // ✅ ใช้เลย์เอาต์เดิมของคุณ 12 ช่องเป๊ะ
                    className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
                  >
                    {/* 1. ช่อง Weight หรือ Name (sm:col-span-3) */}
                    <div className="sm:col-span-3">
                      {productType === "UNIT" ? (
                        <FormField
                          control={form.control}
                          name={`weights.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Variant Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={`e.g. ${unitLabel} 1`}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ) : (
                        <FormField
                          control={form.control}
                          name={`weights.${index}.weight`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Weight (g)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="e.g. 10"
                                  {...field}
                                  value={
                                    field.value as number | string | undefined
                                  }
                                  onChange={(e) =>
                                    field.onChange(e.target.value)
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    {/* 2. Base Price (sm:col-span-3) */}
                    <div className="sm:col-span-3">
                      <FormField
                        control={form.control}
                        name={`weights.${index}.basePrice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Base Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g. 150"
                                {...field}
                                value={
                                  field.value as number | string | undefined
                                }
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* 3. Price (sm:col-span-3) */}
                    <div className="sm:col-span-3">
                      <FormField
                        control={form.control}
                        name={`weights.${index}.price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g. 199"
                                {...field}
                                value={
                                  field.value as number | string | undefined
                                }
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* 4. Discount (sm:col-span-2) */}
                    <div className="sm:col-span-2">
                      <FormItem>
                        <FormLabel>Discount (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            readOnly
                            value={(() => {
                              const base = Number(
                                form.watch(`weights.${index}.basePrice`) ?? 0,
                              );
                              const price = Number(
                                form.watch(`weights.${index}.price`) ?? 0,
                              );
                              const discount =
                                base > 0 ? ((base - price) / base) * 100 : 0;
                              return `${discount.toFixed(2)}%`;
                            })()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </div>

                    {/* 5. ปุ่มลบ (sm:col-span-1) */}
                    <div className="sm:col-span-1 flex sm:justify-end">
                      <Button
                        type="button"
                        onClick={() => remove(index)}
                        variant="destructive"
                        aria-label={`Remove weight row ${index + 1}`}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="cod"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                    />
                  </FormControl>
                  <FormLabel>Enable COD</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <LoadingButton type="submit" loading={loading} className="w-full">
              <Save size={16} />
              <span>{product ? "Update Product" : "Save Product"}</span>
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
