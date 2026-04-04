"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { getSessionDayPhase, type DayPhase } from "@/lib/day-phase";
import { cn } from "@/lib/utils";

function getSceneClass(pathname: string) {
  if (pathname === "/app") return "scene-home";
  if (pathname.startsWith("/app/documents")) return "scene-documents";
  if (pathname.startsWith("/app/tasks")) return "scene-tasks";
  if (pathname.startsWith("/app/goals")) return "scene-goals";
  if (pathname.startsWith("/app/settings")) return "scene-settings";
  if (pathname.startsWith("/app/my-data")) return "scene-settings";
  if (pathname.startsWith("/app/cases")) return "scene-cases";
  if (pathname.startsWith("/app/processes")) return "scene-processes";
  if (pathname.startsWith("/app/upload")) return "scene-documents";
  return "scene-home";
}

export function PageScene({ children, className }: { children: ReactNode; className?: string }) {
  const pathname = usePathname();
  const [phase, setPhase] = useState<DayPhase>("day");

  useEffect(() => {
    setPhase(getSessionDayPhase());
  }, []);

  return (
    <div className={cn("page-scene", getSceneClass(pathname), className)} data-day-phase={phase}>
      {children}
    </div>
  );
}
