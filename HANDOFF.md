# تسليم الواجهات إلى Codex

الواجهات فقط، ببيانات تجريبية في `src/lib/demo-data.ts`. لا خدمة خلفية ولا قاعدة بيانات معتمدة. الأرصدة والعمولة قيم جاهزة من المصدر، والواجهة لا تحسبها.

## الأنواع (من demo-data.ts)
- `Company { id: "delta"|"yafa", name, hasCommission, logoUrl|null }`: يبقى الشعار مكاناً محجوزاً ما دامت قيمته null.
- `Pharmacy { id, companyId, name, totalInvoiced, totalPaid, remaining }`: الحقل التجاري المؤكد هو `name` فقط. الاسم نفسه في الشركتين حسابان منفصلان.
- `LedgerEntry { id, pharmacyId, kind: "invoice"|"payment", reference, amount, date?, runningBalance?, attachmentName? }`: `date` و`runningBalance` اقتراحان.
- `CompanySummary { totalInvoiced, totalCollected, outstanding, commission? }`: `commission` ليافا فقط.

## الشاشات
| المسار | الغرض |
|---|---|
| `/` | قائمة الصيدليات وإضافة حساب (name) |
| `/pharmacies/$id` | الدفتر: الإجماليات والحركات وأثرها |
| `/invoices/new?pharmacy=` | invoiceNumber, pharmacyId, amount, attachment, date(مقترح) |
| `/invoices/$id` | تفاصيل الفاتورة والمرفق (عرض/استبدال، لا يغيّر القيمة) |
| `/payments/new?pharmacy=` | pharmacyId, amount, attachment, date(مقترح), receiptNumber(اختياري) |
| `/statement` | ملخص الشركة وكشف كل صيدلية وعمولة يافا |

## الإجراءات
- `EntryForm` يستقبل `onSubmit(FormData)` ويضيف `companyId`. عند رفض الوعد تظهر رسالة الفشل وتبقى المدخلات. وعند نجاحه تظهر رسالة النجاح. القيمة الافتراضية `demoSubmit` ترفض دائماً، لذلك لا يظهر في العرض أي نجاح وهمي.
- يحفظ `CompanyProvider` / `useCompany()` الشركة المختارة، ويجب أن تُصفّى كل الاستعلامات بـ companyId.

## قيد التأكيد
تاريخ الفاتورة أم تاريخ الإدخال، قاعدة عمولة يافا، رقم القسيمة، التصدير والطباعة والإرسال للمدير (غير منفذة).
