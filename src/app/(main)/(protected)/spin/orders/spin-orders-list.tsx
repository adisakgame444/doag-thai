// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { formatPrice } from "@/lib/format-price";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Clock, CheckCircle, XCircle, Eye, Package } from "lucide-react";
// import dayjs from "@/lib/dayjs";

// type SpinOrder = {
//   id: string;
//   orderNumber: string;
//   spinAmount: number;
//   totalAmount: number;
//   status: string;
//   paymentMethod: string;
//   createdAt: Date;
//   package: {
//     name: string;
//     imageUrl: string;
//   };
//   payments: {
//     slipUrl: string | null;
//     status: string;
//   }[];
// };

// interface SpinOrdersListProps {
//   orders: SpinOrder[];
// }

// export default function SpinOrdersList({ orders }: SpinOrdersListProps) {
//   const [selectedOrder, setSelectedOrder] = useState<SpinOrder | null>(null);
//   const [slipDialogOpen, setSlipDialogOpen] = useState(false);

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "PENDING_PAYMENT":
//         return (
//           <Badge variant="secondary" className="bg-gray-500">
//             <Clock className="w-3 h-3 mr-1" />
//             รอชำระเงิน
//           </Badge>
//         );
//       case "WAITING_VERIFICATION":
//         return (
//           <Badge variant="secondary" className="bg-yellow-500">
//             <Clock className="w-3 h-3 mr-1" />
//             รอการตรวจสอบ
//           </Badge>
//         );
//       case "APPROVED":
//         return (
//           <Badge variant="secondary" className="bg-green-500">
//             <CheckCircle className="w-3 h-3 mr-1" />
//             อนุมัติแล้ว
//           </Badge>
//         );
//       case "REJECTED":
//         return (
//           <Badge variant="destructive">
//             <XCircle className="w-3 h-3 mr-1" />
//             ปฏิเสธ
//           </Badge>
//         );
//       case "CANCELLED":
//         return (
//           <Badge variant="secondary" className="bg-gray-500">
//             <XCircle className="w-3 h-3 mr-1" />
//             ยกเลิก
//           </Badge>
//         );
//       default:
//         return <Badge variant="secondary">{status}</Badge>;
//     }
//   };

//   const handleViewSlip = (order: SpinOrder) => {
//     setSelectedOrder(order);
//     setSlipDialogOpen(true);
//   };

//   if (orders.length === 0) {
//     return (
//       <Card>
//         <CardContent className="py-12 text-center">
//           <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
//           <p className="text-muted-foreground mb-4">
//             คุณยังไม่มีประวัติการซื้อแพคเกจสปิน
//           </p>
//           <Link href="/spin">
//             <Button>
//               <Package className="w-4 h-4 mr-2" />
//               ซื้อแพคเกจสปิน
//             </Button>
//           </Link>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <>
//       <div className="space-y-4">
//         {orders.map((order) => (
//           <Card key={order.id}>
//             <CardHeader className="pb-3">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <CardTitle className="text-lg">
//                     {order.package.name}
//                   </CardTitle>
//                   <p className="text-sm text-muted-foreground">
//                     เลขที่: {order.orderNumber}
//                   </p>
//                 </div>
//                 {getStatusBadge(order.status)}
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* Left: Package Info */}
//                 <div className="space-y-2">
//                   <div className="flex items-center gap-3">
//                     <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
//                       <Image
//                         src={order.package.imageUrl}
//                         alt={order.package.name}
//                         fill
//                         className="object-cover"
//                       />
//                     </div>
//                     <div>
//                       <p className="text-sm text-muted-foreground">
//                         จำนวนครั้งที่หมุน
//                       </p>
//                       <p className="text-lg font-semibold">
//                         {order.spinAmount} ครั้ง
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">ยอดชำระ:</span>
//                     <span className="font-semibold">
//                       {formatPrice(order.totalAmount)}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">วิธีชำระเงิน:</span>
//                     <span>
//                       {order.paymentMethod === "PROMPTPAY"
//                         ? "PromptPay"
//                         : "โอนเงินธนาคาร"}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Right: Status & Actions */}
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-muted-foreground">วันที่สั่งซื้อ:</span>
//                     <span>{dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}</span>
//                   </div>

//                   {/* View Slip Button */}
//                   {order.payments.length > 0 && order.payments[0].slipUrl && (
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="w-full"
//                       onClick={() => handleViewSlip(order)}
//                     >
//                       <Eye className="w-4 h-4 mr-2" />
//                       ดูสลิปการโอนเงิน
//                     </Button>
//                   )}

//                   {/* Status Message */}
//                   {order.status === "WAITING_VERIFICATION" && (
//                     <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
//                       <p className="text-xs text-yellow-800 dark:text-yellow-200">
//                         กรุณารอแอดมินตรวจสอบและอนุมัติ
//                       </p>
//                     </div>
//                   )}

