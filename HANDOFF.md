# تسليم الواجهات إلى Codex

الواجهات فقط، ببيانات تجريبية في `src/lib/demo-data.ts`. لا خدمة خلفية ولا قاعدة بيانات معتمدة. الأرصدة قيم جاهزة من المصدر. العمولة تُحسب في الواجهة عند الطلب فقط (انظر أدناه). العملة: الدينار الليبي «د.ل» عبر `fmt`.

## الأنواع (من demo-data.ts)
- `Company { id: "delta"|"yafa", name, hasCommission, logoUrl|null }`: يبقى الشعار مكاناً محجوزاً ما دامت قيمته null.
- `Pharmacy { id, companyId, name, totalInvoiced, totalPaid, remaining }`: الحقل التجاري المؤكد هو `name` فقط. الاسم نفسه في الشركتين حسابان منفصلان.
- `LedgerEntry { id, pharmacyId, kind: "invoice"|"payment", reference, amount, date?, runningBalance?, attachmentName? }`: `date` و`runningBalance` اقتراحان.
- `CompanySummary { totalInvoiced, totalCollected, outstanding, commission? }`: `commission` لم يعد يُعرض تلقائياً.
- `CompanySettings { name, address, phone, invoiceNotes, logoUrl }` لكل شركة منفصلة؛ تُحفظ في localStorage عبر `saveSettings` في نسخة العرض، ويستبدلها Codex بخدمة حقيقية. الشعار المرفوع (data URL) يظهر في الترويسة.

## الشاشات
| المسار | الغرض |
|---|---|
| `/` | قائمة الصيدليات وإضافة حساب (name) |
| `/pharmacies/$id` | الدفتر: الإجماليات والحركات وأثرها |
| `/invoices/new?pharmacy=` | invoiceNumber, pharmacyId, amount, attachment, documentDate, entryDate(تلقائي) |
| `/invoices/$id` | تفاصيل الفاتورة والمرفق (عرض/استبدال، لا يغيّر القيمة) |
| `/payments/new?pharmacy=` | pharmacyId, amount, attachment, documentDate, entryDate(تلقائي), receiptNumber(اختياري) |
| `/statement` | ملخص الشركة وكشف كل صيدلية، وليافا: فترة (من/إلى) وزر «احسب العمولة» |
| `/settings` | إعدادات الشركة الحالية: الشعار، الاسم، العنوان، الهاتف، ملاحظات الفاتورة |

## الإجراءات
- `EntryForm` يستقبل `onSubmit(FormData)` ويضيف `companyId`. عند رفض الوعد تظهر رسالة الفشل وتبقى المدخلات. وعند نجاحه تظهر رسالة النجاح. القيمة الافتراضية `demoSubmit` ترفض دائماً، لذلك لا يظهر في العرض أي نجاح وهمي.
- يحفظ `CompanyProvider` / `useCompany()` الشركة المختارة، ويجب أن تُصفّى كل الاستعلامات بـ companyId.

## عمولة يافا
`computeCommission(entries, from?, to?)` = 5% (`COMMISSION_RATE`) من مجموع السدادات فقط ضمن الفترة حسب تاريخ المستند، عند الضغط فقط. يُفضّل نقلها للخدمة الخلفية.

## قيد التأكيد
رقم القسيمة، التصدير والطباعة والإرسال للمدير (غير منفذة).
