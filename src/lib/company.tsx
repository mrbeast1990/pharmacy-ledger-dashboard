import { createContext, useContext, useState, type ReactNode } from "react";
import { companies, type CompanyId } from "./demo-data";

const Ctx = createContext<{ companyId: CompanyId; setCompanyId: (c: CompanyId) => void } | null>(null);
export function CompanyProvider({ children }: { children: ReactNode }) {
  const [companyId, setCompanyId] = useState<CompanyId>("delta");
  return <Ctx.Provider value={{ companyId, setCompanyId }}>{children}</Ctx.Provider>;
}
export function useCompany() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCompany outside provider");
  return { ...c, company: companies[c.companyId] };
}
