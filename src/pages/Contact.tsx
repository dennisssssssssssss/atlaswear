import InfoPageLayout from "@/components/InfoPageLayout";
import { publicOrderEmail, publicSupportEmail, siteConfig } from "@/config/site";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/use-page-meta";

const Contact = () => {
  const { t } = useLanguage();
  const activeSocials = siteConfig.socialLinks.filter((link) => Boolean(link.url));

  usePageMeta({
    title: t("nav.contact"),
    description: t("contact.description"),
    path: "/contact",
  });

  return (
    <InfoPageLayout
      eyebrow={t("contact.eyebrow")}
      title={t("contact.title")}
      intro={t("contact.description")}
    >
      <section className="rounded border border-border bg-surface p-6">
        <h2 className="mb-3 font-heading text-2xl">{t("contact.orderChannels")}</h2>
        <p className="leading-relaxed text-muted-foreground">
          {t(
            "Use WhatsApp or email to confirm stock, sizes, and delivery timing before placing an order.",
            "Foloseste WhatsApp sau email pentru a confirma stocul, marimile si timpul de livrare inainte de comanda.",
          )}
        </p>

        <div className="mt-4 space-y-3 text-muted-foreground">
          <p>
            {t("contact.whatsapp")}:{" "}
            {siteConfig.contact.whatsappNumber ? (
              <a
                href={`https://wa.me/${siteConfig.contact.whatsappNumber.replace(/[^\d]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="text-gold transition-colors hover:text-gold-light"
              >
                {siteConfig.contact.whatsappNumber}
              </a>
            ) : (
              t("contact.notConfigured")
            )}
          </p>
          <p>
            {t("contact.email")}:{" "}
            {publicOrderEmail ? (
              <a
                href={`mailto:${publicOrderEmail}`}
                className="text-gold transition-colors hover:text-gold-light"
              >
                {publicOrderEmail}
              </a>
            ) : (
              t("contact.notConfigured")
            )}
          </p>
        </div>
      </section>

      <section className="rounded border border-border bg-surface p-6">
        <h2 className="mb-3 font-heading text-2xl">{t("contact.support")}</h2>
        <p className="leading-relaxed text-muted-foreground">
          {publicSupportEmail
            ? t("contact.supportConfigured")
            : t("contact.supportMissing")}
        </p>
        {publicSupportEmail ? (
          <a
            href={`mailto:${publicSupportEmail}`}
            className="mt-4 inline-flex text-gold transition-colors hover:text-gold-light"
          >
            {publicSupportEmail}
          </a>
        ) : null}

        <p className="mt-4 text-sm text-muted-foreground">
          {t("contact.responseTime")}: {siteConfig.contact.responseTime}
        </p>
      </section>

      <section className="rounded border border-border bg-surface p-6">
        <h2 className="mb-3 font-heading text-2xl">{t("contact.socials")}</h2>
        {activeSocials.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {activeSocials.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="rounded border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-gold hover:text-gold"
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">{t("footer.socialPlaceholder")}</p>
        )}
      </section>
    </InfoPageLayout>
  );
};

export default Contact;
