"use client";

export const GameBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top decorative cannabis leaves */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-green-900/40 to-transparent" />
      <div className="absolute top-0 right-0 opacity-60">
        <div className="text-6xl">🌿</div>
      </div>
      <div className="absolute top-10 right-20 opacity-40">
        <div className="text-4xl">🍃</div>
      </div>
      <div className="absolute top-5 left-10 opacity-50">
        <div className="text-5xl">🌿</div>
      </div>
      {/* Floating particles */}
      <div className="absolute top-1/4 left-1/4 opacity-20 animate-pulse">
        <div className="text-3xl">✨</div>
      </div>
      <div className="absolute top-1/3 right-1/3 opacity-30 animate-pulse delay-500">
        <div className="text-2xl">💚</div>
      </div>
      <div className="absolute bottom-1/4 left-1/3 opacity-25 animate-pulse delay-1000">
        <div className="text-3xl">🌱</div>
      </div>
    </div>
  );
};
