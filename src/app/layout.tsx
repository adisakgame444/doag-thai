import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import FloatingChat from "@/components/ui/floating-chat";
import { PWAProvider } from "@/context/PWAContext";

const kanit = Kanit({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Doag Thai",
    default: "Doag Thai",
  },
  description:
    "ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!",
  manifest: "/manifest.webmanifest",
  applicationName: "DOAG THAI",
  appleWebApp: {
    capable: true,
    title: "DOAG THAI", // ✅ บังคับให้ iOS ใช้ชื่อนี้เป็นชื่อแอป ไม่สน Title หน้าเว็บ
    statusBarStyle: "default",
  },
  // เพิ่ม metadata เพื่อหลีกเลี่ยง warning เกี่ยวกับ missing key
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.doag-thai.com"
  ),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="en" suppressHydrationWarning>
    //   <body className={`${kanit.className} antialiased overflow-x-hidden`}>
    //     <ThemeProvider
    //       attribute="class"
    //       defaultTheme="light"
    //       enableSystem
    //       disableTransitionOnChange
    //     >
    //       {children}
    //       {/* <FloatingChat /> */}
    //       <Toaster />
    //     </ThemeProvider>
    //   </body>
    // </html>
    <html lang="en" suppressHydrationWarning>
      <body className={`${kanit.className} antialiased overflow-x-hidden`}>
        {/* 👇 2. เอา PWAProvider มาครอบ ThemeProvider อีกทีครับ */}
        <PWAProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            {/* <FloatingChat /> */}
            <Toaster />
          </ThemeProvider>
        </PWAProvider>
      </body>
    </html>
  );
}


// import type { Metadata } from "next";
// import { Kanit } from "next/font/google";
// import "./globals.css";
// import { ThemeProvider } from "@/components/theme-provider";
// import { Toaster } from "sonner";

// const kanit = Kanit({
//   weight: ["400", "500", "600", "700"],
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: {
//     template: "%s | Doag Thai",
//     absolute: "Doag Thai",
//   },
//   description:
//     "ร้านค้าออนไลน์อันดับ 1 สำหรับสินค้าสมุนไพรครบวงจร พร้อมบริการจัดส่งเร็วและราคาที่คุ้มค่า!",
//   manifest: "/manifest.webmanifest",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="th">
//       <body className={kanit.className}>
//         <ThemeProvider attribute="class" defaultTheme="light">
//           {children}
//           <Toaster />
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }
