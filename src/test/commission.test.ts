import { describe, expect, it } from "vitest";
import { computeCommission, fmt, type LedgerEntry } from "@/lib/demo-data";
const e: LedgerEntry[] = [
  { id: "1", pharmacyId: "a", kind: "payment", reference: "", amount: 1000, date: "2026-10-05" },
  { id: "2", pharmacyId: "a", kind: "invoice", reference: "", amount: 9000, date: "2026-10-06" },
  { id: "3", pharmacyId: "a", kind: "payment", reference: "", amount: 2000, date: "2026-11-05" },
];
describe("yafa commission", () => {
  it("is 5% of payments only", () => expect(computeCommission(e).commission).toBe(150));
  it("respects period", () => expect(computeCommission(e, "2026-11-01", "2026-11-30").commission).toBe(100));
  it("uses Libyan dinar", () => expect(fmt(5)).toContain("د.ل"));
});
