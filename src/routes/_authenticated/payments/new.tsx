import { createFileRoute } from "@tanstack/react-router";
import { WalletCards } from "lucide-react";
import { EntryForm } from "@/components/app/EntryForm";

export const Route = createFileRoute("/_authenticated/payments/new")({
  validateSearch: (s: Record<string, unknown>): { pharmacy?: string } => (typeof s["pharmacy"] === "string" ? { pharmacy: s["pharmacy"] } : {}),
  head: () => ({ meta: [
    { title: "تسجيل سداد / جباية — دفتر دلتا ويافا" }, { name: "description", content: "اختيار الصيدلية وقيمة السداد ورفع صورة القسيمة." },
    { property: "og:title", content: "تسجيل سداد / جباية" }, { property: "og:description", content: "نموذج تسجيل سداد لحساب صيدلية." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: () => {
    const { pharmacy } = Route.useSearch();
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground"><WalletCards className="h-5 w-5" aria-hidden="true" /></span>
          <div><h1 className="text-2xl font-extrabold sm:text-3xl">تسجيل سداد / جباية</h1><p className="mt-1 text-sm text-muted-foreground">سجّل المبلغ والمرجع وتاريخ المستند.</p></div>
        </div>
        <EntryForm kind="payment" {...(pharmacy ? { initialPharmacyId: pharmacy } : {})} />
      </div>
    );
  },
});
