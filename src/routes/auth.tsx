import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { BookOpenText, LockKeyhole, LogIn, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkOwnerAccess } from "@/lib/auth-access";
import { btnCls, inputCls } from "@/components/app/states";

type AuthSearch = { redirect?: string; reason?: "unauthorized" };

function validRedirect(value: unknown): string | undefined {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//")
    ? value
    : undefined;
}

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): AuthSearch => {
    const destination = validRedirect(search["redirect"]);
    return {
      ...(destination ? { redirect: destination } : {}),
      ...(search["reason"] === "unauthorized" ? { reason: "unauthorized" as const } : {}),
    };
  },
  beforeLoad: async ({ search }) => {
    const access = await checkOwnerAccess();
    if (access === "authorized") {
      throw redirect({ href: search.redirect ?? "/" });
    }
    if (access === "unauthorized") {
      await supabase.auth.signOut();
      if (search.reason !== "unauthorized") {
        throw redirect({
          to: "/auth",
          search: {
            ...(search.redirect ? { redirect: search.redirect } : {}),
            reason: "unauthorized",
          },
        });
      }
    }
  },
  head: () => ({
    meta: [
      { title: "تسجيل الدخول — دفتر دلتا ويافا" },
      { name: "description", content: "دخول المالك إلى حسابات صيدليات دلتا الشمال ويافا." },
      { property: "og:title", content: "تسجيل الدخول — دفتر دلتا ويافا" },
      { property: "og:description", content: "الدخول بالبريد الإلكتروني وكلمة السر." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(
    search.reason === "unauthorized" ? "غير مصرّح" : null,
  );

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError("تعذّر تسجيل الدخول. تحقق من البريد الإلكتروني وكلمة السر.");
        return;
      }

      const access = await checkOwnerAccess();
      if (access === "unauthorized") {
        await supabase.auth.signOut();
        setError("غير مصرّح");
        return;
      }
      if (access !== "authorized") {
        setError("تعذّر التحقق من الجلسة. حاول مرة أخرى.");
        return;
      }

      await navigate({ href: search.redirect ?? "/", replace: true });
    } catch {
      setError("تعذّر الاتصال. تحقق من الإنترنت وحاول مرة أخرى.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main data-company="delta" className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10 text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-primary" />
      <section className="w-full max-w-md rounded-2xl border border-border/70 bg-card p-6 shadow-card sm:p-9" aria-labelledby="login-title">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-card">
            <BookOpenText className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 id="login-title" className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">دفتر دلتا ويافا</h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">سجّل الدخول للمتابعة إلى حسابات الصيدليات</p>
        </div>

        {error && (
          <div role="alert" className="mb-5 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-center text-sm font-bold text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={signIn} className="space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-bold">البريد الإلكتروني</span>
            <span className="relative block">
              <input
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                dir="ltr"
                required
                autoFocus
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={`${inputCls} pl-10 text-left`}
                placeholder="name@example.com"
              />
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            </span>
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-bold">كلمة السر</span>
            <span className="relative block">
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                dir="ltr"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={`${inputCls} pl-10 text-left`}
              />
              <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            </span>
          </label>
          <button type="submit" disabled={pending} className={`${btnCls} min-h-12 w-full`}>
            <LogIn className="h-4 w-4" aria-hidden="true" />
            {pending ? "جارٍ تسجيل الدخول…" : "تسجيل الدخول"}
          </button>
        </form>
        <p className="mt-7 border-t border-border/70 pt-5 text-center text-xs text-muted-foreground">حسابات دلتا الشمال ويافا في دفتر واحد</p>
      </section>
    </main>
  );
}
