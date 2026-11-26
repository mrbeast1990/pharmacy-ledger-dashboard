import { CalendarDays } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { displayDateToIso, formatDate, maskDateInput } from "@/lib/format";
import { inputCls } from "./states";

export function DateField({ name, value, onChange, required = false, readOnly = false }: {
  name?: string;
  value?: string;
  onChange?: (isoDate: string) => void;
  required?: boolean;
  readOnly?: boolean;
}) {
  const controlled = value !== undefined;
  const [innerValue, setInnerValue] = useState(value ?? "");
  const actualValue = controlled ? value : innerValue;
  const [draft, setDraft] = useState(formatDate(actualValue, ""));
  const lastValue = useRef(actualValue);
  const visibleInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actualValue !== lastValue.current) {
      lastValue.current = actualValue;
      setDraft(formatDate(actualValue, ""));
    }
  }, [actualValue]);

  useEffect(() => {
    const form = visibleInput.current?.form;
    if (!form) return;
    function reset() {
      lastValue.current = "";
      setDraft("");
      setInnerValue("");
      onChange?.("");
    }
    form.addEventListener("reset", reset);
    return () => form.removeEventListener("reset", reset);
  }, [onChange]);

  function change(event: ChangeEvent<HTMLInputElement>) {
    const nextDraft = maskDateInput(event.target.value);
    const nextValue = displayDateToIso(nextDraft) ?? "";
    setDraft(nextDraft);
    lastValue.current = nextValue;
    if (!controlled) setInnerValue(nextValue);
    onChange?.(nextValue);
  }

  return (
    <span className="relative block">
      <input
        ref={visibleInput}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        dir="ltr"
        maxLength={10}
        required={required}
        readOnly={readOnly}
        pattern="(?:0[1-9]|[12][0-9]|3[01])/(?:0[1-9]|1[0-2])/[0-9]{4}"
        title="استخدم الصيغة DD/MM/YYYY"
        placeholder="DD/MM/YYYY"
        value={draft}
        onChange={change}
        className={`${inputCls} pl-10 text-left tabular-nums lining-nums ${readOnly ? "bg-muted text-muted-foreground" : ""}`}
      />
      <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <input type="hidden" name={name} value={actualValue} readOnly />
    </span>
  );
}
