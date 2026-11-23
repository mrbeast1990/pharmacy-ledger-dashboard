import { useEffect, useState, type FormEvent } from "react";
import { useCompany } from "@/lib/company";
import { demoSubmit, pharmacies } from "@/lib/demo-data";
import { Card, Field, StatusBanner, btnCls, inputCls, type SubmitStatus } from "./states";

/** نموذج موحّد للفاتورة والسداد. Codex: مرّر onSubmit حقيقياً بدل demoSubmit. */
export function EntryForm({ kind, initialPharmacyId, onSubmit = demoSubmit }: {
  kind: "invoice" | "payment"; initialPharmacyId?: string; onSubmit?: (data: FormData) => Promise<unknown>;
}) {
  const { companyId, company } = useCompany();
  const list = pharmacies.filter((p) => p.companyId === companyId);
  const [status, setStatus] = useState<SubmitStatus>({ state: "idle" });
  const isInv = kind === "invoice";
  const [entryDate, setEntryDate] = useState("");
  useEffect(() => { setEntryDate(new Date().toISOString().slice(0, 10)); }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("companyId", companyId);
    setStatus({ state: "pending" });
    try {
      await onSubmit(fd);
      setStatus({ state: "success", message: isInv ? "تم حفظ الفاتورة وظهرت في حساب الصيدلية." : "تم حفظ السداد وخُصم من حساب الصيدلية." });
      e.currentTarget?.reset();
    } catch (err) {
      setStatus({ state: "error", message: err instanceof Error ? err.message : "تعذّر الحفظ." });
    }
  }

  if (!list.length) return <Card>لا توجد حسابات صيدليات في {company.name} بعد. أضف حساباً أولاً.</Card>;
  const pending = status.state === "pending";
  return (
    <Card className="max-w-xl">
      <form onSubmit={submit} className="space-y-4" key={companyId}>
        <p className="text-sm text-muted-foreground">الشركة: <b className="text-foreground">{company.name}</b></p>
        {isInv && <Field label="رقم الفاتورة"><input name="invoiceNumber" required className={inputCls} /></Field>}
        <Field label="الصيدلية">
          <select name="pharmacyId" required defaultValue={initialPharmacyId ?? ""} className={inputCls}>
            <option value="" disabled>اختر الصيدلية</option>
            {list.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </Field>
        <Field label={isInv ? "قيمة الفاتورة" : "قيمة السداد"} note={isInv ? "تزيد المطلوب من الصيدلية." : "تُخصم من حساب الصيدلية مباشرة، دون ربط بفاتورة محددة."}>
          <input name="amount" type="number" min="0.01" step="0.01" required className={inputCls} />
        </Field>
        <Field label={isInv ? "صورة الفاتورة الأصلية أو الملف المصمم" : "صورة قسيمة السداد"} note="صورة أو PDF، مرجع فقط.">
          <input name="attachment" type="file" accept="image/*,application/pdf" className={inputCls} />
        </Field>
        <Field label={isInv ? "تاريخ المستند (تاريخ الفاتورة)" : "تاريخ المستند (تاريخ القسيمة)"}>
          <input name="documentDate" type="date" required className={inputCls} />
        </Field>
        <Field label="تاريخ الإدخال" note="يُسجَّل تلقائياً.">
          <input name="entryDate" type="date" value={entryDate} readOnly className={`${inputCls} bg-muted`} />
        </Field>
        {!isInv && <Field label="رقم القسيمة (اختياري)" note="ليس متطلباً مؤكداً."><input name="receiptNumber" className={inputCls} /></Field>}
        <StatusBanner status={status} />
        <button disabled={pending} className={btnCls}>{pending ? "جارٍ الحفظ…" : isInv ? "حفظ الفاتورة" : "حفظ السداد"}</button>
      </form>
    </Card>
  );
}
