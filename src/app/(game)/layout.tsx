import { ReactNode } from "react";

interface GameLayoutProps {
  children: ReactNode;
}

// Fullscreen layout without navbar/footer for immersive game experience
export default function GameLayout({ children }: GameLayoutProps) {
  return (
    <div className="min-h-svh w-full overflow-hidden">
      {children}
    </div>
  );
}
