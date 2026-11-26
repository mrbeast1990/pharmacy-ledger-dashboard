import { describe, expect, it } from "vitest";
import { fmt } from "@/lib/demo-data";
import { displayDateToIso, formatDate, maskDateInput } from "@/lib/format";

describe("display formatting", () => {
  it("uses Western digits and Libyan dinar", () => {
    expect(fmt(12500)).toBe("12,500 د.ل");
  });

  it("displays ISO ledger dates as DD/MM/YYYY", () => {
    expect(formatDate("2026-10-02")).toBe("02/10/2026");
  });

  it("converts a valid displayed date back to the existing ISO form value", () => {
    expect(displayDateToIso("02/10/2026")).toBe("2026-10-02");
  });

  it("rejects impossible calendar dates", () => {
    expect(displayDateToIso("31/02/2026")).toBeNull();
  });

  it("masks typed digits into a DD/MM/YYYY date", () => {
    expect(maskDateInput("02102026")).toBe("02/10/2026");
  });
});
