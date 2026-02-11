"use client";

import { useState } from "react";
import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createReviewAction } from "@/services/actions/review";
import { toast } from "sonner"; 
import { MessageSquarePlus } from "lucide-react";

export function ReviewModal({ productId }: { productId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
        toast.error("กรุณาเลือกดาวเพื่อระบุความพึงพอใจ");
        return;
    }
    setIsSubmitting(true);
    const res = await createReviewAction({ productId, rating, comment });
    setIsSubmitting(false);
    
    if (res.success) {
      toast.success(res.message);
      setIsOpen(false);
      setRating(0);
      setComment("");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full md:w-auto gap-2 shadow-md">
           <MessageSquarePlus className="size-4" />
           เขียนรีวิวสินค้า
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">แสดงความคิดเห็น</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-6 py-2">
          
          {/* 1. ส่วนเขียนข้อความ (อยู่บน) */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">ข้อความรีวิว</label>
            <Textarea
              placeholder="สินค้าเป็นอย่างไรบ้าง? บอกเล่าประสบการณ์ของคุณ..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none focus-visible:ring-primary"
            />
          </div>

          {/* 2. ส่วนให้ดาว (อยู่ล่าง) */}
          <div className="flex flex-col items-center gap-2 bg-muted/30 p-4 rounded-lg border border-dashed">
            <span className="text-sm font-medium text-muted-foreground">ให้คะแนนความพึงพอใจ</span>
            <StarRating rating={rating} setRating={setRating} />
            <span className="text-sm font-bold text-yellow-600 h-5">
                {rating > 0 ? `${rating} ดาว` : ""}
            </span>
          </div>

          <Button onClick={handleSubmit} disabled={isSubmitting || rating === 0} className="w-full">
            {isSubmitting ? "กำลังส่ง..." : "ยืนยันการรีวิว"}
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}