//                   {order.status === "APPROVED" && (
//                     <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
//                       <p className="text-xs text-green-800 dark:text-green-200">
//                         ✅ อนุมัติแล้ว สามารถเล่นเกมได้
//                       </p>
//                       <Link href="/game">
//                         <Button size="sm" className="w-full mt-2 bg-green-600 hover:bg-green-700">
//                           เล่นเกมเลย
//                         </Button>
//                       </Link>
//                     </div>
//                   )}

//                   {order.status === "REJECTED" && (
//                     <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
//                       <p className="text-xs text-red-800 dark:text-red-200">
//                         ❌ คำสั่งซื้อถูกปฏิเสธ กรุณาติดต่อแอดมิน
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Slip Dialog */}
//       <Dialog open={slipDialogOpen} onOpenChange={setSlipDialogOpen}>
//         <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
//           <DialogHeader>
//             <DialogTitle>สลิปการโอนเงิน</DialogTitle>
//           </DialogHeader>
//           {selectedOrder && selectedOrder.payments[0]?.slipUrl && (
//             <div className="relative w-full min-h-[400px] sm:min-h-[500px] max-h-[70vh] sm:max-h-[100vh]">
//               <Image
//                 src={selectedOrder.payments[0].slipUrl}
//                 alt="สลิปการโอนเงิน"
//                 fill
//                 className="object-contain rounded"
//                 sizes="(max-width: 640px) 95vw, (max-width: 1024px) 80vw, 1024px"
//               />
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { formatPrice } from "@/lib/format-price";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Clock,
//   CheckCircle,
//   XCircle,
//   Eye,
//   Package,
//   Gamepad2,
//   AlertCircle,
// } from "lucide-react";
// import dayjs from "@/lib/dayjs";

// type SpinOrder = {
//   id: string;
//   orderNumber: string;
//   spinAmount: number;
//   totalAmount: number;
//   status: string;
//   paymentMethod: string;
//   createdAt: Date;
//   package: {
//     name: string;
//     imageUrl: string;
//   };
//   payments: {
//     slipUrl: string | null;
//     status: string;
//   }[];
// };

// interface SpinOrdersListProps {
//   orders: SpinOrder[];
// }

// export default function SpinOrdersList({ orders }: SpinOrdersListProps) {
//   const [selectedOrder, setSelectedOrder] = useState<SpinOrder | null>(null);
//   const [slipDialogOpen, setSlipDialogOpen] = useState(false);

//   // ✅ Custom Badge Style (Pixel Theme)
//   const getStatusBadge = (status: string) => {
//     const baseClass =
//       "border-2 border-black text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-md px-2 py-1 flex items-center gap-1";

//     switch (status) {
//       case "PENDING_PAYMENT":
//         return (
//           <Badge
//             variant="secondary"
//             className={`${baseClass} bg-slate-200 text-slate-700`}
//           >
//             <Clock className="w-3 h-3" />
//             รอชำระเงิน
//           </Badge>
//         );
//       case "WAITING_VERIFICATION":
//         return (
//           <Badge
//             variant="secondary"
//             className={`${baseClass} bg-yellow-400 text-black animate-pulse`}
//           >
//             <Clock className="w-3 h-3" />
//             รอการตรวจสอบ
//           </Badge>
//         );
//       case "APPROVED":
//         return (
//           <Badge
//             variant="secondary"
//             className={`${baseClass} bg-green-500 text-white`}
//           >
//             <CheckCircle className="w-3 h-3" />
//             อนุมัติแล้ว
//           </Badge>
//         );
//       case "REJECTED":
//         return (
//           <Badge
//             variant="destructive"
//             className={`${baseClass} bg-red-500 text-white hover:bg-red-600`}
//           >
//             <XCircle className="w-3 h-3" />
//             ปฏิเสธ
//           </Badge>
//         );
//       case "CANCELLED":
//         return (
//           <Badge
//             variant="secondary"
//             className={`${baseClass} bg-slate-400 text-white`}
//           >
//             <XCircle className="w-3 h-3" />
//             ยกเลิก
//           </Badge>
//         );
//       default:
//         return (
//           <Badge variant="secondary" className={baseClass}>
//             {status}
//           </Badge>
//         );
//     }
//   };

//   const handleViewSlip = (order: SpinOrder) => {
//     setSelectedOrder(order);
//     setSlipDialogOpen(true);
//   };

