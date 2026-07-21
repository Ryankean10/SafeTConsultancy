export type Role = "admin" | "staff" | "client";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  job_title: string | null;
  phone: string | null;
  role: Role;
  created_at: string;
}

// ---- Leads / CRM (Milestone 2) ----------------------------------------------

export interface Contact {
  id: string;
  full_name: string;
  organisation: string | null;
  role_title: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  source: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

export type OpportunityStage =
  | "identified"
  | "contacted"
  | "qualified"
  | "proposal"
  | "won"
  | "lost"
  | "invoiced"
  | "paid";

export interface Opportunity {
  id: string;
  title: string;
  description: string | null;
  source_url: string | null;
  source: string | null;
  stage: OpportunityStage;
  estimated_value: number | null;
  currency: string | null;
  vessel_type: string | null;
  project_size: string | null;
  contact_id: string | null;
  owner: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type ActivityType = "note" | "call" | "email" | "meeting" | "stage_change";

export interface OpportunityActivity {
  id: string;
  opportunity_id: string;
  type: ActivityType;
  body: string | null;
  created_by: string | null;
  created_at: string;
}

export type TaskStatus = "open" | "done" | "cancelled";

export interface Task {
  id: string;
  opportunity_id: string | null;
  title: string;
  due_date: string | null;
  status: TaskStatus;
  assignee: string | null;
  created_by: string | null;
  created_at: string;
}

// Ordered stage list for consistent rendering across the UI.
export const STAGES: { value: OpportunityStage; label: string }[] = [
  { value: "identified", label: "Identified" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "proposal", label: "Proposal Sent" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
  { value: "invoiced", label: "Invoiced" },
  { value: "paid", label: "Paid" },
];

// The four active-pipeline stages shown as full kanban columns.
export const ACTIVE_STAGES: OpportunityStage[] = [
  "identified",
  "contacted",
  "qualified",
  "proposal",
];

// The closed/settled stages shown in the slimmer "closed" section.
export const CLOSED_STAGES: OpportunityStage[] = ["won", "lost", "invoiced", "paid"];

// "Open" = still in the active pipeline (used for dashboard counts).
export const OPEN_STAGES = ACTIVE_STAGES;

export const STAGE_LABELS: Record<OpportunityStage, string> = Object.fromEntries(
  STAGES.map((s) => [s.value, s.label])
) as Record<OpportunityStage, string>;

/**
 * Allowed forward transitions. 'won'/'lost' fork off 'proposal';
 * 'invoiced'/'paid' only ever follow 'won'; 'lost' and 'paid' are terminal.
 * You can never move from 'lost' into 'invoiced'.
 */
export const STAGE_TRANSITIONS: Record<OpportunityStage, OpportunityStage[]> = {
  identified: ["contacted", "lost"],
  contacted: ["qualified", "lost"],
  qualified: ["proposal", "lost"],
  proposal: ["won", "lost"],
  won: ["invoiced", "lost"],
  invoiced: ["paid"],
  lost: [],
  paid: [],
};

export function canTransition(from: OpportunityStage, to: OpportunityStage): boolean {
  return STAGE_TRANSITIONS[from]?.includes(to) ?? false;
}
