import { useEffect, useRef } from "react";

export function useSmoothMarquee(speed = 1) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(null);
  const positionRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    // ฟังก์ชัน Clone เพื่อให้ข้อความยาวพอที่จะ Loop ได้เนียนๆ
    // (ถ้า Clone แล้วยังสั้นกว่าจอก็ Clone เพิ่มอีกได้ตาม Logic นี้)
    
    const animate = () => {
      // ขยับตำแหน่งทีละนิดตาม Speed
      positionRef.current -= speed;
      
      const contentWidth = content.offsetWidth / 2; // หาร 2 เพราะเรามี 2 ชุด
      
      // ถ้าวิ่งเกินครึ่งทางแล้ว ให้ดีดกลับมาที่ 0 ทันที (Reset)
      if (Math.abs(positionRef.current) >= contentWidth) {
        positionRef.current = 0;
      }

      // ใช้ translate3d เพื่อบังคับใช้ GPU แต่ใส่ค่าเป็น px เป๊ะๆ (ลดปัญหา Sub-pixel)
      content.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
      
      requestRef.current = requestAnimationFrame(animate);
    };

    // เริ่ม Animation loop
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [speed]);

  return { containerRef, contentRef };
}