//   // ✅ Empty State (Retro Game Style)
//   if (orders.length === 0) {
//     return (
//       <Card className="border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-[#f8fafc] overflow-hidden relative">
//         <div
//           className="absolute inset-0 opacity-[0.03]"
//           style={{
//             backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
//             backgroundSize: "16px 16px",
//           }}
//         ></div>
//         <CardContent className="py-16 text-center flex flex-col items-center justify-center relative z-10">
//           <div className="w-24 h-24 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-6 rotate-3 hover:rotate-6 transition-transform duration-300 rounded-xl">
//             <Package className="w-12 h-12 text-slate-400" />
//           </div>
//           <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-2">
//             NO ORDERS FOUND
//           </h3>
//           <p className="text-muted-foreground font-medium mb-8 bg-white border-2 border-slate-200 px-4 py-1 rounded-full shadow-sm">
//             คุณยังไม่มีประวัติการซื้อแพคเกจสปิน
//           </p>
//           <Link href="/spin">
//             <Button className="h-14 px-8 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xl border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:shadow-none active:translate-y-1 transition-all uppercase">
//               <Package className="w-6 h-6 mr-3" />
//               BUY PACKAGES
//             </Button>
//           </Link>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <>
//       <div className="space-y-6">
//         {orders.map((order) => (
//           // ✅ Order Card (Retro Style)
//           <Card
//             key={order.id}
//             className="group border-4 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all bg-white overflow-hidden"
//           >
//             {/* Header: ชื่อแพคเกจ + สถานะ */}
//             <CardHeader className="pb-3 border-b-4 border-black bg-slate-50">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-white border-2 border-black rounded-md flex items-center justify-center shadow-sm">
//                     <span className="font-black text-lg text-slate-300">#</span>
//                   </div>
//                   <div>
//                     <CardTitle className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900">
//                       {order.package.name}
//                     </CardTitle>
//                     <p className="text-xs sm:text-sm text-muted-foreground font-mono font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200 inline-block mt-1">
//                       ORDER ID: {order.orderNumber}
//                     </p>
//                   </div>
//                 </div>
//                 {getStatusBadge(order.status)}
//               </div>
//             </CardHeader>

//             <CardContent className="p-4 sm:p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Left: Package Info */}
//                 <div className="space-y-4">
//                   <div className="flex items-start gap-4">
//                     <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-slate-100 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
//                       <Image
//                         src={order.package.imageUrl}
//                         alt={order.package.name}
//                         fill
//                         className="object-cover"
//                       />
//                     </div>
//                     <div className="space-y-2 w-full">
//                       <div>
//                         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
//                           SPIN AMOUNT
//                         </p>
//                         <p className="text-xl font-black text-slate-900">
//                           {order.spinAmount} SPINS
//                         </p>
//                       </div>
//                       <div className="w-full h-0.5 bg-slate-100"></div>
//                       <div>
//                         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
//                           TOTAL PRICE
//                         </p>
//                         <p className="text-2xl font-black text-green-600">
//                           {formatPrice(order.totalAmount)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2 text-sm bg-slate-50 p-2 rounded-md border border-slate-200">
//                     <span className="text-muted-foreground font-bold text-xs uppercase">
//                       PAYMENT:
//                     </span>
//                     <span className="font-bold text-slate-900 uppercase">
//                       {order.paymentMethod === "PROMPTPAY"
//                         ? "PromptPay QR"
//                         : "Bank Transfer"}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Right: Status & Actions */}
//                 <div className="space-y-3 flex flex-col justify-center">
//                   <div className="flex justify-between text-sm border-b-2 border-dashed border-slate-200 pb-2">
//                     <span className="text-muted-foreground font-bold">
//                       DATE:
//                     </span>
//                     <span className="font-mono font-bold">
//                       {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}
//                     </span>
//                   </div>

//                   {/* Status Messages (Retro Alerts) */}
//                   {order.status === "WAITING_VERIFICATION" && (
//                     <div className="bg-yellow-50 border-2 border-black rounded-lg p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex gap-2 items-start">
//                       <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
//                       <p className="text-xs font-bold text-yellow-800">
//                         กรุณารอแอดมินตรวจสอบสลิปและอนุมัติ (ใช้เวลาไม่นาน)
//                       </p>
//                     </div>
//                   )}

//                   {order.status === "APPROVED" && (
//                     <div className="bg-green-50 border-2 border-black rounded-lg p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
//                       <p className="text-xs font-bold text-green-800 flex items-center gap-2 mb-2">
//                         <CheckCircle className="w-4 h-4" /> อนุมัติแล้ว
//                         พร้อมเล่น!
//                       </p>
//                       <Link href="/game">
//                         <Button
//                           size="sm"
//                           className="w-full bg-green-500 hover:bg-green-600 text-white font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-0.5 rounded-md"
//                         >
//                           <Gamepad2 className="w-4 h-4 mr-2" /> PLAY GAME
//                         </Button>
//                       </Link>
//                     </div>
//                   )}

