import { createFileRoute, Link } from "@tanstack/react-router";
import { useCompany } from "@/lib/company";
import { fmt, ledger, pharmacies } from "@/lib/demo-data";
import { EmptyState, Stat, btnCls, btnOutline } from "@/components/app/states";

export const Route = createFileRoute("/_authenticated/pharmacies/$id")({
  head: () => ({ meta: [
    { title: "دفتر حساب الصيدلية" },
    { name: "description", content: "إجمالي المفوتر والسداد والمتبقي وحركات حساب الصيدلية." },
    { property: "og:title", content: "دفتر حساب الصيدلية" },
    { property: "og:description", content: "حركات الفواتير والسدادات لحساب الصيدلية." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Ledger,
});

function Ledger() {
  const { id } = Route.useParams();
  const { companyId, company } = useCompany();
  const p = pharmacies.find((x) => x.id === id && x.companyId === companyId);
  if (!p) return <EmptyState title={`هذا الحساب غير موجود في ${company.name}`} hint="لكل شركة حساباتها المستقلة." action={<Link to="/" className={btnOutline}>العودة للحسابات</Link>} />;
  const rows = ledger.filter((e) => e.pharmacyId === p.id);
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-bold">{p.name}</h1><p className="text-sm text-muted-foreground">حساب لدى {company.name}</p></div>
        <div className="flex gap-2">
          <Link to="/invoices/new" search={{ pharmacy: p.id }} className={btnCls}>+ فاتورة</Link>
          <Link to="/payments/new" search={{ pharmacy: p.id }} className={btnOutline}>+ سداد</Link>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="إجمالي المفوتر" value={fmt(p.totalInvoiced)} tone="up" />
        <Stat label="إجمالي السداد" value={fmt(p.totalPaid)} tone="down" />
        <Stat label="المتبقي" value={fmt(p.remaining)} />
      </div>
      {rows.length === 0 ? <EmptyState title="لا توجد حركات بعد" hint="سجّل فاتورة أو سداداً ليظهر هنا." /> : (
        <div className="overflow-x-auto rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground"><tr>
              <th className="p-3 text-start">النوع</th><th className="p-3 text-start">المرجع</th><th className="p-3 text-start">المبلغ</th>
              <th className="p-3 text-start">الأثر على الرصيد</th><th className="p-3 text-start">التاريخ*</th><th className="p-3 text-start">الرصيد المتتابع*</th></tr></thead>
            <tbody>{rows.map((e) => {
              const inv = e.kind === "invoice";
              return (
                <tr key={e.id} className="border-t">
                  <td className="p-3"><span className={`rounded px-2 py-0.5 text-xs font-medium ${inv ? "bg-debit/10 text-debit" : "bg-success/10 text-success"}`}>{inv ? "فاتورة" : "سداد"}</span></td>
                  <td className="p-3">{inv ? <Link to="/invoices/$id" params={{ id: e.id }} className="text-primary hover:underline">{e.reference}</Link> : e.reference}</td>
                  <td className="p-3">{fmt(e.amount)}</td>
                  <td className={`p-3 font-medium ${inv ? "text-debit" : "text-success"}`}>{inv ? "▲ يزيد المطلوب" : "▼ يخفض المطلوب"}</td>
                  <td className="p-3 text-muted-foreground">{e.date ?? "—"}</td>
                  <td className="p-3 text-muted-foreground">{e.runningBalance != null ? fmt(e.runningBalance) : "—"}</td>
                </tr>);
            })}</tbody>
          </table>
          <p className="border-t p-3 text-xs text-muted-foreground">* التاريخ والرصيد المتتابع تنظيم مقترح لم يُعتمد بعد.</p>
        </div>
      )}
    </div>
  );
}
