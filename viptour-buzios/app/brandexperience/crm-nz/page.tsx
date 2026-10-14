import type { Metadata } from "next";
import { auth, signIn, signOut } from "@/lib/crm-nz/auth";
import { configured, resolveMember, CRM_PATH } from "@/lib/crm-nz/access";
import CrmWorkspace from "./workspace";
import styles from "./workspace.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "ORBIS · New Zealand CRM",
  robots: { index: false, follow: false },
  alternates: { canonical: CRM_PATH },
};

const demoLeads = [
  { name: "Harbour View Lodge", sector: "Hospitality", location: "Auckland", stage: "New", priority: "High", opportunity: "Website redesign" },
  { name: "Southern Coast Adventures", sector: "Tourism", location: "Wellington", stage: "Contacted", priority: "High", opportunity: "Brand identity" },
  { name: "Fern & Stone Studio", sector: "Retail", location: "Christchurch", stage: "Meeting", priority: "Medium", opportunity: "Digital presence" },
  { name: "Pacific Table", sector: "Restaurant", location: "Tauranga", stage: "Proposal", priority: "Medium", opportunity: "Website development" },
];

function DemoWorkspace() {
  return (
    <main className={styles.demoShell}>
      <aside className={styles.demoSidebar}>
        <div className={styles.demoBrand}><span className={styles.demoMark}>✳</span><div><strong>ORBIS</strong><small>EVERYTHING, CONNECTED.</small></div></div>
        <p className={styles.demoNavTitle}>WORKSPACE</p>
        <nav aria-label="Demo navigation">
          <a href="#overview">◈ &nbsp; Overview</a>
          <a href="#pipeline">▦ &nbsp; Pipeline</a>
          <a href="#leads">◎ &nbsp; Leads</a>
          <a href="#integrations">◇ &nbsp; Integrations</a>
        </nav>
        <div className={styles.demoSidebarBottom}>NEW ZEALAND <span>·</span> CRM PILOT</div>
      </aside>
      <div className={styles.demoMain}>
        <header className={styles.demoTopbar}><span>ORBIS <span className={styles.demoDim}>/</span> NEW ZEALAND <span className={styles.demoDim}>/</span> CRM</span><span className={styles.demoDemoTag}>DEMO · SAMPLE DATA</span></header>
        <section id="overview" className={styles.demoHero}>
          <p className={styles.demoKicker}>COMMERCIAL INTELLIGENCE / NZ</p>
          <h1>Every opportunity.<br /><em>One connected system.</em></h1>
          <p>Your commercial workspace for leads, relationships and growth across New Zealand.</p>
        </section>
        <section className={styles.demoMetrics} aria-label="Sample metrics">
          <article><small>ACTIVE LEADS</small><strong>24</strong><span>Sample pipeline</span></article>
          <article><small>IN PROGRESS</small><strong>12</strong><span>Active conversations</span></article>
          <article><small>PROPOSALS</small><strong>05</strong><span>Awaiting response</span></article>
          <article><small>WON DEALS</small><strong>03</strong><span>Demo results</span></article>
        </section>
        <section id="pipeline" className={styles.demoSection}>
          <div className={styles.demoSectionHead}><div><p className={styles.demoKicker}>SALES JOURNEY</p><h2>Opportunity pipeline</h2></div><span>ILLUSTRATIVE DATA</span></div>
          <div className={styles.demoPipeline}>
            {["New", "Contacted", "Meeting", "Proposal", "Won"].map((stage, i) => (
              <div key={stage} className={styles.demoStage}><small>{stage}</small><strong>{[8, 7, 5, 3, 1][i]}</strong><div className={styles.demoBar}><span style={{width: [80,70,50,30,10][i] + "%"}} /></div></div>
            ))}
          </div>
        </section>
        <section id="leads" className={styles.demoSection}>
          <div className={styles.demoSectionHead}><div><p className={styles.demoKicker}>RELATIONSHIP MANAGEMENT</p><h2>Lead directory</h2></div><span>4 SAMPLE RECORDS</span></div>
          <div className={styles.demoTableWrap}><table className={styles.demoTable}><thead><tr><th>BUSINESS</th><th>LOCATION</th><th>OPPORTUNITY</th><th>STATUS</th><th>PRIORITY</th></tr></thead><tbody>{demoLeads.map(lead => <tr key={lead.name}><td><strong>{lead.name}</strong><small>{lead.sector}</small></td><td>{lead.location}</td><td>{lead.opportunity}</td><td><span className={styles.demoStatus}>{lead.stage}</span></td><td>{lead.priority}</td></tr>)}</tbody></table></div>
        </section>
        <section id="integrations" className={styles.demoSection}><div className={styles.demoSectionHead}><div><p className={styles.demoKicker}>CONNECTED ECOSYSTEM</p><h2>Integrations</h2></div></div><div className={styles.demoIntegrations}><article><strong>Google Sheets</strong><span>Private data store · Not connected in demo</span></article><article><strong>Google Places</strong><span>Business discovery · Not connected in demo</span></article><article><strong>Gemini AI</strong><span>Evidence assistance · Not connected in demo</span></article></div></section>
        <footer className={styles.demoFooter}>ORBIS · NEW ZEALAND &nbsp; / &nbsp; VISUAL DEMONSTRATION ONLY · NO REAL CLIENT DATA</footer>
      </div>
    </main>
  );
}

export default async function CrmPage({ searchParams }: { searchParams: Promise<{ demo?: string }> }) {
  const params = await searchParams;
  const ready = configured();
  const session = ready ? await auth() : null;
  let member;
  try {
    member = resolveMember(session?.user?.email, session?.user?.id);
  } catch {
    member = null;
  }
  if (member) return <CrmWorkspace member={member} logout={async () => { "use server"; await signOut({ redirectTo: CRM_PATH }); }} />;
  if (params.demo === "1") return <DemoWorkspace />;
  return <main className={styles.login}><div className={styles.loginWatermark} aria-hidden="true"><span className={styles.watermarkOrbitOuter} /><span className={styles.watermarkOrbitInner} /><span className={styles.watermarkCore} /><span className={styles.watermarkWord}>ORBIS</span></div><div className={styles.loginContent}><p className={styles.eyebrow}>ORBIS / NEW ZEALAND</p><h1>Commercial workspace.</h1><p>Private access to the New Zealand commercial pilot.</p>{ready ? <><p>Sign in with an authorized Google account.</p><form action={async () => { "use server"; await signIn("google", { redirectTo: CRM_PATH }); }}><button>Continue with Google</button></form></> : <p role="status">Private pilot. Authentication setup pending.</p>}</div></main>;
}
