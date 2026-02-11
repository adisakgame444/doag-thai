"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import type { Banner } from '@/components/home/recommended-banner'
import { updateBannerAction } from "../actions";

type Banner = any;

const updateBannerSchema = z.object({
  name: z
    .string()
    .trim()
    .max(120, { message: "ชื่อต้องไม่เกิน 120 ตัวอักษร" })
    .optional()
    .or(z.literal("")),
  image: z
    .custom<File>((file) => file instanceof File, {
      message: "ไฟล์ไม่ถูกต้อง",
    })
    .nullable(),
});

type UpdateBannerFormValues = z.infer<typeof updateBannerSchema>;

interface UpdateBannerDialogProps {
  banner: Banner;
}

export function UpdateBannerDialog({ banner }: UpdateBannerDialogProps) {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdateBannerFormValues>({
    resolver: zodResolver(updateBannerSchema),
    defaultValues: {
      name: banner.name ?? "",
      image: null,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const [file] = Array.from(event.target.files ?? []);
      if (!file) {
        form.setValue("image", null, {
          shouldDirty: true,
          shouldValidate: true,
        });
        setPreviewUrl((current) => {
          if (current) URL.revokeObjectURL(current);
          return null;
        });
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("ไฟล์ต้องเป็นรูปภาพเท่านั้น");
        form.setError("image", { type: "manual", message: "ไฟล์ไม่ถูกต้อง" });
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return objectUrl;
      });
      form.clearErrors("image");
      form.setValue("image", file, { shouldDirty: true, shouldValidate: true });
    },
    [form],
  );

  const resetDialog = useCallback(() => {
    form.reset({
      name: banner.name ?? "",
      image: null,
    });
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
  }, [banner.name, form]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onSubmit = useCallback(
    async (values: UpdateBannerFormValues) => {
      startTransition(async () => {
        const result = await updateBannerAction({
          id: banner.id,
          name:
            values.name && values.name.trim().length > 0 ? values.name : null,
          file: values.image ?? undefined,
        });

        if (result.success) {
          toast.success(result.message ?? "อัปเดตแบนเนอร์สำเร็จ");
          resetDialog();
          setOpen(false);
        } else {
          toast.error(result.error ?? "ไม่สามารถอัปเดตแบนเนอร์ได้");
        }
      });
    },
    [banner.id, resetDialog],
  );

  const preview = useMemo(() => {
    if (previewUrl) return previewUrl;
    return banner.imageUrl;
  }, [banner.imageUrl, previewUrl]);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          resetDialog();
        }
        setOpen(nextOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          แก้ไข
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>แก้ไขแบนเนอร์</DialogTitle>
          <DialogDescription>
            ปรับรูปภาพหรือชื่อแบนเนอร์ให้ตรงกับโปรโมชันล่าสุด
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>รูปภาพแบนเนอร์</FormLabel>
                    <FormControl>
                      <div className="flex flex-col items-start gap-3">
                        <label className="w-full cursor-pointer overflow-hidden rounded-xl border border-dashed border-border/60 bg-muted/30 transition hover:border-primary/60">
                          <div className="flex h-40 w-full items-center justify-center bg-muted/30">
                            <div className="relative h-full w-full">
                              <Image
                                src={preview}
                                alt="Banner preview"
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                            aria-label="อัปโหลดรูปภาพแบนเนอร์"
                          />
                        </label>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            form.setValue("image", null, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                            setPreviewUrl((current) => {
                              if (current) URL.revokeObjectURL(current);
                              return null;
                            });
                          }}
                          disabled={!previewUrl}
                        >
                          ใช้รูปเดิม
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ชื่อแบนเนอร์</FormLabel>
                    <FormControl>
                      <Input placeholder="เช่น โปรโมชันเปิดร้าน" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetDialog();
                  setOpen(false);
                }}
              >
                ยกเลิก
              </Button>
              <Button type="submit" disabled={isSubmitting || isPending}>
                บันทึกการเปลี่ยนแปลง
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
