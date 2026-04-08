import { cn } from "@/lib/utils";

/** Gold money sack + coins — „Geld zurück“ */
export function HomeExtraRefundIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("shrink-0", className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="he-refund-bag" x1="7" y1="4" x2="17" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f5e6a8" />
          <stop offset="0.4" stopColor="#d9b24a" />
          <stop offset="1" stopColor="#9a7020" />
        </linearGradient>
        <linearGradient id="he-refund-coin" x1="3" y1="17" x2="11" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fff4b8" />
          <stop offset="0.45" stopColor="#f0c030" />
          <stop offset="1" stopColor="#c99400" />
        </linearGradient>
      </defs>
      <ellipse cx="12" cy="6.2" rx="2.2" ry="1.1" fill="#8b6914" />
      <path
        d="M12 7.2c-2.4 0-4.4 1.5-4.6 3.4L6.8 16c-.3 2.4 2 4.6 5.2 4.6s5.5-2.2 5.2-4.6l-.6-5.4c-.2-1.9-2.2-3.4-4.6-3.4z"
        fill="url(#he-refund-bag)"
        stroke="#6b4f12"
        strokeWidth="0.45"
        strokeLinejoin="round"
      />
      <ellipse cx="6" cy="18.8" rx="2.5" ry="1.35" fill="url(#he-refund-coin)" stroke="#a67c00" strokeWidth="0.28" />
      <ellipse cx="9.2" cy="19.4" rx="2.15" ry="1.15" fill="url(#he-refund-coin)" stroke="#a67c00" strokeWidth="0.28" opacity="0.95" />
      <ellipse cx="17.5" cy="17.6" rx="2.45" ry="1.35" fill="url(#he-refund-coin)" stroke="#a67c00" strokeWidth="0.28" />
    </svg>
  );
}

/** Farbige Scheibe — Ziele / Zielscheibe */
export function HomeExtraGoalsTargetIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("shrink-0", className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <radialGradient id="he-goals-center" cx="50%" cy="45%" r="55%">
          <stop stopColor="#fde68a" />
          <stop offset="0.7" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#d97706" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="10" fill="#ecfdf5" stroke="#34d399" strokeWidth="1.1" />
      <circle cx="12" cy="12" r="7.8" fill="#ffffff" stroke="#10b981" strokeWidth="0.9" />
      <circle cx="12" cy="12" r="5.6" fill="#d1fae5" stroke="#059669" strokeWidth="0.85" />
      <circle cx="12" cy="12" r="3.4" fill="#ffffff" stroke="#047857" strokeWidth="0.75" />
      <circle cx="12" cy="12" r="1.85" fill="url(#he-goals-center)" stroke="#b45309" strokeWidth="0.35" />
    </svg>
  );
}
