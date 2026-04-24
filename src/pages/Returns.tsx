import InfoPageLayout from "@/components/InfoPageLayout";
import { publicSupportEmail, siteConfig } from "@/config/site";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/use-page-meta";

const Returns = () => {
  const { t } = useLanguage();

  usePageMeta({
    title: t("Returns", "Retururi"),
    description: t(
      "Review the current ATLAS return window, item conditions, and support process.",
      "Vezi fereastra actuala de retur ATLAS, conditiile produselor si procesul de suport.",
    ),
    path: "/returns",
  });

  return (
    <InfoPageLayout
      eyebrow={t("Returns", "Retur")}
      title={t("Returns and exchanges", "Retururi si schimburi")}
      intro={t(
        "This page explains the current storefront policy for requesting a return or exchange.",
        "Aceasta pagina explica politica actuala a magazinului pentru solicitarea unui retur sau schimb.",
      )}
    >
      <section className="rounded border border-border bg-surface p-6">
        <h2 className="font-heading text-2xl mb-4">
          {t("Return window", "Perioada de retur")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {t(
            "Return requests should be made within",
            "Solicitarile de retur trebuie facute in maximum",
          )}{" "}
          {siteConfig.returns.windowDays}{" "}
          {t("days from delivery.", "zile de la livrare.")}
        </p>
      </section>

      <section className="rounded border border-border bg-surface p-6">
        <h2 className="font-heading text-2xl mb-4">
          {t("Item condition", "Starea produsului")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {siteConfig.returns.conditionNote}
        </p>
      </section>

      <section className="rounded border border-border bg-surface p-6">
        <h2 className="font-heading text-2xl mb-4">
          {t("Items that may not be accepted", "Produse care pot fi refuzate")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {siteConfig.returns.exclusionNote}
        </p>
      </section>

      <section className="rounded border border-border bg-surface p-6">
        <h2 className="font-heading text-2xl mb-4">
          {t("How to start a return", "Cum incepi un retur")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {publicSupportEmail
            ? t(
                "Send your order details, the items you want to return, and the reason for the request to our support inbox.",
                "Trimite la suport detaliile comenzii, produsele pe care vrei sa le returnezi si motivul solicitarii.",
              )
            : t(
                "The returns contact channel is being configured and will be published before launch.",
                "Canalul de contact pentru retururi este in curs de configurare si va fi publicat inainte de lansare.",
              )}
        </p>
      </section>
    </InfoPageLayout>
  );
};

export default Returns;
