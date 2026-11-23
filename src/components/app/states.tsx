import type { ReactNode } from "react";
export function EmptyState({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed p-10 text-center">
      <p className="font-semibold">{title}</p>
      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
export type SubmitStatus = { state: "idle" } | { state: "pending" } | { state: "error"; message: string } | { state: "success"; message: string };
export function StatusBanner({ status }: { status: SubmitStatus }) {
  if (status.state === "idle") return null;
  const cls = status.state === "error" ? "border-destructive bg-destructive/10 text-destructive"
    : status.state === "success" ? "border-success bg-success/10 text-success" : "border-border bg-muted text-muted-foreground";
  const text = status.state === "pending" ? "جارٍ الحفظ والرفع…" : status.message;
  return <div role="status" className={`rounded-md border px-4 py-3 text-sm ${cls}`}>{text}{status.state === "error" && " المدخلات محفوظة في النموذج."}</div>;
}
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border bg-card p-5 ${className}`}>{children}</div>;
}
export function Stat({ label, value, tone }: { label: string; value: string; tone?: "up" | "down" | "main" }) {
  const c = tone === "up" ? "text-debit" : tone === "down" ? "text-success" : "text-primary";
  return <Card><div className="text-xs text-muted-foreground">{label}</div><div className={`mt-1 text-2xl font-bold ${c}`}>{value}</div></Card>;
}
export const inputCls = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
export const btnCls = "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50";
export const btnOutline = "inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm";
export function Field({ label, note, children }: { label: string; note?: string; children: ReactNode }) {
  return <label className="block space-y-1.5"><span className="text-sm font-medium">{label}</span>{children}{note && <span className="block text-xs text-muted-foreground">{note}</span>}</label>;
}
