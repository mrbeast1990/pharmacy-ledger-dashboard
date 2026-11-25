import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
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
      throw redirect({
        to: "/auth",
        search: {
          ...(search.redirect ? { redirect: search.redirect } : {}),
          reason: "unauthorized",
        },
      });
    }
  },
  head: () => ({
    meta: [
      { title: "تسجيل الدخول — حسابات الصيدليات" },
      { name: "description", content: "دخول المالك إلى حسابات صيدليات دلتا الشمال ويافا." },
      { property: "og:title", content: "تسجيل الدخول — حسابات الصيدليات" },
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
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <section className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm sm:p-8" aria-labelledby="login-title">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg border-2 border-dashed border-primary/50 text-[10px] text-muted-foreground">
            مكان الشعار
          </div>
          <p className="text-sm text-muted-foreground">دلتا الشمال ويافا</p>
          <h1 id="login-title" className="mt-1 text-2xl font-bold text-primary">حسابات الصيدليات</h1>
          <p className="mt-2 text-sm text-muted-foreground">سجّل الدخول للمتابعة إلى الحسابات</p>
        </div>

        {error && (
          <div role="alert" className="mb-5 rounded-md border border-destructive bg-destructive/10 px-4 py-3 text-center text-sm font-medium text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={signIn} className="space-y-5">
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">البريد الإلكتروني</span>
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
              className={`${inputCls} text-left`}
              placeholder="name@example.com"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium">كلمة السر</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              dir="ltr"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={`${inputCls} text-left`}
            />
          </label>
          <button type="submit" disabled={pending} className={`${btnCls} min-h-11 w-full`}>
            {pending ? "جارٍ تسجيل الدخول…" : "تسجيل الدخول"}
          </button>
        </form>
      </section>
    </main>
  );
}
