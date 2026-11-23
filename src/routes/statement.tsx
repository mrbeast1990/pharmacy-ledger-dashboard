import { createFileRoute, Link } from "@tanstack/react-router";
import { useCompany } from "@/lib/company";
import { fmt, pharmacies, summaries } from "@/lib/demo-data";
import { Card, EmptyState, Stat } from "@/components/app/states";

export const Route = createFileRoute("/statement")({
  head: () => ({ meta: [
    { title: "كشف الحساب — ملخص الشركة" }, { name: "description", content: "المفوتر والمجبي والمتبقي للشركة المختارة وكشف كل صيدلية." },
    { property: "og:title", content: "كشف الحساب" }, { property: "og:description", content: "ملخص المفوتر والمجبي والمتبقي." },
  ] }),
  component: Statement,
});

function Statement() {
  const { companyId, company } = useCompany();
  const s = summaries[companyId];
  const list = pharmacies.filter((p) => p.companyId === companyId);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">كشف حساب {company.name}</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="إجمالي المفوتر" value={fmt(s.totalInvoiced)} tone="up" />
        <Stat label="إجمالي المجبي" value={fmt(s.totalCollected)} tone="down" />
        <Stat label="المتبقي خارجاً" value={fmt(s.outstanding)} />
      </div>
      {company.hasCommission && s.commission && (
        <Card className="border-primary/40">
          <div className="text-xs text-muted-foreground">عمولة الجباية</div>
          <div className="text-2xl font-bold text-primary">{fmt(s.commission.amount)}</div>
          <p className="mt-1 text-xs text-muted-foreground">{s.commission.ruleLabel}</p>
        </Card>
      )}
      <h2 className="font-semibold">كشف على مستوى الصيدلية</h2>
      {list.length === 0 ? <EmptyState title="لا توجد صيدليات لعرض كشفها" /> : (
        <div className="grid gap-3 sm:grid-cols-2">{list.map((p) => (
          <Link key={p.id} to="/pharmacies/$id" params={{ id: p.id }} className="rounded-lg border bg-card p-4 hover:border-primary">
            <div className="font-semibold">{p.name}</div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
              <span>مفوتر<br /><b className="text-foreground">{fmt(p.totalInvoiced)}</b></span>
              <span>مسدد<br /><b className="text-foreground">{fmt(p.totalPaid)}</b></span>
              <span>متبقي<br /><b className="text-primary">{fmt(p.remaining)}</b></span>
            </div>
          </Link>))}</div>
      )}
    </div>
  );
}
