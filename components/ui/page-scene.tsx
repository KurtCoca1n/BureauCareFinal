"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

function getSceneClass(pathname: string) {
  if (pathname === "/app") return "scene-home";
  if (pathname.startsWith("/app/documents")) return "scene-documents";
  if (pathname.startsWith("/app/tasks")) return "scene-tasks";
  if (pathname.startsWith("/app/goals")) return "scene-goals";
  if (pathname.startsWith("/app/settings")) return "scene-settings";
  if (pathname.startsWith("/app/cases")) return "scene-cases";
  if (pathname.startsWith("/app/upload")) return "scene-documents";
  return "scene-home";
}

export function PageScene({ children, className }: { children: ReactNode; className?: string }) {
  const pathname = usePathname();

  return <div className={cn("page-scene", getSceneClass(pathname), className)}>{children}</div>;
}
