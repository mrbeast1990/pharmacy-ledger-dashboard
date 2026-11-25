import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { useCompany } from "@/lib/company";
import { companies, type CompanyId } from "@/lib/demo-data";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/", label: "حسابات الصيدليات" },
  { to: "/invoices/new", label: "تسجيل فاتورة" },
  { to: "/payments/new", label: "تسجيل سداد" },
  { to: "/statement", label: "كشف الحساب" },
  { to: "/settings", label: "الإعدادات" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { company, companyId, setCompanyId, settings } = useCompany();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await queryClient.cancelQueries();
      queryClient.clear();
      await supabase.auth.signOut();
      await navigate({ to: "/auth", replace: true });
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <div data-company={companyId} className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={company.name} className="h-12 w-12 object-contain" />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-md border-2 border-dashed border-primary/50 text-[10px] text-muted-foreground">
                مكان الشعار
              </div>
            )}
            <div>
              <div className="text-xs text-muted-foreground">الشركة الحالية</div>
              <div className="text-xl font-bold text-primary">{company.name}</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div role="radiogroup" aria-label="اختيار الشركة" className="flex rounded-full border bg-muted p-1">
              {(Object.keys(companies) as CompanyId[]).map((id) => (
                <button
                  key={id}
                  role="radio"
                  aria-checked={id === companyId}
                  onClick={() => setCompanyId(id)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${id === companyId ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  {settings[id].name || companies[id].name}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="min-h-9 rounded-md border border-input px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
            >
              {signingOut ? "جارٍ الخروج…" : "خروج"}
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }}
              className="whitespace-nowrap border-b-2 border-transparent px-3 py-2 text-sm text-muted-foreground"
              activeProps={{ className: "!border-primary !text-foreground font-semibold" }}>
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="bg-accent px-4 py-1.5 text-center text-xs text-accent-foreground">نسخة عرض ببيانات تجريبية — لا يُحفظ أي إدخال</div>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
