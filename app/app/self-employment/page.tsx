import { Inter } from "next/font/google";

import { SelfEmploymentFlow } from "@/components/app/self-employment-flow";
import { PageShell } from "@/components/ui/page-shell";
import { getRequestLanguage } from "@/lib/request-locale";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"]
});

export default async function SelfEmploymentPage() {
  const locale = await getRequestLanguage();

  return (
    <PageShell className={cn(inter.className, "justify-start px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14")}>
      <SelfEmploymentFlow locale={locale} />
    </PageShell>
  );
}

