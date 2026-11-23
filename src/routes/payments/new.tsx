import { createFileRoute } from "@tanstack/react-router";
import { EntryForm } from "@/components/app/EntryForm";

export const Route = createFileRoute("/payments/new")({
  validateSearch: (s: Record<string, unknown>): { pharmacy?: string } => (typeof s["pharmacy"] === "string" ? { pharmacy: s["pharmacy"] } : {}),
  head: () => ({ meta: [
    { title: "تسجيل سداد / جباية" }, { name: "description", content: "اختيار الصيدلية وقيمة السداد ورفع صورة القسيمة." },
    { property: "og:title", content: "تسجيل سداد / جباية" }, { property: "og:description", content: "نموذج تسجيل سداد لحساب صيدلية." },
  ] }),
  component: () => {
    const { pharmacy } = Route.useSearch();
    return <div className="space-y-4"><h1 className="text-2xl font-bold">تسجيل سداد / جباية</h1><EntryForm kind="payment" {...(pharmacy ? { initialPharmacyId: pharmacy } : {})} /></div>;
  },
});
