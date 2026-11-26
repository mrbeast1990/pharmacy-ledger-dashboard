import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import {
  ArrowLeftRight,
  BookOpenText,
  FilePlus2,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  Settings,
  WalletCards,
} from "lucide-react";
import { useCompany } from "@/lib/company";
import { supabase } from "@/integrations/supabase/client";
import { CompanyAvatar } from "./states";

const nav = [
  { to: "/", label: "الرئيسية", icon: LayoutDashboard, match: (path: string) => path === "/" || path.startsWith("/pharmacies/") },
  { to: "/invoices/new", label: "الفواتير", icon: FilePlus2, match: (path: string) => path.startsWith("/invoices/") },
  { to: "/payments/new", label: "السدادات", icon: WalletCards, match: (path: string) => path.startsWith("/payments/") },
  { to: "/statement", label: "كشف الحساب", icon: ReceiptText, match: (path: string) => path === "/statement" },
  { to: "/settings", label: "الإعدادات", icon: Settings, match: (path: string) => path === "/settings" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { company, companyId, setCompanyId } = useCompany();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [signingOut, setSigningOut] = useState(false);

  function switchCompany() {
    setCompanyId(companyId === "delta" ? "yafa" : "delta");
  }

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

  const companyCard = (compact = false) => (
    <button
      type="button"
      onClick={switchCompany}
      aria-label="التبديل بين دلتا الشمال ويافا"
      title="التبديل بين دلتا الشمال ويافا"
      className={`group flex w-full items-center rounded-2xl bg-accent text-accent-foreground transition hover:bg-primary/15 ${compact ? "justify-center p-2" : "gap-3 p-3 text-right"}`}
    >
      <CompanyAvatar name={company.name} logoUrl={company.logoUrl} className={compact ? "h-10 w-10 text-sm" : "h-11 w-11 text-sm"} />
      {!compact && (
        <>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold text-muted-foreground">الشركة الحالية</span>
            <span className="mt-0.5 block truncate text-sm font-extrabold">{company.name}</span>
          </span>
          <ArrowLeftRight className="h-4 w-4 shrink-0 transition group-hover:-translate-x-0.5" aria-hidden="true" />
        </>
      )}
    </button>
  );

  return (
    <div data-company={companyId} className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 right-0 z-40 hidden w-20 flex-col border-l border-border/80 bg-card px-3 py-4 shadow-card md:flex lg:w-64 lg:px-4 lg:py-6 print:hidden">
        <Link to="/" className="mb-6 flex items-center justify-center gap-3 lg:justify-start lg:px-2" aria-label="دفتر دلتا ويافا">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <BookOpenText className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="hidden text-lg font-extrabold tracking-tight lg:inline">دفتر دلتا ويافا</span>
        </Link>

        <div className="hidden lg:block">{companyCard()}</div>
        <div className="lg:hidden">{companyCard(true)}</div>

        <nav aria-label="التنقل الرئيسي" className="mt-7 flex flex-1 flex-col gap-1.5">
          {nav.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                title={item.label}
                className={`flex min-h-12 items-center justify-center gap-3 rounded-xl px-3 text-sm font-semibold transition lg:justify-start ${active ? "bg-accent font-bold text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border/70 pt-4">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            title="خروج"
            className="flex min-h-11 w-full items-center justify-center gap-3 rounded-xl px-3 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50 lg:justify-start"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            <span className="hidden lg:inline">{signingOut ? "جارٍ الخروج…" : "خروج"}</span>
          </button>
        </div>
      </aside>

      <header data-mobile-header className="sticky top-0 z-30 border-b border-border/80 bg-card/95 px-4 py-3 shadow-xs backdrop-blur md:hidden print:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 font-extrabold">
            <BookOpenText className="h-5 w-5 text-primary" aria-hidden="true" />
            <span>دفتر دلتا ويافا</span>
          </Link>
          <div className="flex items-center gap-2">
            <button type="button" onClick={switchCompany} aria-label="التبديل بين دلتا الشمال ويافا" className="rounded-full transition hover:opacity-80">
              <CompanyAvatar name={company.name} logoUrl={company.logoUrl} className="h-9 w-9 text-xs" />
            </button>
            <button type="button" onClick={handleSignOut} disabled={signingOut} aria-label="خروج" className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground">
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div className="md:pr-20 lg:pr-64 print:pr-0">
        <main className="mx-auto w-full max-w-[1440px] px-4 pb-28 pt-6 sm:px-6 md:pb-10 md:pt-8 xl:px-8 print:max-w-none print:p-0">
          {children}
        </main>
      </div>

      <nav aria-label="التنقل الرئيسي للجوال" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 gap-1 border-t border-border/80 bg-card/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-card backdrop-blur md:hidden print:hidden">
        {nav.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-bold transition ${active ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
