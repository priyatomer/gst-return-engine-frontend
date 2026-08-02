export interface TargetItem {
  category: string;
  unit: string;
  target: number;
  achieved: number;
  color: string;
}

export interface EmployeeTarget {
  name: string;
  avatar: string;
  role: string;
  targets: TargetItem[];
}

export const MONTHS = ["Apr 2026", "May 2026", "Jun 2026", "Jul 2026"];

export const TARGET_DATA: Record<string, EmployeeTarget[]> = {
  "Jul 2026": [
    {
      name: "Priya Sharma", avatar: "PS", role: "Staff",
      targets: [
        { category: "Revenue",                unit: "₹",  target: 80000, achieved: 52000, color: "bg-blue-500" },
        { category: "New Onboarded Clients",   unit: "",   target: 5,     achieved: 3,     color: "bg-emerald-500" },
        { category: "Lead Conversions",        unit: "",   target: 8,     achieved: 5,     color: "bg-amber-500" },
      ],
    },
    {
      name: "Amit Kumar", avatar: "AK", role: "Staff",
      targets: [
        { category: "Revenue",                unit: "₹",  target: 70000, achieved: 48000, color: "bg-blue-500" },
        { category: "New Onboarded Clients",   unit: "",   target: 4,     achieved: 2,     color: "bg-emerald-500" },
        { category: "Lead Conversions",        unit: "",   target: 6,     achieved: 3,     color: "bg-amber-500" },
      ],
    },
    {
      name: "Neha Gupta", avatar: "NG", role: "Accountant",
      targets: [
        { category: "Revenue",                unit: "₹",  target: 60000, achieved: 55000, color: "bg-blue-500" },
        { category: "Audits Completed",        unit: "",   target: 3,     achieved: 2,     color: "bg-emerald-500" },
        { category: "Lead Conversions",        unit: "",   target: 5,     achieved: 4,     color: "bg-amber-500" },
      ],
    },
  ],
  "Jun 2026": [
    {
      name: "Priya Sharma", avatar: "PS", role: "Staff",
      targets: [
        { category: "Revenue",                unit: "₹",  target: 75000, achieved: 78200, color: "bg-blue-500" },
        { category: "New Onboarded Clients",   unit: "",   target: 5,     achieved: 6,     color: "bg-emerald-500" },
        { category: "Lead Conversions",        unit: "",   target: 7,     achieved: 7,     color: "bg-amber-500" },
      ],
    },
    {
      name: "Amit Kumar", avatar: "AK", role: "Staff",
      targets: [
        { category: "Revenue",                unit: "₹",  target: 65000, achieved: 61000, color: "bg-blue-500" },
        { category: "New Onboarded Clients",   unit: "",   target: 4,     achieved: 3,     color: "bg-emerald-500" },
        { category: "Lead Conversions",        unit: "",   target: 6,     achieved: 5,     color: "bg-amber-500" },
      ],
    },
    {
      name: "Neha Gupta", avatar: "NG", role: "Accountant",
      targets: [
        { category: "Revenue",                unit: "₹",  target: 55000, achieved: 59000, color: "bg-blue-500" },
        { category: "Audits Completed",        unit: "",   target: 3,     achieved: 3,     color: "bg-emerald-500" },
        { category: "Lead Conversions",        unit: "",   target: 4,     achieved: 5,     color: "bg-amber-500" },
      ],
    },
  ],
};

// Clone Jun data for older months with minor variation
TARGET_DATA["May 2026"] = TARGET_DATA["Jun 2026"].map(e => ({
  ...e, targets: e.targets.map(t => ({ ...t, achieved: Math.round(t.achieved * 0.85) }))
}));
TARGET_DATA["Apr 2026"] = TARGET_DATA["Jun 2026"].map(e => ({
  ...e, targets: e.targets.map(t => ({ ...t, achieved: Math.round(t.achieved * 0.78) }))
}));

export const fmtTargetVal = (unit: string, val: number) =>
  unit === "₹" ? `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val}` : String(val);

export function overallScore(targets: TargetItem[]) {
  return Math.round(targets.reduce((a, t) => a + Math.min(100, (t.achieved / t.target) * 100), 0) / targets.length);
}

export function findEmployeeTarget(name: string, month = MONTHS[MONTHS.length - 1]) {
  return (TARGET_DATA[month] ?? []).find(e => e.name === name);
}
