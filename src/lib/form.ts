/** Trim a FormData string value, returning null for empty input. */
export function cleanField(v: FormDataEntryValue | null): string | null {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : null;
}
