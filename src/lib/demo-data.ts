/**
 * بيانات عرض فقط (DEMO). لا منطق مالي هنا: الإجماليات والأرصدة مكتوبة كقيم جاهزة
 * كما سيعيدها المصدر الحقيقي لاحقاً. Codex يستبدل هذا الملف بمحوّل للخدمة الفعلية.
 */
export type CompanyId = "delta" | "yafa";

export interface Company {
  id: CompanyId;
  name: string; // اسم الشركة
  hasCommission: boolean; // يافا فقط
  logoUrl: string | null; // null = مكان محجوز إلى حين استلام الشعار
}

export interface Pharmacy {
  id: string;
  companyId: CompanyId;
  name: string; // الحقل التجاري المؤكد الوحيد
  totalInvoiced: number; // إجمالي المفوتر (من المصدر)
  totalPaid: number; // إجمالي السداد (من المصدر)
  remaining: number; // المتبقي (من المصدر)
}

export type EntryKind = "invoice" | "payment";
export interface LedgerEntry {
  id: string;
  pharmacyId: string;
  kind: EntryKind; // invoice تزيد المطلوب، payment تخفضه
  reference: string; // رقم الفاتورة أو مرجع القسيمة
  amount: number;
  date?: string; // حقل تنظيمي مقترح — غير مؤكد
  runningBalance?: number; // تنظيم مقترح — من المصدر وليس محسوباً في الواجهة
  attachmentName?: string | null;
}

export interface CompanySummary {
  totalInvoiced: number;
  totalCollected: number;
  outstanding: number;
  commission?: { amount: number; ruleLabel: string } | null; // يافا فقط، القاعدة قيد التأكيد
}

export const companies: Record<CompanyId, Company> = {
  delta: { id: "delta", name: "دلتا الشمال", hasCommission: false, logoUrl: null },
  yafa: { id: "yafa", name: "يافا", hasCommission: true, logoUrl: null },
};

export const pharmacies: Pharmacy[] = [
  { id: "d1", companyId: "delta", name: "صيدلية الشفاء", totalInvoiced: 12500, totalPaid: 8000, remaining: 4500 },
  { id: "d2", companyId: "delta", name: "صيدلية النور", totalInvoiced: 6200, totalPaid: 6200, remaining: 0 },
  { id: "d3", companyId: "delta", name: "صيدلية الرحمة", totalInvoiced: 0, totalPaid: 0, remaining: 0 },
  { id: "y1", companyId: "yafa", name: "صيدلية الشفاء", totalInvoiced: 3400, totalPaid: 1000, remaining: 2400 },
  { id: "y2", companyId: "yafa", name: "صيدلية الأمل", totalInvoiced: 9100, totalPaid: 5500, remaining: 3600 },
];

export const ledger: LedgerEntry[] = [
  { id: "e1", pharmacyId: "d1", kind: "invoice", reference: "D-1001", amount: 7500, date: "2026-10-02", runningBalance: 7500, attachmentName: "D-1001.jpg" },
  { id: "e2", pharmacyId: "d1", kind: "payment", reference: "قسيمة 22", amount: 5000, date: "2026-10-15", runningBalance: 2500, attachmentName: "receipt-22.jpg" },
  { id: "e3", pharmacyId: "d1", kind: "invoice", reference: "D-1014", amount: 5000, date: "2026-11-01", runningBalance: 7500, attachmentName: null },
  { id: "e4", pharmacyId: "d1", kind: "payment", reference: "قسيمة 31", amount: 3000, date: "2026-11-12", runningBalance: 4500, attachmentName: "receipt-31.pdf" },
  { id: "e5", pharmacyId: "d2", kind: "invoice", reference: "D-1008", amount: 6200, date: "2026-10-09", runningBalance: 6200, attachmentName: "D-1008.pdf" },
  { id: "e6", pharmacyId: "d2", kind: "payment", reference: "قسيمة 27", amount: 6200, date: "2026-11-03", runningBalance: 0, attachmentName: "receipt-27.jpg" },
  { id: "e7", pharmacyId: "y1", kind: "invoice", reference: "Y-301", amount: 3400, date: "2026-10-20", runningBalance: 3400, attachmentName: "Y-301.jpg" },
  { id: "e8", pharmacyId: "y1", kind: "payment", reference: "قسيمة 5", amount: 1000, date: "2026-11-05", runningBalance: 2400, attachmentName: null },
  { id: "e9", pharmacyId: "y2", kind: "invoice", reference: "Y-288", amount: 9100, date: "2026-10-01", runningBalance: 9100, attachmentName: "Y-288.pdf" },
  { id: "e10", pharmacyId: "y2", kind: "payment", reference: "قسيمة 3", amount: 5500, date: "2026-10-28", runningBalance: 3600, attachmentName: "receipt-3.jpg" },
];

export const summaries: Record<CompanyId, CompanySummary> = {
  delta: { totalInvoiced: 18700, totalCollected: 14200, outstanding: 4500, commission: null },
  yafa: {
    totalInvoiced: 12500, totalCollected: 6500, outstanding: 6000,
    commission: { amount: 325, ruleLabel: "نسبة على المجبي — القاعدة قيد التأكيد (قيمة عرض)" },
  },
};

export const fmt = (n: number) => n.toLocaleString("ar-EG") + " ₪";

/** محاكاة الحفظ في نسخة العرض: لا نجاح وهمي، تفشل دائماً مع الحفاظ على المدخلات. */
export function demoSubmit(): Promise<never> {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error("نسخة عرض: لا توجد خدمة حفظ متصلة بعد، لم يُحفظ شيء ولم يتغير أي رصيد.")), 900),
  );
}
