import { cn } from "@/lib/utils";
import { getTrafficLightBadgeText, type TrafficLightLevel } from "@/lib/traffic-light-priority";

type Props = {
  level: TrafficLightLevel;
  lang: "de" | "en";
  settled?: boolean;
  className?: string;
};

export function TrafficLightBadge({ level, lang, settled, className }: Props) {
  const text = getTrafficLightBadgeText(lang, level, settled);
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none tracking-tight",
        settled &&
          "border-[rgba(123,191,159,0.45)] bg-[rgba(123,191,159,0.14)] text-[var(--foreground)]/90",
        !settled &&
          level === "high" &&
          "border-[rgba(185,110,110,0.38)] bg-[rgba(185,110,110,0.09)] text-[var(--foreground)]/92",
        !settled &&
          level === "medium" &&
          "border-[rgba(210,170,95,0.42)] bg-[rgba(242,166,90,0.11)] text-[var(--foreground)]/90",
        !settled &&
          level === "low" &&
          "border-[rgba(95,163,163,0.32)] bg-[rgba(123,191,159,0.10)] text-[var(--foreground)]/88",
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 shrink-0 rounded-full",
          settled && "bg-[rgba(95,163,163,0.82)]",
          !settled && level === "high" && "bg-[rgba(175,90,90,0.72)]",
          !settled && level === "medium" && "bg-[rgba(200,145,65,0.78)]",
          !settled && level === "low" && "bg-[rgba(95,163,163,0.62)]"
        )}
        aria-hidden
      />
      <span>{text}</span>
    </span>
  );
}
