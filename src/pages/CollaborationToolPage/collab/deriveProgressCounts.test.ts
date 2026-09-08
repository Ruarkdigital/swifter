import { describe, expect, it } from "vitest";
import { deriveProgressCounts } from "./useAiRedlineSuggestions";

describe("deriveProgressCounts", () => {
  it("uses the live per-side counts the backend populates (resolvedBy*)", () => {
    // Real GET payload shape: resolvedByManager/Vendor carry the per-side
    // totals; cm_accept/pm_accept are left at 0 by the current backend.
    expect(
      deriveProgressCounts({
        resolvedByManager: 1,
        resolvedByVendor: 1,
        resolvedCount: 2,
        cm_accept: 0,
        pm_accept: 0,
      }),
    ).toEqual({ cmAddressed: 1, pmAddressed: 1, resolved: 2 });
  });

  it("falls back to cm_accept/pm_accept when resolvedBy* are absent", () => {
    expect(
      deriveProgressCounts({ cm_accept: 3, pm_accept: 1, resolvedCount: 1 }),
    ).toEqual({ cmAddressed: 3, pmAddressed: 1, resolved: 1 });
  });

  it("falls back to `resolved` when `resolvedCount` is absent", () => {
    expect(
      deriveProgressCounts({ resolvedByManager: 2, resolvedByVendor: 2, resolved: 2 }),
    ).toEqual({ cmAddressed: 2, pmAddressed: 2, resolved: 2 });
  });

  it("prefers `resolvedCount` over `resolved` when both are present", () => {
    expect(
      deriveProgressCounts({ resolvedCount: 5, resolved: 9 }).resolved,
    ).toBe(5);
  });

  it("leaves counts undefined when the BE omits them", () => {
    expect(deriveProgressCounts({})).toEqual({
      cmAddressed: undefined,
      pmAddressed: undefined,
      resolved: undefined,
    });
    expect(deriveProgressCounts(undefined)).toEqual({
      cmAddressed: undefined,
      pmAddressed: undefined,
      resolved: undefined,
    });
  });

  it("keeps a zero count distinct from an omitted one", () => {
    expect(
      deriveProgressCounts({ resolvedByManager: 0, resolvedByVendor: 0 }),
    ).toEqual({
      cmAddressed: 0,
      pmAddressed: 0,
      resolved: undefined,
    });
  });
});
