import type { Metadata } from "next";
import { auth, signIn, signOut } from "@/lib/crm-nz/auth";
import { configured, resolveMember, CRM_PATH } from "@/lib/crm-nz/access";
import CrmWorkspace from "./workspace";
import styles from "./workspace.module.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Brand Experience · CRM NZ",
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
        <p className={styles.eyebrow}>BRAND EXPERIENCE / NEW ZEALAND</p>
        <h1>Commercial workspace.</h1>
        <p>Acceso privado para el piloto comercial de Nueva Zelanda.</p>
        {ready ? (
          <>
            <p>
              Utiliza una cuenta Google autorizada. Las cuentas sin autorización
              no pueden acceder.
            </p>
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: CRM_PATH });
              }}
            >
              <button>Continuar con Google</button>
            </form>
          </>
        ) : (
          <p role="status">
            Piloto cerrado. Autenticación pendiente de configuración privada.
          </p>
        )}
        <a href="/brand-experience">Brand Experience ↗</a>
        <a
          href="https://www.riovibestransfer.com/brand-experience"
          target="_blank"
          rel="noopener noreferrer"
        >
          Portafolio RioVibesTransfer ↗
        </a>
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
