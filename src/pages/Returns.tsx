import InfoPageLayout from "@/components/InfoPageLayout";
import { siteConfig } from "@/config/site";
import { usePageMeta } from "@/hooks/use-page-meta";

const Returns = () => {
  usePageMeta({
    title: "Politica de retur",
    description:
      "Retur in 14 zile de la livrare pentru produse nefolosite, in ambalajul original.",
    path: "/politica-retur",
  });

  return (
    <InfoPageLayout
      eyebrow="Retur"
      title="Politica de retur"
      intro="Returul este posibil in 14 zile de la data livrarii. Produsul trebuie trimis inapoi nefolosit, fara urme de purtare, in ambalajul original si cu accesoriile primite, daca exista."
    >
      <section className="rounded border border-border bg-surface p-6">
        <p className="leading-8 text-muted-foreground">
          Pentru a incepe returul, scrie-ne pe WhatsApp si trimite numele
          produsului, data livrarii si motivul returului. Iti confirmam adresa
          de retur si pasii urmatori inainte sa trimiti coletul.
        </p>
        <p className="mt-5 leading-8 text-muted-foreground">
          Dupa ce primim produsul si verificam starea lui, rambursarea se face
          in maximum 5 zile lucratoare. Daca produsul este folosit, deteriorat
          sau nu mai are ambalajul original, returul poate fi refuzat.
        </p>
        <p className="mt-5 text-sm text-gold">
          Perioada de retur: {siteConfig.returns.windowDays} zile de la livrare.
        </p>
      </section>
    </InfoPageLayout>
  );
};

export default Returns;
