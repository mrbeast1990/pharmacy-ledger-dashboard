import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Paperclip } from "lucide-react";
import { useCompany } from "@/lib/company";
import { fmt, ledger, pharmacies } from "@/lib/demo-data";
import { formatDate } from "@/lib/format";
import { Card, EmptyState, FilePicker, btnOutline } from "@/components/app/states";

export const Route = createFileRoute("/_authenticated/invoices/$id")({
  head: () => ({ meta: [
    { title: "تفاصيل الفاتورة والمرجع — دفتر دلتا ويافا" }, { name: "description", content: "رقم الفاتورة واسم الصيدلية والقيمة والمرفق المرتبط." },
    { property: "og:title", content: "تفاصيل الفاتورة" }, { property: "og:description", content: "عرض الفاتورة ومرفقها المرجعي." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: InvoiceDetail,
});

function InvoiceDetail() {
  const { id } = Route.useParams();
  const { companyId, company } = useCompany();
  const e = ledger.find((x) => x.id === id && x.kind === "invoice");
  const p = e && pharmacies.find((x) => x.id === e.pharmacyId && x.companyId === companyId);
  if (!e || !p) return <EmptyState title={`الفاتورة غير موجودة في ${company.name}`} action={<Link to="/" className={btnOutline}>العودة</Link>} />;

  return (
    <div className="space-y-5">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-primary"><ArrowRight className="h-4 w-4" aria-hidden="true" />العودة إلى الحسابات</Link>
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground"><FileText className="h-5 w-5" aria-hidden="true" /></span>
        <div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">فاتورة رقم {e.reference}</h1>
          <p className="mt-1 text-sm text-muted-foreground">تفاصيل الفاتورة ومرجعها المرفق</p>
        </div>
      </div>

      <Card className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div><div className="text-xs font-semibold text-muted-foreground">رقم الفاتورة</div><div className="mt-2 font-extrabold tabular-nums">{e.reference}</div></div>
        <div><div className="text-xs font-semibold text-muted-foreground">الصيدلية</div><Link to="/pharmacies/$id" params={{ id: p.id }} className="mt-2 block font-extrabold text-primary hover:underline">{p.name}</Link></div>
        <div><div className="text-xs font-semibold text-muted-foreground">القيمة</div><div className="mt-2 font-extrabold tabular-nums">{fmt(e.amount)}</div></div>
        <div><div className="text-xs font-semibold text-muted-foreground">تاريخ المستند</div><div className="mt-2 font-extrabold tabular-nums">{formatDate(e.date)}</div></div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-extrabold">المرفق المرجعي</h2>
        {e.attachmentName ? (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/70 bg-muted/60 p-4">
            <span className="flex min-w-0 items-center gap-2 text-sm font-semibold"><Paperclip className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" /><span className="truncate" dir="ltr">{e.attachmentName}</span></span>
            <div className="flex flex-wrap gap-2">
              <button className={btnOutline} disabled title="بانتظار خدمة الملفات">فتح المرفق</button>
              <FilePicker accept="image/*,application/pdf" />
            </div>
          </div>
        ) : <EmptyState title="لا يوجد مرفق لهذه الفاتورة" hint="ارفع صورة الفاتورة الأصلية أو الملف المصمم خارج التطبيق." />}
        <p className="mt-4 text-xs leading-5 text-muted-foreground">الفاتورة تُصمَّم خارج التطبيق ثم تُرفع هنا. فتح المرفق أو استبداله لا يغيّر قيمة الحساب.</p>
      </Card>
    </div>
  );
}
