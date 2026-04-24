import InfoPageLayout from "@/components/InfoPageLayout";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/use-page-meta";

const Terms = () => {
  const { t } = useLanguage();

  usePageMeta({
    title: t("Terms", "Termeni"),
    description: t(
      "Read the storefront terms covering orders, pricing, availability, shipping, returns, and acceptable use.",
      "Citeste termenii magazinului despre comenzi, preturi, disponibilitate, livrare, retururi si utilizare acceptata.",
    ),
    path: "/terms",
  });

  return (
    <InfoPageLayout
      eyebrow={t("Legal", "Legal")}
      title={t("Terms and conditions", "Termeni si conditii")}
      intro={t(
        "These terms describe how the storefront currently handles browsing, orders, and support.",
        "Acesti termeni descriu modul in care magazinul gestioneaza in prezent navigarea, comenzile si suportul.",
      )}
    >
      <section className="rounded border border-border bg-surface p-6">
        <h2 className="font-heading text-2xl mb-4">
          {t("Orders", "Comenzi")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {t(
            "Orders submitted through the storefront are treated as requests until they are received through the configured channel and confirmed by the brand.",
            "Comenzile trimise prin storefront sunt tratate ca solicitari pana cand sunt primite prin canalul configurat si confirmate de brand.",
          )}
        </p>
      </section>

      <section className="rounded border border-border bg-surface p-6">
        <h2 className="font-heading text-2xl mb-4">
          {t("Pricing and availability", "Preturi si disponibilitate")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {t(
            "Prices and product availability may change without prior notice. Obvious errors or outdated stock information can be corrected before an order is confirmed.",
            "Preturile si disponibilitatea produselor se pot schimba fara notificare prealabila. Erorile evidente sau informatiile de stoc neactualizate pot fi corectate inainte ca o comanda sa fie confirmata.",
          )}
        </p>
      </section>

      <section className="rounded border border-border bg-surface p-6">
        <h2 className="font-heading text-2xl mb-4">
          {t("Shipping and returns", "Livrare si retururi")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {t(
            "Shipping and returns follow the separate information pages published on this storefront.",
            "Livrarea si retururile urmeaza paginile separate de informatii publicate pe acest storefront.",
          )}
        </p>
      </section>

      <section className="rounded border border-border bg-surface p-6">
        <h2 className="font-heading text-2xl mb-4">
          {t("Storefront use", "Utilizarea magazinului")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {t(
            "You agree not to misuse the website, interfere with its operation, or attempt to access data that does not belong to you.",
            "Esti de acord sa nu folosesti abuziv website-ul, sa nu ii afectezi functionarea si sa nu incerci sa accesezi date care nu iti apartin.",
          )}
        </p>
      </section>

      <section className="rounded border border-border bg-surface p-6">
        <h2 className="font-heading text-2xl mb-4">
          {t("Brand ownership", "Proprietatea brandului")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {siteConfig.brandName}{" "}
          {t(
            "retains ownership over its branding, product photography, copy, and storefront content unless stated otherwise.",
            "isi pastreaza proprietatea asupra brandingului, fotografiilor de produs, textelor si continutului din storefront, cu exceptia cazurilor mentionate altfel.",
          )}
        </p>
      </section>
    </InfoPageLayout>
  );
};

export default Terms;
