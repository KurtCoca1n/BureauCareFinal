import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions/auth";

export function SignOutButton({ label = "Abmelden" }: { label?: string }) {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="ghost" className="w-full justify-start px-0 text-left text-[var(--danger)]">
        {label}
      </Button>
    </form>
  );
}
