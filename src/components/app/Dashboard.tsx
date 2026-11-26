import { Link } from "@tanstack/react-router";
import { ArrowLeft, FileText, Plus, Receipt, TrendingUp, WalletCards } from "lucide-react";
import { useCompany } from "@/lib/company";
import { fmt, ledger, pharmacies, summaries, type Pharmacy } from "@/lib/demo-data";
import { formatDate } from "@/lib/format";
import { Card, StatusPill, btnCls, btnOutline, type AccountStatus } from "./states";

const monthNames: Record<string, string> = {
  "01": "يناير", "02": "فبراير", "03": "مارس", "04": "أبريل",
  "05": "مايو", "06": "يونيو", "07": "يوليو", "08": "أغسطس",
  "09": "سبتمبر", "10": "أكتوبر", "11": "نوفمبر", "12": "ديسمبر",
};

function accountStatus(pharmacy: Pharmacy): AccountStatus {
  if (pharmacy.remaining <= 0) return "paid";
  return pharmacy.totalPaid > 0 ? "partial" : "remaining";
}

function statusLabel(status: AccountStatus) {
  return status === "paid" ? "مدفوع" : status === "partial" ? "جزئي" : "متبقي";
}

export function Dashboard() {
  const { companyId, company } = useCompany();
  const summary = summaries[companyId];
  const companyPharmacies = pharmacies.filter((pharmacy) => pharmacy.companyId === companyId);
  const pharmacyIds = new Set(companyPharmacies.map((pharmacy) => pharmacy.id));
  const entries = ledger.filter((entry) => pharmacyIds.has(entry.pharmacyId));
  const invoiceCount = entries.filter((entry) => entry.kind === "invoice").length;

  const monthlyMap = new Map<string, { invoiced: number; collected: number }>();
  for (const entry of entries) {
    if (!entry.date) continue;
    const key = entry.date.slice(0, 7);
    const month = monthlyMap.get(key) ?? { invoiced: 0, collected: 0 };
    if (entry.kind === "invoice") month.invoiced += entry.amount;
    else month.collected += entry.amount;
    monthlyMap.set(key, month);
  }
  const monthly = [...monthlyMap.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, values]) => {
    const [year = "", month = ""] = key.split("-");
    return { key, label: `${monthNames[month] ?? month} ${year}`, ...values };
  });
  const chartMax = Math.max(1, ...monthly.flatMap((month) => [month.invoiced, month.collected]));

  const topPharmacies = [...companyPharmacies].sort((a, b) => b.remaining - a.remaining).slice(0, 4);
  const maxOutstanding = Math.max(1, ...topPharmacies.map((pharmacy) => pharmacy.remaining));
  const recent = [...entries].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? "")).slice(0, 5);

  const kpis = [
    { label: "إجمالي المفوتر", value: fmt(summary.totalInvoiced), icon: FileText, debt: false },
    { label: "إجمالي المحصل", value: fmt(summary.totalCollected), icon: WalletCards, debt: false },
    { label: "المتبقي", value: fmt(summary.outstanding), icon: TrendingUp, debt: true },
    { label: "عدد الفواتير", value: invoiceCount.toLocaleString("en-US"), icon: Receipt, debt: false },
  ];

  return (
    <section aria-label="لوحة الملخص" className="space-y-5">
      <Card className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <p className="text-sm font-semibold text-muted-foreground">مرحباً بك في دفتر {company.name}</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">نظرة واضحة على حساباتك</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">الفواتير والسدادات والأرصدة في مكان واحد.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/invoices/new" className={btnCls}><Plus className="h-4 w-4" aria-hidden="true" />فاتورة</Link>
          <Link to="/payments/new" className={btnOutline}><Plus className="h-4 w-4" aria-hidden="true" />سداد</Link>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-semibold text-muted-foreground sm:text-sm">{kpi.label}</p>
                <span className="hidden h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground sm:flex">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
              <p className={`mt-3 text-xl font-extrabold tabular-nums lining-nums sm:text-2xl xl:text-[1.7rem] ${kpi.debt ? "text-debt" : "text-foreground"}`}>{kpi.value}</p>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.45fr_1fr]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold">المفوتر مقابل المحصل</h2>
              <p className="mt-1 text-xs text-muted-foreground">مقارنة شهرية بحركات الشركة الحالية</p>
            </div>
            <div className="flex gap-4 text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-primary" />المفوتر</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />المحصل</span>
            </div>
          </div>
          {monthly.length ? (
            <div className="mt-7 flex h-56 items-end gap-4 border-b border-border px-2 sm:gap-8" role="img" aria-label="رسم شهري للمفوتر والمحصل">
              {monthly.map((month) => (
                <div key={month.key} className="flex h-full min-w-0 flex-1 flex-col justify-end">
                  <div className="flex flex-1 items-end justify-center gap-2 sm:gap-3">
                    <div
                      className="w-full max-w-10 rounded-t-lg bg-primary transition-opacity hover:opacity-80"
                      style={{ height: `${Math.max(3, (month.invoiced / chartMax) * 100)}%` }}
                      title={`المفوتر: ${fmt(month.invoiced)}`}
                    />
                    <div
                      className="w-full max-w-10 rounded-t-lg bg-foreground/20 transition-opacity hover:opacity-70"
                      style={{ height: `${Math.max(3, (month.collected / chartMax) * 100)}%` }}
                      title={`المحصل: ${fmt(month.collected)}`}
                    />
                  </div>
                  <p className="mt-3 truncate pb-3 text-center text-xs font-semibold text-muted-foreground">{month.label}</p>
                </div>
              ))}
            </div>
          ) : <p className="mt-8 rounded-xl bg-muted p-6 text-center text-sm text-muted-foreground">لا توجد حركات شهرية لعرضها.</p>}
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold">الأعلى في المتبقي</h2>
              <p className="mt-1 text-xs text-muted-foreground">حسب رصيد الصيدلية الحالي</p>
            </div>
            <Link to="/statement" className="text-xs font-bold text-primary hover:underline">كشف الحساب</Link>
          </div>
          <div className="mt-6 space-y-5">
            {topPharmacies.map((pharmacy) => (
              <div key={pharmacy.id}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <Link to="/pharmacies/$id" params={{ id: pharmacy.id }} className="truncate font-bold hover:text-primary">{pharmacy.name}</Link>
                  <span className="shrink-0 font-extrabold tabular-nums text-debt">{fmt(pharmacy.remaining)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(pharmacy.remaining / maxOutstanding) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/70 p-5 sm:px-6">
          <div>
            <h2 className="text-lg font-extrabold">النشاط الأخير</h2>
            <p className="mt-1 text-xs text-muted-foreground">أحدث الفواتير والسدادات</p>
          </div>
          <ArrowLeft className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        </div>
        <ul className="divide-y divide-border/70">
          {recent.map((entry) => {
            const pharmacy = companyPharmacies.find((item) => item.id === entry.pharmacyId);
            const status = entry.kind === "payment" ? "paid" : pharmacy ? accountStatus(pharmacy) : "remaining";
            const Icon = entry.kind === "invoice" ? FileText : WalletCards;
            return (
              <li key={entry.id} className="flex flex-wrap items-center gap-3 p-4 transition hover:bg-muted/45 sm:flex-nowrap sm:px-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{pharmacy?.name ?? "صيدلية"}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {entry.kind === "invoice" ? (
                      <Link to="/invoices/$id" params={{ id: entry.id }} className="hover:text-primary hover:underline">{entry.reference}</Link>
                    ) : entry.reference}
                    <span className="mx-2">·</span>
                    <time className="tabular-nums">{formatDate(entry.date)}</time>
                  </p>
                </div>
                <p className="text-sm font-extrabold tabular-nums">{fmt(entry.amount)}</p>
                <StatusPill status={status}>{statusLabel(status)}</StatusPill>
              </li>
            );
          })}
        </ul>
      </Card>
    </section>
  );
}
