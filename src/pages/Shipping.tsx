import InfoPageLayout from "@/components/InfoPageLayout";
import { publicSupportEmail, siteConfig } from "@/config/site";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/use-page-meta";

const Shipping = () => {
  const { t } = useLanguage();

  usePageMeta({
    title: t("Shipping", "Livrare"),
    description: t(
      "Read the current ATLAS shipping timelines, processing windows, and delivery notes.",
      "Citeste timpii actuali de livrare ATLAS, ferestrele de procesare si notele de expediere.",
    ),
    path: "/shipping",
  });

  return (
    <InfoPageLayout
      eyebrow={t("Delivery", "Livrare")}
      title={t("Shipping information", "Informatii de livrare")}
      intro={t(
        "These timelines are the current storefront estimates for shipping and handling.",
        "Aceste intervale sunt estimarile actuale ale magazinului pentru procesare si livrare.",
      )}
    >
      <section className="rounded border border-border bg-surface p-6">
        <h2 className="font-heading text-2xl mb-4">
          {t("Processing", "Procesare")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {t(
            "Orders are usually prepared within",
            "Comenzile sunt de obicei pregatite in",
          )}{" "}
          {siteConfig.shipping.processingWindow}.
        </p>
      </section>

      <section className="rounded border border-border bg-surface p-6">
        <h2 className="font-heading text-2xl mb-4">
          {t("Estimated delivery windows", "Intervale estimate de livrare")}
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
          <li>
            {t("Romania", "Romania")}: {siteConfig.shipping.romaniaWindow}
          </li>
          <li>
            {t("International", "International")}:{" "}
            {siteConfig.shipping.internationalWindow}
          </li>
        </ul>
      </section>

      <section className="rounded border border-border bg-surface p-6">
        <h2 className="font-heading text-2xl mb-4">
          {t("Customs and taxes", "Taxe si taxe vamale")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {siteConfig.shipping.dutiesNote}
        </p>
      </section>

      <section className="rounded border border-border bg-surface p-6">
        <h2 className="font-heading text-2xl mb-4">
          {t("Tracking and delivery issues", "Tracking si probleme de livrare")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {publicSupportEmail
            ? t(
                "If your shipment is delayed or arrives with an issue, contact support and include your order details.",
                "Daca livrarea intarzie sau ajunge cu o problema, contacteaza suportul si include detaliile comenzii.",
              )
            : t(
                "Tracking support will be published here as soon as the support inbox is configured.",
                "Suportul pentru tracking va fi publicat aici imediat ce inboxul de suport este configurat.",
              )}
        </p>
      </section>
    </InfoPageLayout>
  );
};

export default Shipping;
