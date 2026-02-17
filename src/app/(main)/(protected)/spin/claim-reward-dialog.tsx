// // components/claim-reward-dialog.tsx (สร้างไฟล์นี้ใหม่)
// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { claimRewardAction } from "./actions"; // import action ตะกี้
// import { toast } from "sonner";
// import { Loader2, Gift, CheckCircle2 } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface ClaimRewardDialogProps {
//   historyId: string;
//   prizeName: string;
//   userId: string;
//   isDisabled?: boolean;
//   isClaimed: boolean; // ✅ รับค่าเข้ามาเพื่อเปลี่ยนร่างปุ่ม
// }

// export function ClaimRewardDialog({
//   historyId,
//   prizeName,
//   userId,
//   isDisabled,
//   isClaimed, // รับค่ามาใช้
// }: ClaimRewardDialogProps) {
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     address: "",
//   });

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);

//     const result = await claimRewardAction({
//       spinHistoryId: historyId,
//       prizeName: prizeName,
//       userId: userId,
//       shippingName: formData.name,
//       shippingPhone: formData.phone,
//       shippingAddress: formData.address,
//     });

//     setLoading(false);

//     if (result.success) {
//       toast.success(result.message);
//       setOpen(false);
//     } else {
//       toast.error(result.message);
//     }
//   }

//   if (isDisabled) {
//     return (
//       <Button disabled variant="outline" size="sm" className="w-full mt-2">
//         รับแล้ว ✅
//       </Button>
//     );
//   }

//   return (
//     <Dialog open={isClaimed ? false : undefined}>
//       {" "}
//       {/* ถ้า Claim แล้ว ห้ามเปิด Dialog เด็ดขาด */}{" "}
//       <DialogTrigger asChild>
//         <Button
//           disabled={isClaimed} // ถ้า Claim แล้ว ให้ปุ่มเป็นสถานะ Disabled
//           size="sm"
//           className={cn(
//             "w-full h-8 px-0 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all border shadow-sm",
//             // 👇 Logic สลับสีปุ่ม อยู่ตรงนี้ในบรรทัดเดียว
//             isClaimed
//               ? "bg-red-50 border-red-200 text-red-600 opacity-100 cursor-not-allowed hover:bg-red-50" // สีตอนรับแล้ว
//               : "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700", // สีตอนยังไม่รับ
//           )}
//         >
//           {/* 👇 Logic สลับไอคอนและข้อความ */}
//           {isClaimed ? (
//             <>
//               <CheckCircle2 className="w-3.5 h-3.5" />
//               <span>รับรางวัลแล้ว</span>
//             </>
//           ) : (
//             <>
//               <Gift className="w-3.5 h-3.5" />
//               <span>กดรับของ</span>
//             </>
//           )}
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>รับรางวัล: {prizeName}</DialogTitle>
//           <DialogDescription>
//             กรุณากรอกที่อยู่สำหรับจัดส่งของรางวัล
//           </DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="grid gap-4 py-4">
//           <div className="grid gap-2">
//             <Label htmlFor="name">ชื่อผู้รับ</Label>
//             <Input
//               id="name"
//               required
//               placeholder="สมชาย ใจดี"
//               value={formData.name}
//               onChange={(e) =>
//                 setFormData({ ...formData, name: e.target.value })
//               }
//             />
//           </div>
//           <div className="grid gap-2">
//             <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
//             <Input
//               id="phone"
//               required
//               placeholder="081xxxxxxx"
//               value={formData.phone}
//               onChange={(e) =>
//                 setFormData({ ...formData, phone: e.target.value })
//               }
//             />
//           </div>
//           <div className="grid gap-2">
//             <Label htmlFor="address">ที่อยู่จัดส่ง</Label>
//             <Textarea
//               id="address"
//               required
//               placeholder="บ้านเลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์"
//               value={formData.address}
//               onChange={(e) =>
//                 setFormData({ ...formData, address: e.target.value })
//               }
//             />
//           </div>
//           <DialogFooter>
//             <Button type="submit" disabled={loading}>
//               {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               ยืนยันการรับของ
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { claimRewardAction } from "./actions";
import { toast } from "sonner";
import { Loader2, Gift, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClaimRewardDialogProps {
  historyId: string;
  prizeName: string;
  userId: string;
  isClaimed: boolean;
}

export function ClaimRewardDialog({
  historyId,
  prizeName,
  userId,
  isClaimed,
}: ClaimRewardDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // --- สไตล์ปุ่ม (ใช้ร่วมกันเพื่อให้หน้าตาเหมือนกันเป๊ะ 100%) ---
  const buttonBaseClass =
    "w-full h-8 px-0 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all border shadow-sm";
  const claimedClass =
    "bg-red-50 border-red-200 text-red-600 opacity-100 cursor-not-allowed";
  const activeClass =
    "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const result = await claimRewardAction({
      spinHistoryId: historyId,
      prizeName: prizeName,
      userId: userId,
      shippingName: formData.name,
      shippingPhone: formData.phone,
      shippingAddress: formData.address,
    });

    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      setOpen(false); // ปิด Modal
    } else {
      toast.error(result.message);
    }
  }

  // ---------------------------------------------------------------------------
  // ✅ PERFORMANCE FIX: แยกการ Render เพื่อลดภาระ Browser
  // ---------------------------------------------------------------------------

  // กรณีที่ 1: รับรางวัลแล้ว -> Render แค่ปุ่มธรรมดา (ไม่ต้องแบก Dialog/Form)
  if (isClaimed) {
    return (
      <Button disabled size="sm" className={cn(buttonBaseClass, claimedClass)}>
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>รับรางวัลแล้ว</span>
      </Button>
    );
  }

  // กรณีที่ 2: ยังไม่รับรางวัล -> Render Dialog ปกติ
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className={cn(buttonBaseClass, activeClass)}>
          <Gift className="w-3.5 h-3.5" />
          <span>กดรับของ</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>รับรางวัล: {prizeName}</DialogTitle>
          <DialogDescription>
            กรุณากรอกที่อยู่สำหรับจัดส่งของรางวัล
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">ชื่อผู้รับ</Label>
            <Input
              id="name"
              required
              placeholder="กรอกชื่อผู้รับของรางวัล"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
            <Input
              id="phone"
              required
              placeholder="กรอกเบอร์โทณศัพท์ให้ถูกต้อง"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">ที่อยู่จัดส่ง</Label>
            <Textarea
              id="address"
              required
              placeholder="บ้านเลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              ยืนยันการรับของ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
