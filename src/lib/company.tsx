import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { companies, type CompanyId, type CompanySettings } from "./demo-data";

const defaults = (): Record<CompanyId, CompanySettings> => ({
  delta: { name: companies.delta.name, address: "", phone: "", invoiceNotes: "", logoUrl: null },
  yafa: { name: companies.yafa.name, address: "", phone: "", invoiceNotes: "", logoUrl: null },
});
const KEY = "company-settings";
type CtxT = {
  companyId: CompanyId; setCompanyId: (c: CompanyId) => void;
  settings: Record<CompanyId, CompanySettings>; saveSettings: (id: CompanyId, s: CompanySettings) => void;
};
const Ctx = createContext<CtxT | null>(null);
/** الإعدادات تُحفظ محلياً في المتصفح في نسخة العرض. Codex: استبدلها بخدمة حقيقية. */
export function CompanyProvider({ children }: { children: ReactNode }) {
  const [companyId, setCompanyId] = useState<CompanyId>("delta");
  const [settings, setSettings] = useState(defaults);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setSettings({ ...defaults(), ...JSON.parse(raw) }); } catch { /* ignore */ }
  }, []);
  const saveSettings = (id: CompanyId, s: CompanySettings) => {
    const next = { ...settings, [id]: s };
    localStorage.setItem(KEY, JSON.stringify(next));
    setSettings(next);
  };
  return <Ctx.Provider value={{ companyId, setCompanyId, settings, saveSettings }}>{children}</Ctx.Provider>;
}
export function useCompany() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCompany outside provider");
  const st = c.settings[c.companyId];
  return { ...c, company: { ...companies[c.companyId], name: st.name || companies[c.companyId].name, logoUrl: st.logoUrl } };
}
