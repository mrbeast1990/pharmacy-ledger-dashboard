import { createFileRoute, Link } from "@tanstack/react-router";
import { useCompany } from "@/lib/company";
import { fmt, ledger, pharmacies } from "@/lib/demo-data";
import { Card, EmptyState, btnOutline } from "@/components/app/states";

export const Route = createFileRoute("/_authenticated/invoices/$id")({
  head: () => ({ meta: [
    { title: "تفاصيل الفاتورة والمرجع" }, { name: "description", content: "رقم الفاتورة واسم الصيدلية والقيمة والمرفق المرتبط." },
    { property: "og:title", content: "تفاصيل الفاتورة" }, { property: "og:description", content: "عرض الفاتورة ومرفقها المرجعي." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: InvoiceDetail,
});

function InvoiceDetail() {
  const { id } = Route.useParams();
  const { companyId, company } = useCompany();
  const e = ledger.find((x) => x.id === id && x.kind === "invoice");
  const p = e && pharmacies.find((x) => x.id === e.pharmacyId && x.companyId === companyId);
  if (!e || !p) return <EmptyState title={`الفاتورة غير موجودة في ${company.name}`} action={<Link to="/" className={btnOutline}>العودة</Link>} />;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">فاتورة رقم {e.reference}</h1>
      <Card className="grid gap-4 sm:grid-cols-3">
        <div><div className="text-xs text-muted-foreground">رقم الفاتورة</div><div className="font-bold">{e.reference}</div></div>
        <div><div className="text-xs text-muted-foreground">الصيدلية</div><Link to="/pharmacies/$id" params={{ id: p.id }} className="font-bold text-primary">{p.name}</Link></div>
        <div><div className="text-xs text-muted-foreground">القيمة</div><div className="font-bold">{fmt(e.amount)}</div></div>
      </Card>
      <Card>
        <h2 className="mb-3 font-semibold">المرفق المرجعي</h2>
        {e.attachmentName ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border bg-muted p-4">
            <span>📎 {e.attachmentName}</span>
            <div className="flex gap-2"><button className={btnOutline} disabled title="بانتظار خدمة الملفات">فتح المرفق</button>
              <label className={`${btnOutline} cursor-pointer`}>استبدال<input type="file" className="hidden" accept="image/*,application/pdf" /></label></div>
          </div>
        ) : <EmptyState title="لا يوجد مرفق لهذه الفاتورة" hint="ارفع صورة الفاتورة الأصلية أو الملف المصمم خارج التطبيق." />}
        <p className="mt-3 text-xs text-muted-foreground">الفاتورة تُصمَّم خارج التطبيق ثم تُرفع هنا. فتح المرفق أو استبداله لا يغيّر قيمة الحساب.</p>
      </Card>
    </div>
  );
}
