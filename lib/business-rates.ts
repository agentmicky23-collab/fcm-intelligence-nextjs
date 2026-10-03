// The business rates bill for a premises in England, from its rateable value (VOA) and this year's rules.
// Used by the report agents (the report must match it) and later by a members' calculator.

import { ukRates } from "@/lib/uk-rates";

export type BusinessRatesInput = {
  rateableValue: number;
  /** Qualifies as retail, hospitality or leisure (a shop with a Post Office counter normally does). */
  rhl?: boolean;
  /** Small business rate relief needs this to be the business's only property (with limited exceptions). */
  onlyProperty?: boolean;
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export function businessRates(input: BusinessRatesInput) {
  const r = ukRates.businessRates;
  const rv = input.rateableValue;
  const rhl = input.rhl ?? true;
  const only = input.onlyProperty ?? true;

  const band = rv >= r.largeThreshold ? "large" : rv < r.smallThreshold ? "small" : "standard";
  const multiplier =
    band === "large" ? r.multipliers.large : band === "small" ? (rhl ? r.multipliers.smallRHL : r.multipliers.smallNonRHL) : rhl ? r.multipliers.standardRHL : r.multipliers.standardNonRHL;
  const gross = rv * multiplier;

  const sbr = r.smallBusinessRelief;
  const reliefPct = !only || rv > sbr.none ? 0 : rv <= sbr.full ? 1 : (sbr.none - rv) / (sbr.none - sbr.full);
  const relief = gross * reliefPct;
  const net = gross - relief;

  return {
    year: r.year,
    list: r.list,
    input: { rateableValue: rv, rhl, onlyProperty: only },
    multiplier,
    multiplierName: band === "large" ? "Large business multiplier" : `${band === "small" ? "Small business" : "Standard"} ${rhl ? "retail, hospitality and leisure" : ""} multiplier`.replace(/\s+/g, " ").trim(),
    grossYear: round2(gross),
    smallBusinessReliefPercent: round2(reliefPct * 100),
    smallBusinessRelief: round2(relief),
    payableYear: round2(net),
    payableMonth: round2(net / 12),
    notes: [
      `Rateable value £${rv.toLocaleString("en-GB")} × ${(multiplier * 100).toFixed(1)}p (${r.year}).`,
      reliefPct > 0
        ? `Small business rate relief: ${round2(reliefPct * 100)}% (full relief up to £${sbr.full.toLocaleString("en-GB")}, tapering to none at £${sbr.none.toLocaleString("en-GB")}), if this is the business's only property.`
        : only
          ? `No small business rate relief: the rateable value is over £${sbr.none.toLocaleString("en-GB")}.`
          : "No small business rate relief: the business uses more than one property.",
      "Before transitional relief, Supporting Small Business Relief or any local discount the council may apply; the council's bill is the final figure.",
      "England only. Wales, Scotland and Northern Ireland have their own rates and reliefs.",
    ],
  };
}

export type BusinessRates = ReturnType<typeof businessRates>;
