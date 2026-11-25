import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useCompany } from "@/lib/company";
import type { CompanySettings } from "@/lib/demo-data";
import { Card, Field, btnCls, inputCls } from "@/components/app/states";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [
    { title: "إعدادات الشركة" }, { name: "description", content: "شعار الشركة واسمها وعنوانها وهاتفها وملاحظات الفاتورة." },
    { property: "og:title", content: "إعدادات الشركة" }, { property: "og:description", content: "إعدادات منفصلة لكل شركة." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Settings,
});

function Settings() {
  const { companyId, settings } = useCompany();
  return <div className="space-y-4"><h1 className="text-2xl font-bold">الإعدادات</h1><SettingsForm key={companyId} initial={settings[companyId]} /></div>;
}

function SettingsForm({ initial }: { initial: CompanySettings }) {
  const { companyId, saveSettings } = useCompany();
  const [s, setS] = useState(initial);
  const [saved, setSaved] = useState(false);
  const set = (k: keyof CompanySettings, v: string | null) => { setS({ ...s, [k]: v }); setSaved(false); };
  function onLogo(f?: File) {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => set("logoUrl", String(r.result));
    r.readAsDataURL(f);
  }
  function submit(e: FormEvent) { e.preventDefault(); saveSettings(companyId, s); setSaved(true); }
  return (
    <Card className="max-w-xl">
      <form onSubmit={submit} className="space-y-4">
        <Field label="شعار الشركة">
          <div className="flex items-center gap-3">
            {s.logoUrl && <img src={s.logoUrl} alt="الشعار" className="h-14 w-14 rounded border object-contain" />}
            <input type="file" accept="image/*" onChange={(e) => onLogo(e.target.files?.[0])} className={inputCls} />
          </div>
        </Field>
        {s.logoUrl && <button type="button" className="text-xs text-destructive" onClick={() => set("logoUrl", null)}>إزالة الشعار</button>}
        <Field label="اسم الشركة"><input value={s.name} onChange={(e) => set("name", e.target.value)} required className={inputCls} /></Field>
        <Field label="العنوان"><input value={s.address} onChange={(e) => set("address", e.target.value)} className={inputCls} /></Field>
        <Field label="الهاتف"><input value={s.phone} onChange={(e) => set("phone", e.target.value)} type="tel" className={inputCls} /></Field>
        <Field label="ملاحظات الفاتورة"><textarea value={s.invoiceNotes} onChange={(e) => set("invoiceNotes", e.target.value)} rows={3} className={inputCls} /></Field>
        {saved && <div role="status" className="rounded-md border border-success bg-success/10 px-4 py-3 text-sm text-success">تم حفظ الإعدادات.</div>}
        <button className={btnCls}>حفظ الإعدادات</button>
      </form>
    </Card>
  );
}
