import { useEffect, useState, type FormEvent } from "react";
import { Building2, Save } from "lucide-react";
import { useCompany } from "@/lib/company";
import { demoSubmit, pharmacies } from "@/lib/demo-data";
import { DateField } from "./DateField";
import { Card, EmptyState, Field, FilePicker, StatusBanner, btnCls, inputCls, type SubmitStatus } from "./states";

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

  if (!list.length) return <EmptyState title={`لا توجد حسابات صيدليات في ${company.name} بعد`} hint="أضف حساباً من الصفحة الرئيسية أولاً." />;
  const pending = status.state === "pending";
  return (
    <Card className="max-w-2xl">
      <form onSubmit={submit} className="space-y-5" key={companyId}>
        <div className="flex items-center gap-3 rounded-xl bg-muted/70 p-3.5">
          <Building2 className="h-5 w-5 text-primary" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">الشركة: <b className="font-extrabold text-foreground">{company.name}</b></p>
        </div>
        {isInv && <Field label="رقم الفاتورة"><input name="invoiceNumber" required className={`${inputCls} tabular-nums`} /></Field>}
        <Field label="الصيدلية">
          <select name="pharmacyId" required defaultValue={initialPharmacyId ?? ""} className={inputCls}>
            <option value="" disabled>اختر الصيدلية</option>
            {list.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </Field>
        <Field label={isInv ? "قيمة الفاتورة" : "قيمة السداد"} note={isInv ? "تزيد المطلوب من الصيدلية." : "تُخصم من حساب الصيدلية مباشرة، دون ربط بفاتورة محددة."}>
          <input name="amount" type="number" min="0.01" step="0.01" required dir="ltr" className={`${inputCls} text-left tabular-nums`} />
        </Field>
        <Field label={isInv ? "صورة الفاتورة الأصلية أو الملف المصمم" : "صورة قسيمة السداد"} note="صورة أو PDF، مرجع فقط.">
          <FilePicker name="attachment" accept="image/*,application/pdf" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={isInv ? "تاريخ المستند (تاريخ الفاتورة)" : "تاريخ المستند (تاريخ القسيمة)"}>
            <DateField name="documentDate" required />
          </Field>
          <Field label="تاريخ الإدخال" note="يُسجَّل تلقائياً.">
            <DateField name="entryDate" value={entryDate} readOnly />
          </Field>
        </div>
        {!isInv && <Field label="رقم القسيمة (اختياري)" note="ليس متطلباً مؤكداً."><input name="receiptNumber" className={inputCls} /></Field>}
        <StatusBanner status={status} />
        <button disabled={pending} className={`${btnCls} w-full sm:w-auto`}>
          <Save className="h-4 w-4" aria-hidden="true" />
          {pending ? "جارٍ الحفظ…" : isInv ? "حفظ الفاتورة" : "حفظ السداد"}
        </button>
      </form>
    </Card>
  );
}
