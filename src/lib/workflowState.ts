export interface LeadWorkflow {
  stage: number; // 0=Lead Created, 1=Fee Sheet Generated, 2=Complete
  feeSheetNo?: string;
}

const WF_KEY = "bc_lead_workflow_v1";

// Default stages for demo leads (seeds the first load)
export const DEFAULT_STAGES: Record<number, LeadWorkflow> = {
  5:  { stage: 2, feeSheetNo: "BC-GST-2606-085" }, // Mohan Lal - Converted
  4:  { stage: 1, feeSheetNo: "BC-GST-2606-091" }, // Anita - Fee sheet done
  3:  { stage: 1, feeSheetNo: "BC-GST-2606-090" }, // Vikram - Fee sheet done
  10: { stage: 1 },                                 // Deepa - Fee sheet done
};

export function getWorkflowState(): Record<string, LeadWorkflow> {
  if (typeof window === "undefined") return {};
  try {
    const stored = JSON.parse(localStorage.getItem(WF_KEY) || "null");
    if (!stored) {
      // Seed defaults on first load
      const defaults: Record<string, LeadWorkflow> = {};
      Object.entries(DEFAULT_STAGES).forEach(([k, v]) => { defaults[k] = v; });
      localStorage.setItem(WF_KEY, JSON.stringify(defaults));
      return defaults;
    }
    return stored;
  } catch { return {}; }
}

export function setLeadWorkflow(leadId: number, data: Partial<LeadWorkflow>) {
  const state = getWorkflowState();
  const existing = state[leadId] ?? { stage: 0 };
  state[leadId] = { ...existing, ...data };
  localStorage.setItem(WF_KEY, JSON.stringify(state));
  return state[leadId];
}

export const WORKFLOW_STEPS = ["Lead Created", "Fee Sheet Generated", "Complete"];
