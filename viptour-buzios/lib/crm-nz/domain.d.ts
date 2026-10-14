export type Role = "admin" | "ben" | "cassia";
export type Member = { email: string; role: Role; sub?: string };
export type Evidence = {
  kind: "web_missing" | "web_redesign" | "branding";
  url: string;
  note: string;
  observedAt: string;
};
export type LeadData = {
  placeId: string;
  businessName: string;
  website: string;
  contactEmail: string;
  phone: string;
  region: string;
  category: string;
  sourceUrl: string;
  sourceVerifiedAt: string;
  owner: "ben" | "cassia" | null;
  stage: string;
  nextStep: string;
  nextStepAt: string;
  proposalCents: number;
  evidence: Evidence[];
};
export type Lead = LeadData & {
  id: string;
  revision: number;
  createdAt: string;
  updatedAt: string;
  score: number;
  opportunities: string[];
  priority: string;
};
export type Activity = {
  id: string;
  leadId: string;
  actor: string;
  at: string;
  occurredAt: string;
  kind: string;
  note: string;
};
export type Transaction = {
  id: string;
  actor: string;
  at: string;
  kind: string;
  amountCents: number;
  occurredAt: string;
  note: string;
  leadId: string;
};
export type Finance = {
  revenue: number;
  cost: number;
  profit: number;
  distributable: number;
  founderShare: number;
  partnerShare: number;
  advanceDue: number;
  founderProfitDue: number;
  founderBalance: number;
  partnerDue: number;
  cash: number;
};
export type Snapshot = {
  leads: Lead[];
  activities: Activity[];
  transactions: Transaction[];
  finance: Finance | null;
};
declare const domain: {
  regions: string[];
  categories: string[];
  members(raw: string | undefined): Member[];
  member(
    raw: string | undefined,
    email: string | undefined | null,
    sub?: string,
  ): Member | null;
  googleAllowed(raw: string | undefined, profile: unknown): boolean;
  canRead(actor: Member, lead: Lead): boolean;
  finance(transactions: Transaction[]): Finance;
  snapshot(events: unknown[], actor: Member, now: number): Snapshot;
  command(
    events: unknown[],
    actor: Member,
    input: unknown,
    now: number,
  ): unknown;
};
export default domain;
