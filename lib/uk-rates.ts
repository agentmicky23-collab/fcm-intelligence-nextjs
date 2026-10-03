// UK statutory rates used in reports and tools. One dated source of truth: the report agents must quote these,
// and the report checker rejects anything else. Review every April (and after each Budget).

export const ukRates = {
  taxYear: "2026/27",
  effectiveFrom: "2026-04-06",
  /** When to review next: rates change from 1 April (wages) and 6 April (tax). */
  reviewBy: "2027-03-01",
  verified: "2026-10-01",
  minimumWage: {
    from: "2026-04-01",
    age21plus: 12.71,
    age18to20: 10.85,
    age16to17: 8.0,
    apprentice: 8.0,
    previous: { from: "2025-04-01", age21plus: 12.21 },
  },
  employerNI: { rate: 0.15, secondaryThresholdYear: 5000, employmentAllowance: 10500 },
  pension: { employerMinimum: 0.03, totalMinimum: 0.08, qualifyingLower: 6240, qualifyingUpper: 50270, trigger: 10000 },
  holiday: { weeks: 5.6, maxDays: 28, irregularAccrual: 0.1207 },
  sickPay: { weekly: 123.25, percentOfEarnings: 0.8, fromDayOne: true },
  vat: { standard: 0.2, registration: 90000, deregistration: 88000 },
  businessRates: {
    year: "2026/27",
    note: "England. Retail, hospitality and leisure (RHL) properties have their own multipliers. Check whether the premises qualify as RHL and apply any small business rate relief.",
    multipliers: { smallRHL: 0.382, standardRHL: 0.43, smallNonRHL: 0.432, standardNonRHL: 0.48, large: 0.508 },
    smallThreshold: 51000,
    largeThreshold: 500000,
    smallBusinessRelief: { full: 12000, none: 15000, onlyProperty: true },
    list: "2026 rating list (from 1 April 2026)",
  },
  sources: [
    "https://www.gov.uk/national-minimum-wage-rates",
    "https://www.gov.uk/guidance/rates-and-thresholds-for-employers-2026-to-2027",
    "https://www.thepensionsregulator.gov.uk/employers/new-employers/im-an-employer-who-has-to-provide-a-pension/declare-your-compliance/ongoing-duties-for-employers/earnings-thresholds",
    "https://www.gov.uk/statutory-sick-pay",
    "https://www.gov.uk/vat-registration",
    "https://www.gov.uk/business-rates-relief/small-business-rate-relief",
    "https://www.gov.uk/correct-your-business-rates",
  ],
} as const;

/** Figures that must never appear in a 2026/27 report as a current rate. */
export const staleRateText = [
  { pattern: /13\.8\s*%/, why: "Employer NI has been 15% since April 2025" },
  { pattern: /£\s?9,?100/, why: "The employer NI threshold has been £5,000 a year since April 2025" },
  { pattern: /£\s?12\.21/, why: "The National Living Wage has been £12.71 since April 2026" },
  { pattern: /£\s?116\.75/, why: "Statutory Sick Pay has been £123.25 a week since April 2026" },
  { pattern: /£\s?11\.44/, why: "Out-of-date National Living Wage" },
  { pattern: /10\.77\s*%/, why: "Holiday accrual for irregular hours is 12.07% (5.6 weeks)" },
  { pattern: /£\s?85,?000.{0,40}VAT|VAT.{0,40}£\s?85,?000/i, why: "The VAT registration threshold has been £90,000 since April 2024" },
] as const;
