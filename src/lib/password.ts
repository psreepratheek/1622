/**
 * Forgiving password matching for the gift gate.
 * - case and spaces are ignored ("Our Song" == "oursong")
 * - date separators don't matter (14-02-2023 == 14/02/2023 == 14.02.2023 == 14022023)
 * - leading zeros in day/month are optional (14-2-2023 == 14-02-2023)
 */
export function normalizeSecret(value: string): string {
  const unified = value
    .trim()
    .toLowerCase()
    .replace(/[\s/._\\-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const date = unified.match(/^(\d{1,2})-(\d{1,2})-(\d{2,4})$/);
  if (date) {
    const [, d = "", m = "", y = ""] = date;
    return `${d.padStart(2, "0")}${m.padStart(2, "0")}${y}`;
  }
  return unified.replace(/-/g, "");
}

export function isCorrectPassword(input: string, passwords: readonly string[]): boolean {
  const attempt = normalizeSecret(input);
  if (!attempt) return false;
  return passwords.some((p) => normalizeSecret(p) === attempt);
}
