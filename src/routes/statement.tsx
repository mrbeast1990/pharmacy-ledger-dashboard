import { createFileRoute, Link } from "@tanstack/react-router";
import { useCompany } from "@/lib/company";
import { useState } from "react";
import { computeCommission, fmt, ledger, pharmacies, summaries } from "@/lib/demo-data";
import { Card, EmptyState, Field, Stat, btnCls, inputCls } from "@/components/app/states";

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
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [result, setResult] = useState<{ collected: number; commission: number } | null>(null);
  const ids = new Set(list.map((p) => p.id));
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">كشف حساب {company.name}</h1>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="إجمالي المفوتر" value={fmt(s.totalInvoiced)} tone="up" />
        <Stat label="إجمالي المجبي" value={fmt(s.totalCollected)} tone="down" />
        <Stat label="المتبقي خارجاً" value={fmt(s.outstanding)} />
      </div>
      {company.hasCommission && (
        <Card className="space-y-3 border-primary/40">
          <h2 className="font-semibold">عمولة الجباية (5% من المحصّل)</h2>
          <div className="grid gap-3 sm:grid-cols-3 sm:items-end">
            <Field label="من تاريخ"><input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setResult(null); }} className={inputCls} /></Field>
            <Field label="إلى تاريخ"><input type="date" value={to} onChange={(e) => { setTo(e.target.value); setResult(null); }} className={inputCls} /></Field>
            <button type="button" className={btnCls} onClick={() => setResult(computeCommission(ledger.filter((e) => ids.has(e.pharmacyId)), from || undefined, to || undefined))}>احسب العمولة</button>
          </div>
          {result && (
            <div className="rounded-md bg-muted p-3 text-sm">
              المحصّل في الفترة: <b>{fmt(result.collected)}</b> — العمولة: <b className="text-lg text-primary">{fmt(result.commission)}</b>
            </div>
          )}
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
