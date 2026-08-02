import type { Metadata } from "next";
import FeeSheetClient from "@/components/FeeSheet/FeeSheetClient";

export const metadata: Metadata = {
  title: "GST Fee Sheet | Bhandari & Co.",
  description: "Generate professional GST service fee invoices.",
};

export default function FeeSheetPage() {
  return <FeeSheetClient />;
}
