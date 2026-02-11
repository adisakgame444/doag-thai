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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { LoadingButton } from "@/components/loading-button";
import Link from "next/link";
import { PasswordInput } from "@/components/password-input";
import { passwordSchema } from "@/lib/validation";

const signUpSchema = z
  .object({
    name: z.string().min(3, "ชื่อต้องมีความยาวอย่างน้อย 3 ตัวอักษร"),
    email: z.email({ message: "กรุณากรอกอีเมลให้ถูกต้อง" }),
    password: passwordSchema,
    passwordConfirmation: z.string().min(1, "กรุณายืนยันรหัสผ่าน"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["passwordConfirmation"],
  });

type SignUpValues = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });
  async function onSubmit({ email, password, name }: SignUpValues) {
    setError(null);

    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
      callbackURL: "/email-verified",
    });

    if (error) {
      setError(error.message || "Something went wrong");
    } else {
      toast.success("สมัครสมาชิกสำเร็จ");
      router.push("/");
    }
  }

  const loading = form.formState.isSubmitting;

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-lg md:text-xl">สมัครสมาชิก</CardTitle>
        <CardDescription>กรุณากรอกข้อมูลเพื่อสมัครสมาชิก</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อผู้ใช้</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ยืนยันรหัสผ่าน</FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div role="alert" className="text-sm text-red-600">
                {error}
              </div>
            )}

            <LoadingButton type="submit" className="w-full" loading={loading}>
              สมัครสมาชิก
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="pt-4 flex flex-col gap-2">
        <div className="flex items-center justify-center gap-1 w-full">
          <p className="text-accent-foreground">มีบัญชีอยู่แล้ว?</p>
          <Link href="/sign-in" className="text-primary hover:underline">
            เข้าสู่ระบบ
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
