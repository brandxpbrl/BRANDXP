import type { Metadata } from "next";
import styles from "../workspace.module.css";
export const metadata: Metadata = {
  title: "CRM NZ · Privacidad",
  robots: { index: false, follow: false },
};
export default function PrivacyPage() {
  return (
    <main className={styles.login}>
      <h1>CRM NZ · Privacidad y condiciones</h1>
      <p>
        Este piloto privado de Brand Experience permite únicamente a usuarios
        autorizados gestionar oportunidades comerciales de Nueva Zelanda.
      </p>
      <p>
        La captación utiliza Google Places. Sus resultados se muestran
        temporalmente en memoria del navegador, con atribución de Google Maps, y
        se eliminan de la vista a los cinco minutos. No se guardan nombres,
        direcciones, reseñas ni otros contenidos de Places. Sólo el Place ID
        puede conservarse. Verifica la ubicación en Nueva Zelanda antes de
        registrar una oportunidad.
      </p>
      <p>
        Los contactos y las evidencias se introducen desde fuentes
        independientes, con URL y fecha de verificación. Guarda sólo información
        necesaria para la relación comercial. La copia privada de Google Sheets
        NZ conserva fichas, responsables e historial de operaciones; el CRM
        original no se modifica.
      </p>
      <p>
        Los puntos priorizan observaciones humanas vigentes durante 90 días. No
        certifican hechos automáticamente. Gemini es opcional: cuando se activa,
        recibe únicamente las evidencias seleccionadas y produce borradores
        sujetos a revisión humana.
      </p>
      <p>
        El administrador controla acceso, retención y eliminación mediante un
        proceso privado con el propietario del Sheet. Para una solicitud de
        acceso o eliminación, contacta a tu administrador del piloto.
      </p>
      <p>
        El uso de Places está sujeto a las{" "}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
        >
          condiciones de Google
        </a>{" "}
        y a su{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
        >
          política de privacidad
        </a>
        .
      </p>
      <a href="/brandexperience/crm-nz">Volver al CRM</a>
    </main>
  );
}
