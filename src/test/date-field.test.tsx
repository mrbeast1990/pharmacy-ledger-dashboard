import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DateField } from "@/components/app/DateField";

describe("DateField", () => {
  it("keeps the existing ISO form value while showing DD/MM/YYYY", () => {
    const { container } = render(<DateField name="documentDate" required />);
    const visible = screen.getByPlaceholderText("DD/MM/YYYY");

    fireEvent.change(visible, { target: { value: "02102026" } });

    expect(visible).toHaveValue("02/10/2026");
    expect(container.querySelector('input[type="hidden"]')).toHaveValue("2026-10-02");
  });
});
