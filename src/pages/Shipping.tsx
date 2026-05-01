import InfoPageLayout from "@/components/InfoPageLayout";
import { usePageMeta } from "@/hooks/use-page-meta";

const Shipping = () => {
  usePageMeta({
    title: "Politica de livrare",
    description:
      "Livrare prin Fan Courier sau Cargus, plata ramburs si confirmare pe WhatsApp inainte de expediere.",
    path: "/politica-livrare",
  });

  return (
    <InfoPageLayout
      eyebrow="Livrare"
      title="Politica de livrare"
      intro="Livram prin Fan Courier sau Cargus, de obicei in 2-4 zile lucratoare din momentul in care comanda este confirmata. Inainte sa trimitem coletul, confirmam fiecare comanda pe WhatsApp: produs, marime, pret si adresa."
    >
      <section className="rounded border border-border bg-surface p-6">
        <p className="leading-8 text-muted-foreground">
          Momentan plata se face doar ramburs, la livrare. Nu avem plata online
          activa si nu cerem avans pentru comenzile standard.
        </p>
        <p className="mt-5 leading-8 text-muted-foreground">
          Costul transportului este comunicat la confirmarea comenzii, inainte
          sa plece coletul. Daca un produs are nevoie de verificare suplimentara
          de stoc sau marime, iti spunem clar inainte sa confirmam expedierea.
        </p>
      </section>
    </InfoPageLayout>
  );
};

export default Shipping;
