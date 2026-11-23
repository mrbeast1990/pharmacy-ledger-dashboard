import { createFileRoute } from "@tanstack/react-router";
import { EntryForm } from "@/components/app/EntryForm";

export const Route = createFileRoute("/invoices/new")({
  validateSearch: (s: Record<string, unknown>): { pharmacy?: string } => (typeof s["pharmacy"] === "string" ? { pharmacy: s["pharmacy"] } : {}),
  head: () => ({ meta: [
    { title: "تسجيل فاتورة" }, { name: "description", content: "تسجيل رقم الفاتورة والصيدلية والقيمة ورفع صورة الفاتورة." },
    { property: "og:title", content: "تسجيل فاتورة" }, { property: "og:description", content: "نموذج تسجيل فاتورة لحساب صيدلية." },
  ] }),
  component: () => {
    const { pharmacy } = Route.useSearch();
    return <div className="space-y-4"><h1 className="text-2xl font-bold">تسجيل فاتورة</h1><EntryForm kind="invoice" {...(pharmacy ? { initialPharmacyId: pharmacy } : {})} /></div>;
  },
});
