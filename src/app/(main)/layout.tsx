// import ContactFooter from "@/components/layouts/footer/contact-footer";
// import Header from "@/components/layouts/header";
// import { ReactNode } from "react";

// interface MainLayoutProps {
//   children: ReactNode;
// }

// export default function MainLayout({ children }: MainLayoutProps) {
//   return (
//     <div className="min-h-svh flex flex-col">
//       <Header />
//       <main className="flex-1 pt-16">{children}</main>
//       <ContactFooter />
//     </div>
//   );
// }

// import ContactFooter from "@/components/layouts/footer/contact-footer";
// import Header from "@/components/layouts/header";
// import FloatingChat from "@/components/ui/floating-chat";
// import { ReactNode } from "react";

// interface MainLayoutProps {
//   children: ReactNode;
// }

// export default function MainLayout({ children }: MainLayoutProps) {
//   return (
//     <div className="min-h-svh flex flex-col">
//       <Header />
//       <main className="flex-1 pt-16">{children}</main>
//       <ContactFooter />

//       {/* ✅ FloatingChat อยู่ตรงนี้ */}
//       <FloatingChat />
//     </div>
//   );
// }

import ContactFooter from "@/components/layouts/footer/contact-footer";
import Header from "@/components/layouts/header";
import FloatingChat from "@/components/ui/floating-chat";
import { ReactNode } from "react";
// import { HeroBackground } from "@/components/home/HeroBackground";
import OrderAlertBanner from "./(protected)/orders/order-alert-banner";
import InstallBanner from "@/components/layouts/InstallBanner";
import BottomNav from "@/components/layouts/BottomNav"; // ✅ 1. Import มา

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative pb-16 md:pb-0 min-h-svh flex flex-col overflow-x-hidden">
      {/* 🌄 Background แสดงทุกหน้า */}
      <InstallBanner />

      {/* <HeroBackground /> */}

      {/* 🧭 Header */}
      <Header />

      <OrderAlertBanner />

      {/* 📦 Content */}
      <main className="relative z-10 flex-1 pt-16">{children}</main>

      {/* 📞 Footer */}
      <ContactFooter />

      {/* 💬 Floating Chat */}
      <FloatingChat />

      {/* 👇 3. ใส่ BottomNav ไว้ตรงนี้ (ล่างสุด) */}
      {/* block md:hidden = โชว์เฉพาะมือถือ, ซ่อนในจอคอม (ถ้าต้องการ) */}
      <div className="block md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
