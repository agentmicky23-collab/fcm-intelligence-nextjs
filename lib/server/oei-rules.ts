import "server-only";

// Operational Excellence scheme rules, from Post Office's own scheme guide, which is confidential.
// They live only on the server and are sent only to people allowed to use the members' tools
// (see /api/tools/branch-check/rules). Never import this from a client component, never publish it.

export type OeiScheme = {
  /** First day of the first trading period this version applies to (YYYY-MM-DD). */
  from: string;
  /** Points needed for the first step of payment, the % per point, and the most it can pay. */
  firstPayingPoints: number;
  percentPerPoint: number;
  maxPercent: number;
  bankingHub: { firstPayingPoints: number; maxPercent: number };
  /** Cash pouch errors allowed before points are lost: base, plus one per band of cash returned. */
  pouchAllowance: { base: number; firstBandOver: number; bandSize: number };
  stampStock: boolean;
  eligible: string;
};

export type OeiRules = {
  /** Trading periods before this were for information only: nothing was paid. */
  paymentsFrom: string;
  startingPoints: number;
  deductions: { failedDeclarationDay: number; pouchError: number; perThousandExcessCash: number; perThousandExcessStamps: number };
  dailyExcessCashCap: number;
  schemes: OeiScheme[];
  source: string;
};

export const oeiRules: OeiRules = {
  paymentsFrom: "2024-08-05",
  startingPoints: 100,
  deductions: { failedDeclarationDay: 2, pouchError: 2, perThousandExcessCash: 1, perThousandExcessStamps: 1 },
  dailyExcessCashCap: 50000,
  schemes: [
    {
      from: "2024-04-01",
      firstPayingPoints: 81,
      percentPerPoint: 0.25,
      maxPercent: 5,
      bankingHub: { firstPayingPoints: 81, maxPercent: 5 },
      pouchAllowance: { base: 0, firstBandOver: 100000, bandSize: 200000 },
      stampStock: false,
      eligible: "Variable remuneration (the Transactions section of your statement).",
    },
    {
      from: "2025-03-31",
      firstPayingPoints: 81,
      percentPerPoint: 0.25,
      maxPercent: 5,
      bankingHub: { firstPayingPoints: 81, maxPercent: 5 },
      pouchAllowance: { base: 1, firstBandOver: 100000, bandSize: 200000 },
      stampStock: false,
      eligible: "Variable remuneration (the Transactions section of your statement).",
    },
    {
      from: "2026-03-30",
      firstPayingPoints: 77,
      percentPerPoint: 0.25,
      maxPercent: 6,
      bankingHub: { firstPayingPoints: 81, maxPercent: 5 },
      pouchAllowance: { base: 1, firstBandOver: 100000, bandSize: 200000 },
      stampStock: true,
      eligible: "Variable remuneration, plus assigned office payments and payments for operating outreaches.",
    },
  ],
  source: "Post Office's Operational Excellence scheme guide for postmasters (on Branch Hub). For any question about your own score, call the Branch Support Centre.",
};
