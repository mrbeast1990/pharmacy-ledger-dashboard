import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownLeft, ArrowRight, ArrowUpLeft, FilePlus2, Plus } from "lucide-react";
import { useCompany } from "@/lib/company";
import { fmt, ledger, pharmacies } from "@/lib/demo-data";
import { formatDate } from "@/lib/format";
import { Card, EmptyState, Stat, btnCls, btnOutline } from "@/components/app/states";

export const Route = createFileRoute("/_authenticated/pharmacies/$id")({
  head: () => ({ meta: [
    { title: "دفتر حساب الصيدلية — دفتر دلتا ويافا" },
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
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary"><ArrowRight className="h-4 w-4" aria-hidden="true" />العودة إلى الحسابات</Link>
      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">دفتر الصيدلية</p>
          <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">{p.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">حساب مستقل لدى {company.name}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/invoices/new" search={{ pharmacy: p.id }} className={btnCls}><Plus className="h-4 w-4" aria-hidden="true" />فاتورة</Link>
          <Link to="/payments/new" search={{ pharmacy: p.id }} className={btnOutline}><Plus className="h-4 w-4" aria-hidden="true" />سداد</Link>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="إجمالي المفوتر" value={fmt(p.totalInvoiced)} tone="up" />
        <Stat label="إجمالي السداد" value={fmt(p.totalPaid)} tone="down" />
        <Stat label="المتبقي" value={fmt(p.remaining)} tone="main" />
      </div>

      {rows.length === 0 ? <EmptyState title="لا توجد حركات بعد" hint="سجّل فاتورة أو سداداً ليظهر هنا." /> : (
        <Card className="overflow-hidden p-0">
          <div className="border-b border-border/70 p-5 sm:px-6">
            <h2 className="flex items-center gap-2 text-lg font-extrabold"><FilePlus2 className="h-5 w-5 text-primary" aria-hidden="true" />حركات الحساب</h2>
            <p className="mt-1 text-xs text-muted-foreground">الفاتورة تزيد المطلوب، والسداد يخفضه.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-sm">
              <thead className="bg-muted/70 text-xs text-muted-foreground"><tr>
                <th className="p-4 text-start font-bold">النوع</th><th className="p-4 text-start font-bold">المرجع</th><th className="p-4 text-start font-bold">المبلغ</th>
                <th className="p-4 text-start font-bold">الأثر على الرصيد</th><th className="p-4 text-start font-bold">التاريخ*</th><th className="p-4 text-start font-bold">الرصيد المتتابع*</th></tr></thead>
              <tbody>{rows.map((e) => {
                const inv = e.kind === "invoice";
                return (
                  <tr key={e.id} className="border-t border-border/70 transition hover:bg-muted/45">
                    <td className="p-4"><span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-foreground">{inv ? "فاتورة" : "سداد"}</span></td>
                    <td className="p-4 font-semibold">{inv ? <Link to="/invoices/$id" params={{ id: e.id }} className="text-primary underline-offset-4 hover:underline">{e.reference}</Link> : e.reference}</td>
                    <td className="p-4 font-extrabold tabular-nums">{fmt(e.amount)}</td>
                    <td className={`p-4 font-semibold ${inv ? "text-foreground" : "text-success"}`}>
                      <span className="inline-flex items-center gap-1.5">{inv ? <ArrowUpLeft className="h-4 w-4" aria-hidden="true" /> : <ArrowDownLeft className="h-4 w-4" aria-hidden="true" />}{inv ? "يزيد المطلوب" : "يخفض المطلوب"}</span>
                    </td>
                    <td className="p-4 text-muted-foreground tabular-nums"><time>{formatDate(e.date)}</time></td>
                    <td className="p-4 text-muted-foreground tabular-nums">{e.runningBalance != null ? fmt(e.runningBalance) : "—"}</td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
          <p className="border-t border-border/70 p-4 text-xs leading-5 text-muted-foreground">* التاريخ والرصيد المتتابع تنظيم مقترح لم يُعتمد بعد.</p>
        </Card>
      )}
    </div>
  );
}
