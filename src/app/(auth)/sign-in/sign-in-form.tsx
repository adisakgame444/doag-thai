"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { LoadingButton } from "@/components/loading-button";
import Link from "next/link";
import { PasswordInput } from "@/components/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons/google-icon";
import { passwordSchema } from "@/lib/validation";
import { LineIcon } from "@/components/icons/LineIcon";

const signInSchema = z.object({
  email: z.email({ message: "กรุณากรอกอีเมลให้ถูกต้อง" }),
  password: passwordSchema,
  rememberMe: z.boolean().optional(),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect");

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit({ email, password, rememberMe }: SignInValues) {
    setError(null);
    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
      rememberMe,
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Something went wrong");
    } else {
      toast.success("เข้าสู่ระบบสำเร็จ");
      router.push(redirect ?? "/");
    }
  }

  // async function handleSocialSignIn(provider: "google") {
  //   setError(null);
  //   setLoading(true);

  //   const { error } = await authClient.signIn.social({
  //     provider,
  //     callbackURL: redirect ?? "/",
  //   });

  //   setLoading(false);

  //   if (error) {
  //     setError(error.message || "Something went wrong");
  //   }
  // }

  async function handleSocialSignIn(
    // provider: "google" | "facebook " | " line",
    provider: "google" | "facebook" | "line",
  ) {
    setError(null);
    setLoading(true);

    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: redirect ?? "/", // ใช้เหมือนเดิม
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Something went wrong");
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center text-center">
        <CardTitle className="text-lg md:text-xl">เข้าสู่ระบบ</CardTitle>
        <CardDescription>กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>อีเมล</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>รหัสผ่าน</FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>จดจำฉัน</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Link
                href="/forgot-password"
                className="text-primary hover:underline"
              >
                ลืมรหัสผ่าน
              </Link>
            </div>

            {error && (
              <div role="alert" className="text-sm text-red-600">
                {error}
              </div>
            )}

            <LoadingButton type="submit" className="w-full" loading={loading}>
              เข้าสู่ระบบ
            </LoadingButton>

            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                disabled={loading}
                onClick={() => handleSocialSignIn("google")}
              >
                <GoogleIcon />
                เข้าสู่ระบบด้วย Google
              </Button>

              {/* <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                disabled={loading}
                onClick={() => handleSocialSignIn("facebook")}
              >
                เข้าสู่ระบบด้วย Facebook
              </Button> */}
              {/* ถ้ามี FacebookIcon ค่อยใส่เพิ่มทีหลังได้ */}

              {/* 🚀 เพิ่มปุ่ม LINE ต่อท้าย (หรือจัด Layout ตามชอบ) */}
              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                disabled={loading}
                onClick={() => handleSocialSignIn("line")} // ✅ ตรงนี้จะไม่ Error แล้ว
              >
                <img
                  src="/icons/line.png"
                  alt="LINE"
                  className="w-[1.2em] h-[1.2em]"
                />
                {/* <span className="font-bold">เข้าสู่ระบบด้วย LINE</span> */}
                เข้าสู่ระบบด้วย LINE
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="pt-4 flex flex-col gap-2">
        <div className="flex items-center justify-center gap-1 w-full">
          <p className="text-accent-foreground">ยังไม่มีบัญชี</p>
          <Link href="/sign-up" className="text-primary hover:underline">
            สมัครสมาชิก
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
