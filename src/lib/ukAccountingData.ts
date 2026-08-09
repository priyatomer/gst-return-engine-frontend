export interface UKSubService {
  slug: string;
  title: string;
  desc: string;
}

export interface UKService {
  slug: string;
  title: string;
  desc: string;
  points: string[];
  subServices?: UKSubService[];
}

export const UK_ACCOUNTING_SERVICES: UKService[] = [
  {
    slug: "daily-bookkeeping",
    title: "Daily Bookkeeping",
    desc: "Accurate, up-to-date books maintained every day so you always know exactly where your business stands.",
    points: [
      "Real-time recording of every transaction, not just a monthly catch-up",
      "Cloud accounting software setup and ongoing management (Xero, QuickBooks, Sage)",
      "Clean, audit-ready books handed straight to your accountant at year end",
    ],
    subServices: [
      {
        slug: "invoice-processing",
        title: "Invoice Processing",
        desc: "Sales and purchase invoices recorded accurately and matched to your accounting system in real time.",
      },
      {
        slug: "bank-reconciliation",
        title: "Bank Reconciliation",
        desc: "Bank statements reconciled against your books on a regular schedule to catch discrepancies early.",
      },
      {
        slug: "aged-payable-aged-receivable-reports",
        title: "Aged Payable / Aged Receivable Reports",
        desc: "Clear visibility into what you owe and what's owed to you, broken down by how overdue it is.",
      },
      {
        slug: "monthly-financial-reports",
        title: "Monthly Financial Reports",
        desc: "Monthly summaries of income, expenses, and cash position so you can make informed decisions.",
      },
    ],
  },
  {
    slug: "financial-reporting",
    title: "Financial Reporting",
    desc: "Clear, timely financial statements and management reports that give you real visibility into performance.",
    points: [
      "Profit & loss, balance sheet, and cash flow statements prepared on schedule",
      "Management reports tailored to what matters for your business decisions",
      "Year-end statutory accounts prepared in full compliance with UK GAAP",
    ],
  },
  {
    slug: "vat-returns",
    title: "VAT Returns",
    desc: "End-to-end VAT return preparation and HMRC submission, calculated accurately and filed before every deadline.",
    points: [
      "Making Tax Digital (MTD) compliant VAT filing",
      "VAT scheme reviews to ensure you're on the most efficient scheme",
      "Deadline tracking so a return is never late or missed",
    ],
  },
  {
    slug: "payroll-services",
    title: "Payroll Services",
    desc: "Complete payroll processing — payslips, PAYE, pensions, and HMRC submissions — handled accurately and on time.",
    points: [
      "Weekly, fortnightly, or monthly payroll runs with digital payslips",
      "PAYE, National Insurance, and auto-enrolment pension compliance",
      "Real Time Information (RTI) submissions to HMRC on every pay run",
    ],
  },
  {
    slug: "personal-tax-returns",
    title: "Personal Tax Returns",
    desc: "Self-assessment tax returns prepared and filed on your behalf, maximising reliefs and avoiding HMRC penalties.",
    points: [
      "Self-assessment preparation for individuals, sole traders, and directors",
      "Tax-efficient planning around allowances, reliefs, and dividends",
      "Direct HMRC filing well ahead of the 31 January deadline",
    ],
  },
];

export function getUKService(slug: string): UKService | undefined {
  return UK_ACCOUNTING_SERVICES.find(s => s.slug === slug);
}

export function getUKSubService(serviceSlug: string, subSlug: string): UKSubService | undefined {
  return getUKService(serviceSlug)?.subServices?.find(s => s.slug === subSlug);
}
