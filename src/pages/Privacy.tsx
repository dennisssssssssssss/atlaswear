import InfoPageLayout from "@/components/InfoPageLayout";
import { publicSupportEmail } from "@/config/site";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/use-page-meta";

const Privacy = () => {
  const { t } = useLanguage();

  usePageMeta({
    title: t("Privacy", "Confidentialitate"),
    description: t(
      "Learn what data the current ATLAS storefront uses, stores in the browser, and sends through order requests.",
      "Afla ce date foloseste storefront-ul ATLAS, ce stocheaza in browser si ce trimite prin solicitarile de comanda.",
    ),
    path: "/privacy",
  });

  return (
    <InfoPageLayout
      eyebrow={t("Privacy", "Confidentialitate")}
      title={t("Privacy policy", "Politica de confidentialitate")}
      intro={t(
        "This page explains the data flows currently used by the storefront in its present form.",
        "Aceasta pagina explica fluxurile de date folosite in prezent de magazin in forma lui actuala.",
      )}
    >
      <section className="rounded border border-border bg-surface p-6">
        <h2 className="font-heading text-2xl mb-4">
          {t("Data entered by customers", "Date introduse de clienti")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {t(
            "Customer details entered into the order form are only used to prepare an order request for the configured contact channel.",
            "Detaliile introduse in formularul de comanda sunt folosite doar pentru a pregati o solicitare de comanda catre canalul de contact configurat.",
          )}
        </p>
      </section>

      <section className="rounded border border-border bg-surface p-6">
        <h2 className="font-heading text-2xl mb-4">
          {t("Browser storage", "Stocare in browser")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {t(
            "The storefront stores cart contents, language preference, and currency preference in the browser to improve the shopping experience.",
            "Magazinul stocheaza in browser continutul cosului, limba selectata si moneda selectata pentru a imbunatati experienta de cumparare.",
          )}
        </p>
      </section>

      <section className="rounded border border-border bg-surface p-6">
        <h2 className="font-heading text-2xl mb-4">
          {t("Cookies and analytics", "Cookie-uri si analytics")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {t(
            "Any analytics or marketing tools connected to this storefront should be documented here before launch. At the moment, browser preferences are the main site-side storage used by the app.",
            "Orice tool de analytics sau marketing conectat la acest storefront trebuie documentat aici inainte de lansare. In prezent, preferintele salvate in browser sunt principala forma de stocare folosita de aplicatie.",
          )}
        </p>
      </section>

      <section className="rounded border border-border bg-surface p-6">
        <h2 className="font-heading text-2xl mb-4">
          {t("Contact about privacy", "Contact despre confidentialitate")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {publicSupportEmail
            ? t(
                "For privacy questions, use the same support inbox listed on the contact page.",
                "Pentru intrebari despre confidentialitate, foloseste acelasi inbox de suport listat in pagina de contact.",
              )
            : t(
                "A privacy contact inbox will be published before launch.",
                "Un inbox dedicat pentru confidentialitate va fi publicat inainte de lansare.",
              )}
        </p>
      </section>
    </InfoPageLayout>
  );
};

export default Privacy;
