import Navbar from "@/components/layouts/navbar";
import AppSidebar from "@/components/layouts/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      {/* <div className='flex flex-col h-svh w-full'> */}
      <div className="flex flex-col min-h-svh w-full">
        <Navbar />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
