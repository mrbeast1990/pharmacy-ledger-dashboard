import { createFileRoute } from "@tanstack/react-router";
import { Save, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useCompany } from "@/lib/company";
import { companies, type CompanyId, type CompanySettings } from "@/lib/demo-data";
import { Card, CompanyAvatar, Field, FilePicker, btnCls, btnOutline, inputCls } from "@/components/app/states";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [
    { title: "إعدادات الشركات — دفتر دلتا ويافا" }, { name: "description", content: "شعار كل شركة واسمها وعنوانها وهاتفها وملاحظات الفاتورة." },
    { property: "og:title", content: "إعدادات الشركات" }, { property: "og:description", content: "إعدادات منفصلة لدلتا الشمال ويافا." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Settings,
});

function Settings() {
  const { settings } = useCompany();
  const ids = Object.keys(companies) as CompanyId[];
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-primary">التخصيص</p>
        <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">إعدادات الشركات</h1>
        <p className="mt-2 text-sm text-muted-foreground">بطاقة مستقلة لكل شركة، مع معاينة فورية للشعار.</p>
      </div>
      <div className="grid items-start gap-5 xl:grid-cols-2">
        {ids.map((id) => <SettingsForm key={id} companyId={id} initial={settings[id]} />)}
      </div>
    </div>
  );
}

function SettingsForm({ companyId, initial }: { companyId: CompanyId; initial: CompanySettings }) {
  const { saveSettings } = useCompany();
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
    <section data-company={companyId}>
      <Card>
        <form onSubmit={submit} className="space-y-5">
          <div className="flex items-center gap-4 border-b border-border/70 pb-5">
            <CompanyAvatar name={s.name || companies[companyId].name} logoUrl={s.logoUrl} className="h-16 w-16 text-lg" />
            <div>
              <h2 className="text-lg font-extrabold text-primary">{companies[companyId].name}</h2>
              <p className="mt-1 text-xs text-muted-foreground">إعدادات وشعار منفصلان لهذه الشركة</p>
            </div>
          </div>

          <Field label="شعار الشركة" note="تظهر المعاينة فور اختيار الصورة.">
            <div className="flex flex-wrap items-center gap-3">
              <FilePicker accept="image/*" onChange={onLogo} />
              {s.logoUrl && <button type="button" className={btnOutline} onClick={() => set("logoUrl", null)}><Trash2 className="h-4 w-4" aria-hidden="true" />إزالة الشعار</button>}
            </div>
          </Field>
          <Field label="اسم الشركة"><input value={s.name} onChange={(e) => set("name", e.target.value)} required className={inputCls} /></Field>
          <Field label="العنوان"><input value={s.address} onChange={(e) => set("address", e.target.value)} className={inputCls} /></Field>
          <Field label="الهاتف"><input value={s.phone} onChange={(e) => set("phone", e.target.value)} type="tel" dir="ltr" className={`${inputCls} text-left tabular-nums`} /></Field>
          <Field label="ملاحظات الفاتورة"><textarea value={s.invoiceNotes} onChange={(e) => set("invoiceNotes", e.target.value)} rows={4} className={inputCls} /></Field>
          {saved && <div role="status" className="rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm font-semibold text-success">تم حفظ الإعدادات.</div>}
          <button className={btnCls}><Save className="h-4 w-4" aria-hidden="true" />حفظ الإعدادات</button>
        </form>
      </Card>
    </section>
  );
}
