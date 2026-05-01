import { MessageCircle, Send } from "lucide-react";

import InfoPageLayout from "@/components/InfoPageLayout";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { usePageMeta } from "@/hooks/use-page-meta";

const whatsappNumber =
  siteConfig.contact.whatsappNumber.replace(/[^\d]/g, "") || "40700000000";
const whatsappHref = `https://wa.me/${whatsappNumber}`;
const telegramHref = "https://t.me/atlaswear";

const Contact = () => {
  usePageMeta({
    title: "Contact",
    description:
      "Contact ATLAS pentru comenzi, confirmare stoc, marimi si livrare.",
    path: "/contact",
  });

  return (
    <InfoPageLayout
      eyebrow="Contact"
      title="Comenzi si intrebari"
      intro="Comenzile se confirma prin mesaj. Trimite produsul, marimea si orasul de livrare, iar noi verificam stocul si raspundem cu pasii urmatori."
    >
      <section className="rounded border border-border bg-surface p-6">
        <h2 className="mb-4 font-heading text-2xl">Scrie-ne direct</h2>
        <p className="leading-8 text-muted-foreground">
          Raspundem de obicei in aceeasi zi. Inainte sa trimitem coletul,
          confirmam produsul, pretul, marimea si costul transportului.
        </p>
        <p className="mt-4 text-sm font-medium text-gold">
          Plata se face doar prin ramburs la livrare.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button asChild variant="gold" size="lg" className="w-full">
            <a href={whatsappHref} target="_blank" rel="noreferrer">
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </Button>
          <Button asChild variant="gold-outline" size="lg" className="w-full">
            <a href={telegramHref} target="_blank" rel="noreferrer">
              <Send size={18} />
              Telegram
            </a>
          </Button>
        </div>
      </section>

      <section className="rounded border border-border bg-surface p-6">
        <h2 className="mb-4 font-heading text-2xl">Cum merge comanda</h2>
        <p className="leading-8 text-muted-foreground">
          Ne trimiti produsul dorit, verificam disponibilitatea si iti confirmam
          totalul inainte de expediere. Daca ai nevoie de poze suplimentare sau
          de verificare pe marime, cere-le in mesaj si le discutam inainte sa
          plece coletul.
        </p>
      </section>
    </InfoPageLayout>
  );
};

export default Contact;