//                   {order.status === "REJECTED" && (
//                     <div className="bg-red-50 border-2 border-black rounded-lg p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
//                       <p className="text-xs font-bold text-red-800 flex items-center gap-2">
//                         <XCircle className="w-4 h-4" /> คำสั่งซื้อถูกปฏิเสธ
//                         กรุณาติดต่อแอดมิน
//                       </p>
//                     </div>
//                   )}

//                   {/* View Slip Button */}
//                   {order.payments.length > 0 && order.payments[0].slipUrl && (
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="w-full font-bold border-2 border-slate-300 hover:border-black hover:bg-slate-100 text-slate-600 hover:text-black rounded-md transition-all"
//                       onClick={() => handleViewSlip(order)}
//                     >
//                       <Eye className="w-4 h-4 mr-2" />
//                       VIEW SLIP / หลักฐาน
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Slip Dialog */}
//       <Dialog open={slipDialogOpen} onOpenChange={setSlipDialogOpen}>
//         <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl bg-white">
//           <DialogHeader className="p-4 border-b-4 border-black bg-slate-100">
//             <DialogTitle className="font-black uppercase text-xl flex items-center gap-2">
//               <Package className="w-5 h-5" /> PAYMENT SLIP
//             </DialogTitle>
//           </DialogHeader>
//           {selectedOrder && selectedOrder.payments[0]?.slipUrl && (
//             <div className="relative w-full min-h-[400px] sm:min-h-[500px] bg-slate-200 p-4">
//               <div className="relative w-full h-full min-h-[400px]">
//                 <Image
//                   src={selectedOrder.payments[0].slipUrl}
//                   alt="สลิปการโอนเงิน"
//                   fill
//                   className="object-contain"
//                   sizes="(max-width: 640px) 95vw, (max-width: 1024px) 80vw, 1024px"
//                 />
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { formatPrice } from "@/lib/format-price";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Clock,
//   CheckCircle,
//   XCircle,
//   Ticket,
//   Copy,
//   Loader2,
//   Calendar,
//   Wallet,
//   Zap,
//   Package,
// } from "lucide-react";
// import dayjs from "@/lib/dayjs";
// import { toast } from "sonner";

// type SpinOrder = {
//   id: string;
//   orderNumber: string;
//   spinAmount: number;
//   totalAmount: number;
//   status: string;
//   paymentMethod: string;
//   createdAt: Date;
//   package: {
//     name: string;
//     imageUrl: string;
//   };
//   payments: {
//     slipUrl: string | null;
//     status: string;
//   }[];
// };

// interface SpinOrdersListProps {
//   orders: SpinOrder[];
// }

// export default function SpinOrdersList({ orders }: SpinOrdersListProps) {
//   const [selectedOrder, setSelectedOrder] = useState<SpinOrder | null>(null);
//   const [slipDialogOpen, setSlipDialogOpen] = useState(false);

//   const handleViewSlip = (order: SpinOrder) => {
//     setSelectedOrder(order);
//     setSlipDialogOpen(true);
//   };

//   const copyOrderId = (id: string) => {
//     navigator.clipboard.writeText(id);
//     toast.success("คัดลอกรหัสออเดอร์แล้ว!");
//   };

//   // 🎨 God-Tier Badge Config
//   const getStatusConfig = (status: string) => {
//     switch (status) {
//       case "PENDING_PAYMENT":
//         return {
//           bg: "bg-gray-200",
//           border: "border-gray-900",
//           text: "รอชำระเงิน",
//           icon: Clock,
//           textColor: "text-gray-900",
//         };
//       case "WAITING_VERIFICATION":
//         return {
//           bg: "bg-[#FFD028]", // เหลือง Cyberpunk
//           border: "border-black",
//           text: "กำลังตรวจสอบ",
//           icon: Loader2,
//           textColor: "text-black",
//           animate: "animate-spin",
//         };
//       case "APPROVED":
//         return {
//           bg: "bg-[#00FF94]", // เขียว Neon
//           border: "border-black",
//           text: "อนุมัติแล้ว", // ✅ แก้ไขตรงนี้เป็น "อนุมัติแล้ว"
//           icon: CheckCircle,
//           textColor: "text-black",
//         };
//       case "REJECTED":
//         return {
//           bg: "bg-[#FF3366]", // ชมพู/แดง Vivid
//           border: "border-black",
//           text: "ถูกปฏิเสธ",
//           icon: XCircle,
//           textColor: "text-white",
//         };
//       default:
//         return {
//           bg: "bg-white",
//           border: "border-black",
//           text: status,
//           icon: Clock,
//           textColor: "text-black",
//         };
//     }
//   };

