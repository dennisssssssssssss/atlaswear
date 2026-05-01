import InfoPageLayout from "@/components/InfoPageLayout";
import { publicSupportEmail, siteConfig } from "@/config/site";
import { usePageMeta } from "@/hooks/use-page-meta";

const privacyContact =
  publicSupportEmail || siteConfig.contact.whatsappNumber || "WhatsApp";

const Privacy = () => {
  usePageMeta({
    title: "Politica de confidentialitate",
    description:
      "Informatii despre datele folosite pentru comenzi, contact si drepturile GDPR.",
    path: "/politica-confidentialitate",
  });

  return (
    <InfoPageLayout
      eyebrow="Confidentialitate"
      title="Politica de confidentialitate"
      intro="Aceasta politica explica ce date folosim cand ne contactezi, cand ceri informatii despre un produs sau cand confirmi o comanda."
    >
      <section className="rounded border border-border bg-surface p-6">
        <h2 className="mb-4 font-heading text-2xl">Ce date colectam</h2>
        <p className="leading-8 text-muted-foreground">
          Putem primi numele tau, numarul de telefon, adresa de livrare,
          produsele comandate, marimea aleasa si mesajele trimise pe WhatsApp,
          Telegram sau alte canale de contact folosite pentru comanda. Site-ul
          poate salva in browser limba, moneda si preferintele de navigare,
          ca sa nu le alegi de fiecare data.
        </p>
      </section>

      <section className="rounded border border-border bg-surface p-6">
        <h2 className="mb-4 font-heading text-2xl">De ce le folosim</h2>
        <p className="leading-8 text-muted-foreground">
          Datele sunt folosite pentru confirmarea comenzii, livrare, comunicare
          despre stoc, retururi si suport. Nu vindem datele tale si nu le folosim
          pentru mesaje fara legatura cu solicitarea ta.
        </p>
      </section>

      <section className="rounded border border-border bg-surface p-6">
        <h2 className="mb-4 font-heading text-2xl">Cat timp le pastram</h2>
        <p className="leading-8 text-muted-foreground">
          Pastram datele cat este necesar pentru procesarea comenzii, retur,
          garantie, evidenta contabila si obligatiile legale aplicabile. Mesajele
          de suport pot fi pastrate atat timp cat este nevoie ca sa putem urmari
          istoricul unei comenzi.
        </p>
      </section>

      <section className="rounded border border-border bg-surface p-6">
        <h2 className="mb-4 font-heading text-2xl">Drepturile tale</h2>
        <p className="leading-8 text-muted-foreground">
          Ai dreptul sa ceri acces la datele tale, corectarea lor, stergerea lor,
          restrictionarea prelucrarii, portarea datelor sau opozitia fata de
          prelucrare, in limitele prevazute de GDPR. Pentru orice cerere legata
          de date, contacteaza-ne prin {privacyContact}.
        </p>
      </section>
    </InfoPageLayout>
  );
};

export default Privacy;
