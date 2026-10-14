import type { Metadata } from "next";
import { auth, signIn, signOut } from "@/lib/crm-nz/auth";
import { configured, resolveMember, CRM_PATH } from "@/lib/crm-nz/access";
import CrmWorkspace from "./workspace";
import styles from "./workspace.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "ORBIS · New Zealand Commercial Workspace",
  robots: { index: false, follow: false },
  alternates: { canonical: CRM_PATH },
};
export default async function CrmPage() {
  const ready = configured();
  const session = ready ? await auth() : null;
  let member;
  try {
    member = resolveMember(session?.user?.email, session?.user?.id);
  } catch {
    member = null;
  }
  if (!member)
    return (
      <main className={styles.login}>
        <p className={styles.eyebrow}>ORBIS / NEW ZEALAND</p>
        <h1>Commercial workspace.</h1>
        <p>Private access to the New Zealand commercial pilot.</p>
        {ready ? (
          <>
            <p>Sign in with an authorized Google account. Unauthorized accounts cannot access this workspace.</p>
            <form action={async () => {
              "use server";
              await signIn("google", { redirectTo: CRM_PATH });
            }}>
              <button>Continue with Google</button>
            </form>
          </>
        ) : (
          <p role="status">Private pilot. Authentication setup pending.</p>
        )}
      </main>
    );
  return (
    <CrmWorkspace
      member={member}
      logout={async () => {
        "use server";
        await signOut({ redirectTo: CRM_PATH });
      }}
    />
  );
}
