"use client";

interface SlotFrameProps {
  children: React.ReactNode;
}

export const SlotFrame = ({ children }: SlotFrameProps) => {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      {/* Outer Frame with Gold Border */}
      <div
        className="relative rounded-3xl p-1"
        style={{
          background:
            "linear-gradient(180deg, #fcd34d 0%, #b45309 50%, #fcd34d 100%)",
          boxShadow:
            "0 0 60px rgba(234, 179, 8, 0.3), 0 20px 40px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Inner dark container */}
        <div
          className="relative rounded-[22px] overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, #0f3d1f 0%, #052e16 50%, #041f10 100%)",
            boxShadow:
              "inset 0 2px 20px rgba(0, 0, 0, 0.8), inset 0 -2px 20px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* Top light strip */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 rounded-b-full z-20"
            style={{
              background:
                "linear-gradient(90deg, transparent, #22c55e, transparent)",
              boxShadow: "0 0 20px rgba(34, 197, 94, 0.8)",
            }}
          />

          {/* Side accent lights */}
          <div
            className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full z-20"
            style={{
              background:
                "linear-gradient(180deg, transparent, #22c55e, transparent)",
              boxShadow: "0 0 15px rgba(34, 197, 94, 0.6)",
            }}
          />
          <div
            className="absolute right-0 top-1/4 bottom-1/4 w-1 rounded-l-full z-20"
            style={{
              background:
                "linear-gradient(180deg, transparent, #22c55e, transparent)",
              boxShadow: "0 0 15px rgba(34, 197, 94, 0.6)",
            }}
          />

          {/* Reels Container */}
          <div className="relative p-6">
            {/* Glass overlay effect */}
            <div
              className="absolute inset-6 rounded-xl pointer-events-none z-10"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.2) 100%)",
                borderTop: "1px solid rgba(255,255,255,0.1)",
              }}
            />

            {/* Reels background */}
            <div
              className="relative rounded-xl overflow-hidden"
              style={{
                background: "linear-gradient(180deg, #0a1f12 0%, #071a0e 100%)",
                boxShadow: "inset 0 4px 20px rgba(0, 0, 0, 0.8)",
              }}
            >
              {/* The 3 Reels */}
              <div className="flex justify-center p-4 gap-3">{children}</div>
            </div>
          </div>

          {/* Bottom light strip */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1 rounded-t-full z-20"
            style={{
              background:
                "linear-gradient(90deg, transparent, #22c55e, transparent)",
              boxShadow: "0 0 20px rgba(34, 197, 94, 0.8)",
            }}
          />
        </div>
      </div>

      {/* Corner Gems - Subtle and elegant */}
      <div
        className="absolute -top-2 -left-2 w-5 h-5 rounded-full"
        style={{
          background: "radial-gradient(circle, #22c55e 0%, #166534 100%)",
          boxShadow: "0 0 10px rgba(34, 197, 94, 0.8)",
        }}
      />
      <div
        className="absolute -top-2 -right-2 w-5 h-5 rounded-full"
        style={{
          background: "radial-gradient(circle, #22c55e 0%, #166534 100%)",
          boxShadow: "0 0 10px rgba(34, 197, 94, 0.8)",
        }}
      />
      <div
        className="absolute -bottom-2 -left-2 w-5 h-5 rounded-full"
        style={{
          background: "radial-gradient(circle, #22c55e 0%, #166534 100%)",
          boxShadow: "0 0 10px rgba(34, 197, 94, 0.8)",
        }}
      />
      <div
        className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full"
        style={{
          background: "radial-gradient(circle, #22c55e 0%, #166534 100%)",
          boxShadow: "0 0 10px rgba(34, 197, 94, 0.8)",
        }}
      />
    </div>
  );
};
