import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { useCompany } from "@/lib/company";
import { demoSubmit, fmt, pharmacies, type Pharmacy } from "@/lib/demo-data";
import { Dashboard } from "@/components/app/Dashboard";
import { Card, EmptyState, StatusBanner, StatusPill, btnCls, inputCls, type AccountStatus, type SubmitStatus } from "@/components/app/states";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({ meta: [
    { title: "الرئيسية — دفتر دلتا ويافا" },
    { name: "description", content: "ملخص الفواتير والسدادات وحسابات الصيدليات للشركة المختارة." },
    { property: "og:title", content: "الرئيسية — دفتر دلتا ويافا" },
    { property: "og:description", content: "ملخص الفواتير والسدادات وحسابات الصيدليات." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Pharmacies,
});

function statusFor(pharmacy: Pharmacy): AccountStatus {
  if (pharmacy.remaining <= 0) return "paid";
  return pharmacy.totalPaid > 0 ? "partial" : "remaining";
}

function Pharmacies() {
  const { companyId, company } = useCompany();
  const list = pharmacies.filter((p) => p.companyId === companyId);
  const [status, setStatus] = useState<SubmitStatus>({ state: "idle" });

  async function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ state: "pending" });
    try { await demoSubmit(); setStatus({ state: "success", message: "تمت إضافة الحساب." }); }
    catch (err) { setStatus({ state: "error", message: (err as Error).message }); }
  }

  return (
    <div className="space-y-8">
      <Dashboard />

      <section aria-labelledby="pharmacy-accounts" className="space-y-5">
        <div>
          <p className="text-sm font-semibold text-primary">الحسابات</p>
          <h2 id="pharmacy-accounts" className="mt-1 text-2xl font-extrabold">حسابات صيدليات {company.name}</h2>
          <p className="mt-2 text-sm text-muted-foreground">كل حساب مستقل بالكامل داخل شركته.</p>
        </div>

        <Card>
          <form onSubmit={add} className="flex flex-wrap items-end gap-3" key={companyId}>
            <label className="min-w-56 flex-1 space-y-2">
              <span className="text-sm font-bold">إضافة حساب صيدلية — اسم الصيدلية</span>
              <input name="name" required className={inputCls} placeholder="مثال: صيدلية الشفاء" />
            </label>
            <button className={btnCls} disabled={status.state === "pending"}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              {status.state === "pending" ? "جارٍ الإضافة…" : "إضافة"}
            </button>
          </form>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">الاسم نفسه في الشركتين حسابان منفصلان، ولا يُدمج رصيدهما.</p>
          <div className="mt-4"><StatusBanner status={status} /></div>
        </Card>

        {list.length === 0 ? <EmptyState title="لا توجد حسابات صيدليات بعد" hint="أضف أول صيدلية باسمها لتظهر هنا." /> : (
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-sm">
                <thead className="bg-muted/70 text-xs text-muted-foreground">
                  <tr>
                    <th className="p-4 text-start font-bold">الصيدلية</th>
                    <th className="p-4 text-start font-bold">المفوتر</th>
                    <th className="p-4 text-start font-bold">المسدد</th>
                    <th className="p-4 text-start font-bold">المتبقي</th>
                    <th className="p-4 text-start font-bold">الحالة</th>
                  </tr>
                </thead>
                <tbody>{list.map((p) => {
                  const accountStatus = statusFor(p);
                  return (
                    <tr key={p.id} className="border-t border-border/70 transition hover:bg-muted/45">
                      <td className="p-4"><Link to="/pharmacies/$id" params={{ id: p.id }} className="font-bold text-foreground underline-offset-4 hover:text-primary hover:underline">{p.name}</Link></td>
                      <td className="p-4 font-semibold tabular-nums">{fmt(p.totalInvoiced)}</td>
                      <td className="p-4 font-semibold tabular-nums">{fmt(p.totalPaid)}</td>
                      <td className="p-4 font-extrabold tabular-nums text-debt">{fmt(p.remaining)}</td>
                      <td className="p-4"><StatusPill status={accountStatus}>{accountStatus === "paid" ? "مدفوع" : accountStatus === "partial" ? "جزئي" : "متبقي"}</StatusPill></td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
          </Card>
        )}
      </section>
    </div>
  );
}
