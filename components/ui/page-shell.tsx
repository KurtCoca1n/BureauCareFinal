import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn("mx-auto flex min-h-screen w-full max-w-[1280px] flex-col px-4 pt-6 sm:px-5 lg:px-6 lg:pb-10", className)}
      style={{ paddingBottom: "var(--bottom-nav-offset)" }}
    >
      {children}
    </main>
  );
}
