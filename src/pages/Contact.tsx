import InfoPageLayout from "@/components/InfoPageLayout";
import { publicOrderEmail, publicSupportEmail, siteConfig } from "@/config/site";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/use-page-meta";

const Contact = () => {
  const { t } = useLanguage();
  const activeSocials = siteConfig.socialLinks.filter((link) => Boolean(link.url));

  usePageMeta({
    title: t("Contact", "Contact"),
    description: t(
      "Reach ATLAS for support, order questions, and shipping updates.",
      "Ia legatura cu ATLAS pentru suport, intrebari despre comenzi si actualizari de livrare.",
    ),
    path: "/contact",
  });

  return (
    <InfoPageLayout
      eyebrow={t("Support", "Suport")}
      title={t("Contact ATLAS", "Contact ATLAS")}
      intro={t(
        "Use this page for customer care, order questions, and delivery support.",
        "Foloseste aceasta pagina pentru asistenta clienti, intrebari despre comenzi si suport de livrare.",
      )}
    >
      <section className="rounded border border-border bg-surface p-6">
        <h2 className="font-heading text-2xl mb-3">
          {t("Customer care", "Asistenta clienti")}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {publicSupportEmail
            ? t(
                "For general support, write to the inbox below and we will get back to you as soon as possible.",
                "Pentru suport general, scrie-ne la adresa de mai jos si iti raspundem cat mai repede.",
              )
            : t(
                "The support inbox is being configured and will be published before launch.",
                "Inboxul de suport este in curs de configurare si va fi publicat inainte de lansare.",
              )}
        </p>
        {publicSupportEmail ? (
          <a
            href={`mailto:${publicSupportEmail}`}
            className="inline-flex mt-4 text-gold hover:text-gold-light transition-colors"
          >
            {publicSupportEmail}
          </a>
        ) : null}
      </section>

      <section className="rounded border border-border bg-surface p-6">
        <h2 className="font-heading text-2xl mb-3">
          {t("Order channels", "Canale de comanda")}
        </h2>
        <div className="space-y-3 text-muted-foreground leading-relaxed">
          {siteConfig.contact.whatsappNumber ? (
            <p>
              {t("WhatsApp", "WhatsApp")}: {siteConfig.contact.whatsappNumber}
            </p>
          ) : null}
          {publicOrderEmail ? (
            <p>
              {t("Order email", "Email comenzi")}:{" "}
              <a
                href={`mailto:${publicOrderEmail}`}
                className="text-gold hover:text-gold-light transition-colors"
              >
                {publicOrderEmail}
              </a>
            </p>
          ) : null}
          {!siteConfig.contact.whatsappNumber && !publicOrderEmail ? (
            <p>
              {t(
                "Orders are not live yet. This section will be updated before checkout opens.",
                "Comenzile nu sunt live inca. Sectiunea aceasta va fi actualizata inainte ca pagina de comanda sa fie deschisa.",
              )}
            </p>
          ) : null}
          <p>
            {t("Typical response time", "Timp obisnuit de raspuns")}:{" "}
            {siteConfig.contact.responseTime}
          </p>
        </div>
      </section>

      <section className="rounded border border-border bg-surface p-6">
        <h2 className="font-heading text-2xl mb-3">
          {t("Follow the brand", "Urmareste brandul")}
        </h2>
        {activeSocials.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {activeSocials.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 border border-border rounded text-sm text-muted-foreground hover:border-gold hover:text-gold transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground leading-relaxed">
            {t(
              "Social links will be published here before launch.",
              "Linkurile de social media vor fi publicate aici inainte de lansare.",
            )}
          </p>
        )}
      </section>
    </InfoPageLayout>
  );
};

export default Contact;
