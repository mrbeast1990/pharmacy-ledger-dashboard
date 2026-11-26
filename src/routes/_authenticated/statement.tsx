import { createFileRoute, Link } from "@tanstack/react-router";
import { Calculator, ChevronLeft } from "lucide-react";
import { useCompany } from "@/lib/company";
import { useState } from "react";
import { computeCommission, fmt, ledger, pharmacies, summaries, type Pharmacy } from "@/lib/demo-data";
import { DateField } from "@/components/app/DateField";
import { Card, EmptyState, Field, Stat, StatusPill, btnCls, type AccountStatus } from "@/components/app/states";

export const Route = createFileRoute("/_authenticated/statement")({
  head: () => ({ meta: [
    { title: "كشف الحساب — دفتر دلتا ويافا" }, { name: "description", content: "المفوتر والمحصل والمتبقي للشركة المختارة وكشف كل صيدلية." },
    { property: "og:title", content: "كشف الحساب" }, { property: "og:description", content: "ملخص المفوتر والمحصل والمتبقي." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Statement,
});

function statusFor(pharmacy: Pharmacy): AccountStatus {
  if (pharmacy.remaining <= 0) return "paid";
  return pharmacy.totalPaid > 0 ? "partial" : "remaining";
}

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
      <div>
        <p className="text-sm font-semibold text-primary">التقارير</p>
        <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">كشف حساب {company.name}</h1>
        <p className="mt-2 text-sm text-muted-foreground">ملخص مالي وكشف مستقل لكل صيدلية.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="إجمالي المفوتر" value={fmt(s.totalInvoiced)} tone="up" />
        <Stat label="إجمالي المحصل" value={fmt(s.totalCollected)} tone="down" />
        <Stat label="المتبقي خارجاً" value={fmt(s.outstanding)} tone="main" />
      </div>

      {company.hasCommission && (
        <Card className="print-card space-y-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Calculator className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-extrabold">عمولة الجباية</h2>
              <p className="mt-1 text-sm text-muted-foreground">5% من المبلغ المحصل خلال الفترة المختارة، عند الطلب فقط.</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
            <Field label="من تاريخ"><DateField value={from} onChange={(value) => { setFrom(value); setResult(null); }} /></Field>
            <Field label="إلى تاريخ"><DateField value={to} onChange={(value) => { setTo(value); setResult(null); }} /></Field>
            <button type="button" className={`${btnCls} print:hidden`} onClick={() => setResult(computeCommission(ledger.filter((e) => ids.has(e.pharmacyId)), from || undefined, to || undefined))}>
              <Calculator className="h-4 w-4" aria-hidden="true" />احسب العمولة
            </button>
          </div>
          {result && (
            <div className="rounded-xl border border-border/70 bg-muted/70 p-4 text-sm leading-7">
              المحصل في الفترة: <b className="tabular-nums">{fmt(result.collected)}</b>
              <span className="mx-2 text-border">|</span>
              العمولة: <b className="text-lg font-extrabold tabular-nums text-primary">{fmt(result.commission)}</b>
            </div>
          )}
        </Card>
      )}

      <section aria-labelledby="pharmacy-statements" className="space-y-4">
        <div>
          <h2 id="pharmacy-statements" className="text-xl font-extrabold">كشف على مستوى الصيدلية</h2>
          <p className="mt-1 text-sm text-muted-foreground">افتح الدفتر لعرض الحركات والمراجع.</p>
        </div>
        {list.length === 0 ? <EmptyState title="لا توجد صيدليات لعرض كشفها" hint="أضف حساب صيدلية من الصفحة الرئيسية أولاً." /> : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{list.map((p) => {
            const status = statusFor(p);
            return (
              <Link key={p.id} to="/pharmacies/$id" params={{ id: p.id }} className="print-card group rounded-2xl border border-border/70 bg-card p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary/30">
                <div className="flex items-start justify-between gap-3">
                  <div className="font-extrabold group-hover:text-primary">{p.name}</div>
                  <StatusPill status={status}>{status === "paid" ? "مدفوع" : status === "partial" ? "جزئي" : "متبقي"}</StatusPill>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <span>مفوتر<br /><b className="mt-1 block text-sm text-foreground tabular-nums">{fmt(p.totalInvoiced)}</b></span>
                  <span>مسدد<br /><b className="mt-1 block text-sm text-foreground tabular-nums">{fmt(p.totalPaid)}</b></span>
                  <span>متبقي<br /><b className="mt-1 block text-sm text-debt tabular-nums">{fmt(p.remaining)}</b></span>
                </div>
                <div className="mt-5 flex items-center gap-1 border-t border-border/70 pt-3 text-xs font-bold text-primary">
                  عرض الدفتر<ChevronLeft className="h-4 w-4 transition group-hover:-translate-x-1" aria-hidden="true" />
                </div>
              </Link>
            );
          })}</div>
        )}
      </section>
    </div>
  );
}
