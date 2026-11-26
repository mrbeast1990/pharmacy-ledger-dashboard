import { createFileRoute } from "@tanstack/react-router";
import { FilePlus2 } from "lucide-react";
import { EntryForm } from "@/components/app/EntryForm";

export const Route = createFileRoute("/_authenticated/invoices/new")({
  validateSearch: (s: Record<string, unknown>): { pharmacy?: string } => (typeof s["pharmacy"] === "string" ? { pharmacy: s["pharmacy"] } : {}),
  head: () => ({ meta: [
    { title: "تسجيل فاتورة — دفتر دلتا ويافا" }, { name: "description", content: "تسجيل رقم الفاتورة والصيدلية والقيمة ورفع صورة الفاتورة." },
    { property: "og:title", content: "تسجيل فاتورة" }, { property: "og:description", content: "نموذج تسجيل فاتورة لحساب صيدلية." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: () => {
    const { pharmacy } = Route.useSearch();
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground"><FilePlus2 className="h-5 w-5" aria-hidden="true" /></span>
          <div><h1 className="text-2xl font-extrabold sm:text-3xl">تسجيل فاتورة</h1><p className="mt-1 text-sm text-muted-foreground">أدخل بيانات المستند وأرفق صورته المرجعية.</p></div>
        </div>
        <EntryForm kind="invoice" {...(pharmacy ? { initialPharmacyId: pharmacy } : {})} />
      </div>
    );
  },
});