//   if (orders.length === 0) {
//     return (
//       <div className="relative border-4 border-black bg-slate-100 p-8 rounded-xl shadow-[8px_8px_0px_0px_#000] overflow-hidden text-center group hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000] transition-all cursor-pointer">
//         <div className="absolute inset-0 opacity-[0.1] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
//         <div className="relative z-10 flex flex-col items-center">
//           <div className="w-20 h-20 bg-white border-4 border-black rounded-full flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_#000] rotate-12 group-hover:rotate-0 transition-transform">
//             <Package className="w-10 h-10 text-black" />
//           </div>
//           <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">
//             EMPTY CART?
//           </h2>
//           <p className="font-bold text-slate-500 mb-6 bg-white border-2 border-black px-4 py-1 rounded-full">
//             ยังไม่มีไอเทมในคลังของคุณ
//           </p>
//           <Link href="/spin">
//             <Button className="h-12 px-8 bg-[#FFD028] hover:bg-[#ffdf6c] text-black font-black text-lg border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all uppercase rounded-lg">
//               ไปช้อปเลย! 🛒
//             </Button>
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="grid grid-cols-2 gap-4 sm:gap-6 pb-5">
//         {orders.map((order) => {
//           const config = getStatusConfig(order.status);
//           const StatusIcon = config.icon;

//           return (
//             <div
//               key={order.id}
//               className="group relative flex flex-col h-full bg-white border-[3px] border-black rounded-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200"
//             >
//               {/* --- IMAGE AREA --- */}
//               <div className="relative w-full aspect-square border-b-[3px] border-black overflow-hidden rounded-t-[9px] bg-slate-50">
//                 {/* Background Pattern */}
//                 <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:8px_8px] z-0"></div>

//                 <Image
//                   src={order.package.imageUrl}
//                   alt={order.package.name}
//                   fill
//                   className="object-cover z-0 group-hover:scale-110 transition-transform duration-500 ease-in-out"
//                 />

//                 {/* ✅ Badge สถานะ: แสดงคำว่า "อนุมัติแล้ว" ชัดเจน */}
//                 <div
//                   className={`absolute top-2 left-2 z-10 flex items-center gap-1.5 px-2 py-1 ${config.bg} ${config.textColor} border-2 border-black rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
//                 >
//                   <StatusIcon
//                     className={`w-3.5 h-3.5 ${config.animate || ""}`}
//                   />
//                   <span className="text-[10px] font-black uppercase tracking-tight">
//                     {config.text}
//                   </span>
//                 </div>

//                 {/* Badge: Spins */}
//                 <div className="absolute bottom-2 right-2 z-10 bg-white text-black border-2 border-black px-2 py-0.5 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
//                   <Zap className="w-3 h-3 fill-yellow-400 text-black" />
//                   <span className="text-[10px] font-black">
//                     {order.spinAmount} SPINS
//                   </span>
//                 </div>
//               </div>

//               {/* --- CONTENT AREA --- */}
//               <div className="flex-1 flex flex-col p-3 bg-white rounded-b-lg relative overflow-hidden">
//                 <div className="absolute top-0 right-0 w-12 h-12 bg-[radial-gradient(#ccc_1px,transparent_1px)] [background-size:4px_4px] opacity-50"></div>

//                 {/* Info Lines */}
//                 <div className="flex flex-col gap-1 mb-2">
//                   {/* Order ID */}
//                   <div
//                     className="flex items-center gap-1 cursor-pointer w-fit group/copy"
//                     onClick={() => copyOrderId(order.orderNumber)}
//                     title="คลิกเพื่อคัดลอก"
//                   >
//                     <span className="text-[9px] bg-black text-white px-1.5 py-0.5 rounded-sm font-bold font-mono group-hover/copy:bg-[#FF3366] transition-colors">
//                       #{order.orderNumber.slice(-5)}
//                     </span>
//                     <Copy className="w-2.5 h-2.5 text-slate-400 group-hover/copy:text-black transition-colors" />
//                   </div>

//                   {/* Date & Payment Info */}
//                   <div className="flex flex-wrap gap-2 items-center mt-1">
//                     <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
//                       <Calendar className="w-3 h-3" />
//                       {dayjs(order.createdAt).format("DD/MM/YY")}
//                     </div>
//                     <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 uppercase">
//                       <Wallet className="w-3 h-3" />
//                       {order.paymentMethod === "PROMPTPAY" ? "QR CODE" : "BANK"}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Title */}
//                 <h3 className="font-black text-sm text-black leading-tight uppercase mb-3 line-clamp-1 group-hover:text-[#FF3366] transition-colors">
//                   {order.package.name}
//                 </h3>

