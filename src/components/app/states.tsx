import { Inbox, Upload } from "lucide-react";
import type { ChangeEvent, ReactNode } from "react";

export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-8 text-center shadow-card sm:p-10">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Inbox className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className="font-bold text-foreground">{title}</p>
      {hint && <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{hint}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export type SubmitStatus =
  | { state: "idle" }
  | { state: "pending" }
  | { state: "error"; message: string }
  | { state: "success"; message: string };

export function StatusBanner({ status }: { status: SubmitStatus }) {
  if (status.state === "idle") return null;
  const cls = status.state === "error"
    ? "border-destructive/20 bg-destructive/10 text-destructive"
    : status.state === "success"
      ? "border-success/20 bg-success/10 text-success"
      : "border-border bg-muted text-muted-foreground";
  const text = status.state === "pending" ? "جارٍ الحفظ والرفع…" : status.message;
  return (
    <div role="status" className={`rounded-xl border px-4 py-3 text-sm leading-6 ${cls}`}>
      {text}{status.state === "error" && " المدخلات محفوظة في النموذج."}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-border/70 bg-card p-5 shadow-card sm:p-6 ${className}`}>{children}</div>;
}

export function Stat({ label, value, tone }: { label: string; value: string; tone?: "up" | "down" | "main" }) {
  const c = tone === "main" ? "text-debt" : "text-foreground";
  return (
    <Card className="p-5">
      <div className="text-xs font-semibold text-muted-foreground">{label}</div>
      <div className={`mt-2 text-2xl font-extrabold tabular-nums lining-nums sm:text-3xl ${c}`}>{value}</div>
    </Card>
  );
}

export type AccountStatus = "paid" | "partial" | "remaining";

export function StatusPill({ status, children }: { status: AccountStatus; children: ReactNode }) {
  const cls = status === "paid"
    ? "bg-success/10 text-success"
    : status === "partial"
      ? "bg-warning/10 text-warning"
      : "bg-debt/10 text-debt";
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${cls}`}>{children}</span>;
}

export const inputCls = "min-h-11 w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground shadow-xs outline-none transition placeholder:text-muted-foreground/70 hover:border-muted-foreground/40 focus:border-ring focus:ring-2 focus:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-60";
export const btnCls = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-xs transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring/25 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
export const btnOutline = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-bold text-foreground shadow-xs transition hover:border-primary/30 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring/20";

export function Field({ label, note, children }: { label: string; note?: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-bold text-foreground">{label}</span>
      {children}
      {note && <span className="block text-xs leading-5 text-muted-foreground">{note}</span>}
    </label>
  );
}

export function FilePicker({ name, accept, onChange }: {
  name?: string;
  accept: string;
  onChange?: (file: File | undefined) => void;
}) {
  function pick(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event.target.files?.[0]);
  }
  return (
    <label className={`${btnOutline} w-fit cursor-pointer focus-within:ring-2 focus-within:ring-ring/20`}>
      <Upload className="h-4 w-4" aria-hidden="true" />
      <span>اختر ملفًا</span>
      <input name={name} type="file" accept={accept} onChange={pick} className="sr-only" />
    </label>
  );
}

export function CompanyAvatar({ name, logoUrl, className = "h-11 w-11" }: {
  name: string;
  logoUrl?: string | null;
  className?: string;
}) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] ?? "").join("") || "د";
  return (
    <span className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-extrabold text-primary ${className}`}>
      {logoUrl ? <img src={logoUrl} alt={`شعار ${name}`} className="h-full w-full object-cover" /> : <span aria-label={`الأحرف الأولى من ${name}`}>{initials}</span>}
    </span>
  );
}
