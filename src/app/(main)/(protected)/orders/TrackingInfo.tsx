"use client"; // ✅ ต้องมีบรรทัดนี้ เพื่อให้ใช้ฟังก์ชัน handleCopy ได้

interface Props {
  carrier?: string | null; // ✅ เพิ่ม | null เข้าไป
  trackingNumber?: string | null; // ✅ เพิ่ม | null เข้าไป
}

export default function TrackingInfo({ carrier, trackingNumber }: Props) {
  // 🚀 นี่คือฟังก์ชันที่หายไป (handleCopy)
  const handleCopy = () => {
    if (trackingNumber) {
      navigator.clipboard.writeText(trackingNumber);
      // มึงสามารถเพิ่มคำสั่งแจ้งเตือน (Toast) ตรงนี้ได้ถ้าต้องการ
    }
  };

  return (
    <div className=" flex flex-col gap-2.5 px-1 select-none">
      {/* --- ส่วนข้อมูลขนส่ง --- */}
      <div className="flex flex-col gap-2 font-medium">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">ขนส่งโดย</span>
          <span className="font-semibold text-emerald-800 tracking-tight antialiased">
            {carrier || "J&T Express"}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">เลขติดตามพัสดุ</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[12px] font-bold tracking-tight text-emerald-700 antialiased">
              {trackingNumber || "-------"}
            </span>

            {/* ✅ เรียกใช้ handleCopy ตรงนี้ */}
            <button
              onClick={handleCopy}
              className="text-zinc-600 hover:text-emerald-400 transition-colors active:scale-90"
              title="คัดลอกเลขพัสดุ"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