//                 {/* Price Box */}
//                 <div className="mt-auto mb-3 bg-slate-50 border-2 border-black border-dashed rounded p-2 relative">
//                   <div className="absolute -top-2 -right-2 bg-[#FF3366] text-white text-[8px] font-bold px-1.5 py-0.5 border border-black rounded shadow-sm rotate-6">
//                     SALE
//                   </div>
//                   <p className="text-[9px] font-bold text-slate-500 uppercase">
//                     Total Price
//                   </p>
//                   <div className="flex items-center gap-2">
//                     <span className="text-xl font-black text-black italic tracking-tighter">
//                       {formatPrice(order.totalAmount)}
//                     </span>
//                     <span className="text-[10px] text-slate-400 line-through font-bold decoration-red-500 decoration-2">
//                       {formatPrice(order.totalAmount * 1.2)}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Buttons */}
//                 {order.status === "APPROVED" ? (
//                   <Link href="/game" className="w-full">
//                     <Button className="w-full h-10 bg-[#00FF94] hover:bg-[#00cc76] text-black font-black border-[3px] border-black rounded-lg shadow-[3px_3px_0px_0px_#000] active:shadow-none active:translate-y-[3px] transition-all uppercase text-xs flex items-center justify-center gap-2 relative overflow-hidden">
//                       <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
//                       <Gamepad2Icon /> PLAY GAME
//                     </Button>
//                   </Link>
//                 ) : order.payments.length > 0 && order.payments[0].slipUrl ? (
//                   <Button
//                     onClick={() => handleViewSlip(order)}
//                     className="w-full h-10 bg-white hover:bg-slate-100 text-black font-black border-[3px] border-black rounded-lg shadow-[3px_3px_0px_0px_#000] active:shadow-none active:translate-y-[3px] transition-all uppercase text-xs flex items-center justify-center gap-2"
//                   >
//                     <Ticket className="w-4 h-4" /> VIEW SLIP
//                   </Button>
//                 ) : (
//                   <div className="w-full h-10 bg-slate-200 border-[3px] border-slate-400 border-dashed rounded-lg flex items-center justify-center gap-2 text-slate-500 font-bold text-xs uppercase cursor-not-allowed">
//                     <Clock className="w-3.5 h-3.5" /> WAITING
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <Dialog open={slipDialogOpen} onOpenChange={setSlipDialogOpen}>
//         <DialogContent className="w-[90vw] max-w-md p-0 border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-xl bg-white overflow-hidden">
//           <DialogHeader className="p-4 bg-[#FFD028] border-b-[4px] border-black flex flex-row items-center justify-between space-y-0">
//             <DialogTitle className="font-black uppercase text-lg flex items-center gap-2 text-black tracking-tight">
//               <Ticket className="w-6 h-6" /> PAYMENT RECEIPT
//             </DialogTitle>
//           </DialogHeader>
//           {selectedOrder && selectedOrder.payments[0]?.slipUrl && (
//             <div className="bg-slate-100 p-4">
//               <div className="relative w-full aspect-[3/4] border-[3px] border-black bg-white rounded-lg shadow-sm overflow-hidden">
//                 <Image
//                   src={selectedOrder.payments[0].slipUrl}
//                   alt="Slip"
//                   fill
//                   className="object-contain p-2"
//                 />
//               </div>
//               <div className="mt-4 text-center">
//                 <Button
//                   onClick={() => setSlipDialogOpen(false)}
//                   className="w-full bg-black text-white hover:bg-gray-800 font-bold border-2 border-black shadow-[4px_4px_0px_0px_#888] active:shadow-none active:translate-y-1 transition-all"
//                 >
//                   CLOSE WINDOW
//                 </Button>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

// // Custom Icon
// function Gamepad2Icon() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="16"
//       height="16"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2.5"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className="lucide lucide-gamepad-2"
//     >
//       <line x1="6" x2="10" y1="12" y2="12" />
//       <line x1="8" x2="8" y1="10" y2="14" />
//       <line x1="15" x2="15.01" y1="13" y2="13" />
//       <line x1="18" x2="18.01" y1="11" y2="11" />
//       <rect width="20" height="12" x="2" y="6" rx="2" />
//     </svg>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format-price";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Clock,
  CheckCircle,
  XCircle,
  Ticket,
  Copy,
  Loader2,
  Calendar,
  Wallet,
  Zap,
  Package,
} from "lucide-react";
import dayjs from "@/lib/dayjs";
import { toast } from "sonner";

type SpinOrder = {
  id: string;
  orderNumber: string;
  spinAmount: number;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  createdAt: Date;
  package: {
    name: string;
    imageUrl: string;
  };
  payments: {
    slipUrl: string | null;
    status: string;
  }[];
};

interface SpinOrdersListProps {
  orders: SpinOrder[];
}

