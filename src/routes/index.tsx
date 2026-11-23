import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useCompany } from "@/lib/company";
import { demoSubmit, fmt, pharmacies } from "@/lib/demo-data";
import { Card, EmptyState, StatusBanner, btnCls, inputCls, type SubmitStatus } from "@/components/app/states";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "حسابات الصيدليات — دلتا الشمال ويافا" },
    { name: "description", content: "قائمة حسابات الصيدليات للشركة المختارة ورصيد كل حساب." },
    { property: "og:title", content: "حسابات الصيدليات" },
    { property: "og:description", content: "قائمة حسابات الصيدليات للشركة المختارة." },
  ] }),
  component: Pharmacies,
});

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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">حسابات صيدليات {company.name}</h1>
      <Card>
        <form onSubmit={add} className="flex flex-wrap items-end gap-3" key={companyId}>
          <label className="flex-1 space-y-1.5"><span className="text-sm font-medium">إضافة حساب صيدلية — اسم الصيدلية</span>
            <input name="name" required className={inputCls} placeholder="مثال: صيدلية الشفاء" /></label>
          <button className={btnCls} disabled={status.state === "pending"}>{status.state === "pending" ? "جارٍ الإضافة…" : "إضافة"}</button>
        </form>
        <p className="mt-2 text-xs text-muted-foreground">الاسم نفسه في الشركتين حسابان منفصلان، ولا يُدمج رصيدهما.</p>
        <div className="mt-3"><StatusBanner status={status} /></div>
      </Card>
      {list.length === 0 ? <EmptyState title="لا توجد حسابات صيدليات بعد" hint="أضف أول صيدلية باسمها." /> : (
        <div className="overflow-hidden rounded-lg border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground"><tr>
              <th className="p-3 text-start">الصيدلية</th><th className="p-3 text-start">المفوتر</th><th className="p-3 text-start">المسدد</th><th className="p-3 text-start">المتبقي</th></tr></thead>
            <tbody>{list.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3"><Link to="/pharmacies/$id" params={{ id: p.id }} className="font-medium text-primary underline-offset-4 hover:underline">{p.name}</Link></td>
                <td className="p-3">{fmt(p.totalInvoiced)}</td><td className="p-3">{fmt(p.totalPaid)}</td><td className="p-3 font-bold">{fmt(p.remaining)}</td>
              </tr>))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
