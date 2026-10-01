// What an employee really costs the business, from their hourly rate and weekly hours.
// Used by the report agents (Section 4 must match it) and by the cost-to-employer calculator.

import { ukRates } from "@/lib/uk-rates";

export type EmployerCostInput = {
  hourlyRate: number;
  hoursPerWeek: number;
  /** Paid weeks a year. Holiday is paid, so the full year is 52. */
  paidWeeks?: number;
  /** Include the employer's minimum pension contribution (auto-enrolment). Default: when earnings reach the trigger. */
  pension?: "auto" | "yes" | "no";
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export function employerCost(input: EmployerCostInput) {
  const r = ukRates;
  const rate = input.hourlyRate;
  const hours = input.hoursPerWeek;
  const paidWeeks = input.paidWeeks ?? 52;
  const workedWeeks = paidWeeks - r.holiday.weeks;

  const grossYear = rate * hours * paidWeeks;
  const holidayPayYear = rate * hours * r.holiday.weeks;
  const niYear = Math.max(0, grossYear - r.employerNI.secondaryThresholdYear) * r.employerNI.rate;
  const enrolled = input.pension === "yes" || (input.pension !== "no" && grossYear >= r.pension.trigger);
  const pensionYear = enrolled ? Math.max(0, Math.min(grossYear, r.pension.qualifyingUpper) - r.pension.qualifyingLower) * r.pension.employerMinimum : 0;
  const totalYear = grossYear + niYear + pensionYear;

  const workedHoursYear = hours * workedWeeks;
  const perWorkedHour = (v: number) => (workedHoursYear > 0 ? v / workedHoursYear : 0);

  return {
    taxYear: r.taxYear,
    input: { hourlyRate: rate, hoursPerWeek: hours, paidWeeks, workedWeeks: round2(workedWeeks), pensionIncluded: enrolled },
    year: {
      wages: round2(grossYear - holidayPayYear),
      holidayPay: round2(holidayPayYear),
      grossPay: round2(grossYear),
      employerNI: round2(niYear),
      employerPension: round2(pensionYear),
      total: round2(totalYear),
    },
    /** Each cost spread over the hours actually worked (holiday weeks excluded). */
    perWorkedHour: {
      wage: round2(rate),
      holiday: round2(perWorkedHour(holidayPayYear)),
      employerNI: round2(perWorkedHour(niYear)),
      employerPension: round2(perWorkedHour(pensionYear)),
      total: round2(perWorkedHour(totalYear)),
    },
    upliftOnRate: rate > 0 ? round2((perWorkedHour(totalYear) / rate - 1) * 100) : 0,
    notes: [
      `Employer NI at ${r.employerNI.rate * 100}% on pay above £${r.employerNI.secondaryThresholdYear.toLocaleString("en-GB")} a year per employee.`,
      enrolled
        ? `Pension at the ${r.pension.employerMinimum * 100}% employer minimum on qualifying earnings (£${r.pension.qualifyingLower.toLocaleString("en-GB")} to £${r.pension.qualifyingUpper.toLocaleString("en-GB")}).`
        : `No employer pension: earnings are below the £${r.pension.trigger.toLocaleString("en-GB")} auto-enrolment trigger (the employee can still ask to join).`,
      `Holiday: ${r.holiday.weeks} weeks paid, so pay covers ${round2(workedWeeks)} working weeks.`,
      `Eligible employers can claim the Employment Allowance (up to £${r.employerNI.employmentAllowance.toLocaleString("en-GB")} off their total employer NI bill a year), which this doesn't include.`,
    ],
  };
}

export type EmployerCost = ReturnType<typeof employerCost>;