export default function SpinOrdersList({ orders }: SpinOrdersListProps) {
  const [selectedOrder, setSelectedOrder] = useState<SpinOrder | null>(null);
  const [slipDialogOpen, setSlipDialogOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleViewSlip = (order: SpinOrder) => {
    setSelectedOrder(order);
    setSlipDialogOpen(true);
  };

  const copyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("คัดลอกรหัสออเดอร์แล้ว!");
  };

  // 🎨 God-Tier Badge Config
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return {
          bg: "bg-gray-200",
          border: "border-gray-900",
          text: "รอชำระเงิน",
          icon: Clock,
          textColor: "text-gray-900",
        };
      case "WAITING_VERIFICATION":
        return {
          bg: "bg-[#FFD028]", // เหลือง Cyberpunk
          border: "border-black",
          text: "กำลังตรวจสอบ",
          icon: Loader2,
          textColor: "text-black",
          animate: "animate-spin",
        };
      case "APPROVED":
        return {
          bg: "bg-[#00FF94]", // เขียว Neon
          border: "border-black",
          text: "อนุมัติแล้ว", // ✅ แก้ไขตรงนี้เป็น "อนุมัติแล้ว"
          icon: CheckCircle,
          textColor: "text-black",
        };
      case "REJECTED":
        return {
          bg: "bg-[#FF3366]", // ชมพู/แดง Vivid
          border: "border-black",
          text: "ถูกปฏิเสธ",
          icon: XCircle,
          textColor: "text-white",
        };
      default:
        return {
          bg: "bg-white",
          border: "border-black",
          text: status,
          icon: Clock,
          textColor: "text-black",
        };
    }
  };

  if (!isMounted) return null;

  if (orders.length === 0) {
    return (
      <div className="relative border-4 border-black bg-slate-100 p-8 rounded-xl shadow-[8px_8px_0px_0px_#000] overflow-hidden text-center group hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_#000] transition-all cursor-pointer transform-gpu backface-hidden will-change-transform">
        <div className="absolute inset-0 opacity-[0.1] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-white border-4 border-black rounded-full flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_#000] rotate-12 group-hover:rotate-0 transition-transform">
            <Package className="w-10 h-10 text-black" />
          </div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">
            EMPTY CART?
          </h2>
          <p className="font-bold text-slate-500 mb-6 bg-white border-2 border-black px-4 py-1 rounded-full">
            ยังไม่มีไอเทมในคลังของคุณ
          </p>
          <Link href="/spin">
            <Button className="h-12 px-8 bg-[#FFD028] hover:bg-[#ffdf6c] text-black font-black text-lg border-4 border-black shadow-[4px_4px_0px_0px_#000] hover:translate-y-1 hover:shadow-none transition-all uppercase rounded-lg transform-gpu backface-hidden">
              ไปช้อปเลย! 🛒
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 pb-5">
        {orders.map((order) => {
          const config = getStatusConfig(order.status);
          const StatusIcon = config.icon;

          return (
            <div
              key={order.id}
              // ✅ Fix Layout Tearing & Stacking Context
              // 1. transform-gpu, backface-hidden, will-change-transform: บังคับ GPU render ป้องกันเส้นขาว/ภาพฉีก
              // 2. hover:z-10: ยกการ์ดขึ้นเมื่อ hover เพื่อไม่ให้เงาไปซ้อนทับการ์ดอื่น
              // 3. relative: เพื่อให้ z-index ทำงานได้ถูกต้อง
              className="group relative flex flex-col h-full bg-white border-[3px] border-black rounded-xl shadow-[6px_6px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200 transform-gpu backface-hidden will-change-transform hover:z-10"
            >
              {/* --- IMAGE AREA --- */}
              <div className="relative w-full aspect-square border-b-[3px] border-black overflow-hidden rounded-t-[9px] bg-slate-50">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:8px_8px] z-0"></div>

                <Image
                  src={order.package.imageUrl}
                  alt={order.package.name}
                  fill
                  className="object-cover z-0 group-hover:scale-110 transition-transform duration-500 ease-in-out"
                />

                {/* ✅ Badge สถานะ */}
                <div
                  className={`absolute top-2 left-2 z-10 flex items-center gap-1.5 px-2 py-1 ${config.bg} ${config.textColor} border-2 border-black rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                >
                  <StatusIcon
                    className={`w-3.5 h-3.5 ${config.animate || ""}`}
                  />
                  <span className="text-[10px] font-black uppercase tracking-tight">
                    {config.text}
                  </span>
                </div>

                {/* Badge: Spins */}
                <div className="absolute bottom-2 right-2 z-10 bg-white text-black border-2 border-black px-2 py-0.5 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-yellow-400 text-black" />
                  <span className="text-[10px] font-black">
                    {order.spinAmount} SPINS
                  </span>
                </div>
              </div>

              {/* --- CONTENT AREA --- */}
              <div className="flex-1 flex flex-col p-3 bg-white rounded-b-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 bg-[radial-gradient(#ccc_1px,transparent_1px)] [background-size:4px_4px] opacity-50"></div>

                {/* Info Lines */}
                <div className="flex flex-col gap-1 mb-2">
                  {/* Order ID */}
                  <div
                    className="flex items-center gap-1 cursor-pointer w-fit group/copy"
                    onClick={() => copyOrderId(order.orderNumber)}
                    title="คลิกเพื่อคัดลอก"
                  >
                    <span className="text-[9px] bg-black text-white px-1.5 py-0.5 rounded-sm font-bold font-mono group-hover/copy:bg-[#FF3366] transition-colors">
                      #{order.orderNumber.slice(-5)}
                    </span>
                    <Copy className="w-2.5 h-2.5 text-slate-400 group-hover/copy:text-black transition-colors" />
                  </div>

                  {/* Date & Payment Info */}
                  <div className="flex flex-wrap gap-2 items-center mt-1">
                    <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      <Calendar className="w-3 h-3" />
                      {dayjs(order.createdAt).format("DD/MM/YY")}
                    </div>
                    <div className="flex items-center gap-1 text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 uppercase">
                      <Wallet className="w-3 h-3" />
                      {order.paymentMethod === "PROMPTPAY" ? "QR CODE" : "BANK"}
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-black text-sm text-black leading-tight uppercase mb-3 line-clamp-1 group-hover:text-[#FF3366] transition-colors">
                  {order.package.name}
                </h3>

                {/* Price Box */}
                <div className="mt-auto mb-3 bg-slate-50 border-2 border-black border-dashed rounded p-2 relative transform-gpu backface-hidden">
                  <div className="absolute -top-2 -right-2 bg-[#FF3366] text-white text-[8px] font-bold px-1.5 py-0.5 border border-black rounded shadow-sm rotate-6 z-10">
                    SALE
                  </div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase">
                    Total Price
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-black italic tracking-tighter">
                      {formatPrice(order.totalAmount)}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through font-bold decoration-red-500 decoration-2">
                      {formatPrice(order.totalAmount * 1.2)}
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                {order.status === "APPROVED" ? (
                  <Link href="/game" className="w-full">
                    <Button className="w-full h-10 bg-[#00FF94] hover:bg-[#00cc76] text-black font-black border-[3px] border-black rounded-lg shadow-[3px_3px_0px_0px_#000] active:shadow-none active:translate-y-[3px] transition-all uppercase text-xs flex items-center justify-center gap-2 relative overflow-hidden transform-gpu backface-hidden">
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      <Gamepad2Icon /> PLAY GAME
                    </Button>
                  </Link>
                ) : order.payments.length > 0 && order.payments[0].slipUrl ? (
                  <Button
                    onClick={() => handleViewSlip(order)}
                    className="w-full h-10 bg-white hover:bg-slate-100 text-black font-black border-[3px] border-black rounded-lg shadow-[3px_3px_0px_0px_#000] active:shadow-none active:translate-y-[3px] transition-all uppercase text-xs flex items-center justify-center gap-2 transform-gpu backface-hidden"
                  >
                    <Ticket className="w-4 h-4" /> VIEW SLIP
                  </Button>
                ) : (
                  <div className="w-full h-10 bg-slate-200 border-[3px] border-slate-400 border-dashed rounded-lg flex items-center justify-center gap-2 text-slate-500 font-bold text-xs uppercase cursor-not-allowed">
                    <Clock className="w-3.5 h-3.5" /> WAITING
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={slipDialogOpen} onOpenChange={setSlipDialogOpen}>
        <DialogContent className="w-[90vw] max-w-md p-0 border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-xl bg-white overflow-hidden transform-gpu backface-hidden">
          <DialogHeader className="p-4 bg-[#FFD028] border-b-[4px] border-black flex flex-row items-center justify-between space-y-0">
            <DialogTitle className="font-black uppercase text-lg flex items-center gap-2 text-black tracking-tight">
              <Ticket className="w-6 h-6" /> PAYMENT RECEIPT
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && selectedOrder.payments[0]?.slipUrl && (
            <div className="bg-slate-100 p-4">
              <div className="relative w-full aspect-[3/4] border-[3px] border-black bg-white rounded-lg shadow-sm overflow-hidden transform-gpu backface-hidden">
                <Image
                  src={selectedOrder.payments[0].slipUrl}
                  alt="Slip"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="mt-4 text-center">
                <Button
                  onClick={() => setSlipDialogOpen(false)}
                  className="w-full bg-black text-white hover:bg-gray-800 font-bold border-2 border-black shadow-[4px_4px_0px_0px_#888] active:shadow-none active:translate-y-1 transition-all transform-gpu backface-hidden"
                >
                  CLOSE WINDOW
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// Custom Icon
function Gamepad2Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-gamepad-2"
    >
      <line x1="6" x2="10" y1="12" y2="12" />
      <line x1="8" x2="8" y1="10" y2="14" />
      <line x1="15" x2="15.01" y1="13" y2="13" />
      <line x1="18" x2="18.01" y1="11" y2="11" />
      <rect width="20" height="12" x="2" y="6" rx="2" />
    </svg>
  );
}
