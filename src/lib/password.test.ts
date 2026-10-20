import { describe, expect, it } from "vitest";
import { isCorrectPassword } from "./password";

const pw = ["14-02-2023"];

describe("gift password", () => {
  it("accepts the exact date", () => {
    expect(isCorrectPassword("14-02-2023", pw)).toBe(true);
  });
  it("accepts other separators and missing leading zeros", () => {
    expect(isCorrectPassword("14/2/2023", pw)).toBe(true);
    expect(isCorrectPassword(" 14.02.2023 ", pw)).toBe(true);
  });
  it("rejects a wrong date and empty input", () => {
    expect(isCorrectPassword("15-02-2023", pw)).toBe(false);
    expect(isCorrectPassword("   ", pw)).toBe(false);
  });
  it("ignores case and spaces for word passwords", () => {
    expect(isCorrectPassword("Our Song", ["oursong"])).toBe(true);
  });
});
