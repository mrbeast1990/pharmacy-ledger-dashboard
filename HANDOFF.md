# تسليم الواجهات إلى Codex

الواجهات فقط، ببيانات تجريبية في `src/lib/demo-data.ts`. لا خدمة حفظ متصلة في نسخة العرض. الأرصدة قيم جاهزة من المصدر. العمولة تُحسب عند الطلب فقط (انظر أدناه). العملة: الدينار الليبي «د.ل» عبر `fmt`، بأرقام غربية `0-9`.

## الأنواع (من demo-data.ts)
- `Company { id: "delta"|"yafa", name, hasCommission, logoUrl|null }`: عند عدم وجود شعار تظهر الأحرف الأولى من اسم الشركة.
- `Pharmacy { id, companyId, name, totalInvoiced, totalPaid, remaining }`: الحقل التجاري المؤكد هو `name` فقط. الاسم نفسه في الشركتين حسابان منفصلان.
- `LedgerEntry { id, pharmacyId, kind: "invoice"|"payment", reference, amount, date?, runningBalance?, attachmentName? }`: `date` و`runningBalance` اقتراحان.
- `CompanySummary { totalInvoiced, totalCollected, outstanding, commission? }`: `commission` لا يُعرض تلقائياً.
- `CompanySettings { name, address, phone, invoiceNotes, logoUrl }` لكل شركة منفصلة؛ تُحفظ في localStorage عبر `saveSettings` في نسخة العرض، ويستبدلها Codex بخدمة حقيقية. الشعار المرفوع (data URL) يظهر في بطاقة الشركة أعلى التنقل.

## الشاشات
| المسار | الغرض |
|---|---|
| `/` | لوحة الملخص، قائمة الصيدليات وإضافة حساب (name) |
| `/pharmacies/$id` | الدفتر: الإجماليات والحركات وأثرها |
| `/invoices/new?pharmacy=` | invoiceNumber, pharmacyId, amount, attachment, documentDate, entryDate(تلقائي) |
| `/invoices/$id` | تفاصيل الفاتورة والمرفق (عرض/استبدال، لا يغيّر القيمة) |
| `/payments/new?pharmacy=` | pharmacyId, amount, attachment, documentDate, entryDate(تلقائي), receiptNumber(اختياري) |
| `/statement` | ملخص الشركة وكشف كل صيدلية، وليافا: فترة (من/إلى) وزر «احسب العمولة» |
| `/settings` | بطاقة مستقلة لكل شركة: الشعار، الاسم، العنوان، الهاتف، ملاحظات الفاتورة |

## العرض والتنسيق
- الواجهة عربية RTL بخط Cairo. التنقل عمودي على يمين الشاشة، مصغّر على الشاشات المتوسطة، وشريط سفلي على الجوال.
- لون دلتا الشمال `#0F766E`، ولون يافا `#B45309`. حالات الحساب: مدفوع، جزئي، متبقي.
- التاريخ المعروض `DD/MM/YYYY` عبر `formatDate` و`DateField`. تبقى قيمة الحقل المرسلة في `FormData` بصيغة ISO السابقة حتى لا تتغير عقود البيانات.
- حقول رفع الملفات تستخدم زر «اختر ملفًا» وتُخفي نص المتصفح الافتراضي.
- كشف الحساب مهيأ للطباعة بالأبيض والأسود، مع إخفاء عناصر التنقل والأزرار.

## الإجراءات
- `EntryForm` يستقبل `onSubmit(FormData)` ويضيف `companyId`. عند رفض الوعد تظهر رسالة الفشل وتبقى المدخلات. وعند نجاحه تظهر رسالة النجاح. القيمة الافتراضية `demoSubmit` ترفض دائماً، لذلك لا يظهر في العرض أي نجاح وهمي.
- يحفظ `CompanyProvider` / `useCompany()` الشركة المختارة، ويجب أن تُصفّى كل الاستعلامات بـ companyId.

## عمولة يافا
`computeCommission(entries, from?, to?)` = 5% (`COMMISSION_RATE`) من مجموع السدادات فقط ضمن الفترة حسب تاريخ المستند، عند الضغط فقط. يُفضّل نقلها للخدمة الخلفية.

## قيد التأكيد
رقم القسيمة، التصدير والإرسال للمدير (غير منفذة).
