import InfoPageLayout from "@/components/InfoPageLayout";
import { siteConfig } from "@/config/site";
import { usePageMeta } from "@/hooks/use-page-meta";

const Terms = () => {
  usePageMeta({
    title: "Termeni si conditii",
    description:
      "Termeni pentru comenzi, preturi, disponibilitate, livrare si retur.",
    path: "/terms",
  });

  return (
    <InfoPageLayout
      eyebrow="Legal"
      title="Termeni si conditii"
      intro="Folosirea site-ului inseamna ca esti de acord cu modul in care afisam produsele, confirmam comenzile si comunicam livrarea."
    >
      <section className="rounded border border-border bg-surface p-6">
        <h2 className="mb-4 font-heading text-2xl">Comenzi</h2>
        <p className="leading-8 text-muted-foreground">
          O comanda este considerata confirmata doar dupa discutia pe WhatsApp
          sau Telegram. Inainte de expediere confirmam produsul, marimea, pretul,
          adresa si costul transportului.
        </p>
      </section>

      <section className="rounded border border-border bg-surface p-6">
        <h2 className="mb-4 font-heading text-2xl">Preturi si stoc</h2>
        <p className="leading-8 text-muted-foreground">
          Preturile si disponibilitatea pot fi actualizate. Daca un produs nu
          mai este disponibil sau apare o eroare clara de pret, iti spunem inainte
          sa confirmam comanda.
        </p>
      </section>

      <section className="rounded border border-border bg-surface p-6">
        <h2 className="mb-4 font-heading text-2xl">Livrare, plata si retur</h2>
        <p className="leading-8 text-muted-foreground">
          Plata se face doar ramburs la livrare. Livrarea si retururile urmeaza
          politicile publicate pe site, iar orice exceptie se confirma in scris
          inainte de expediere.
        </p>
      </section>

      <section className="rounded border border-border bg-surface p-6">
        <h2 className="mb-4 font-heading text-2xl">Continut</h2>
        <p className="leading-8 text-muted-foreground">
          {siteConfig.brandName} pastreaza drepturile asupra textelor, structurii
          site-ului si elementelor de brand. Fotografiile produselor sunt folosite
          pentru prezentarea produselor listate.
        </p>
      </section>
    </InfoPageLayout>
  );
};

export default Terms;
