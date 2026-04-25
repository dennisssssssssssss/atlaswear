import InfoPageLayout from "@/components/InfoPageLayout";
import {
  publicOrderEmail,
  publicSupportEmail,
  publicTelegramUrl,
  siteConfig,
} from "@/config/site";
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
        <h2 className="font-heading text-2xl mb-3">{t("contact.orderChannels")}</h2>
        <p className="text-muted-foreground leading-relaxed">
          {t("contact.orderChannelsDescription")}
        </p>

        <div className="mt-4 space-y-3 text-muted-foreground">
          <p>
            {t("contact.whatsapp")}:{" "}
            {siteConfig.contact.whatsappNumber || t("contact.notConfigured")}
          </p>
          <p>
            {t("contact.telegram")}:{" "}
            {publicTelegramUrl ? (
              <a
                href={publicTelegramUrl}
                target="_blank"
                rel="noreferrer"
                className="text-gold hover:text-gold-light transition-colors"
              >
                {publicTelegramUrl}
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
                className="text-gold hover:text-gold-light transition-colors"
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
        <h2 className="font-heading text-2xl mb-3">{t("contact.support")}</h2>
        <p className="text-muted-foreground leading-relaxed">
          {publicSupportEmail
            ? t("contact.supportConfigured")
            : t("contact.supportMissing")}
        </p>
        {publicSupportEmail ? (
          <a
            href={`mailto:${publicSupportEmail}`}
            className="inline-flex mt-4 text-gold hover:text-gold-light transition-colors"
          >
            {publicSupportEmail}
          </a>
        ) : null}

        <p className="mt-4 text-sm text-muted-foreground">
          {t("contact.responseTime")}: {siteConfig.contact.responseTime}
        </p>
      </section>

      <section className="rounded border border-border bg-surface p-6">
        <h2 className="font-heading text-2xl mb-3">{t("contact.socials")}</h2>
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
          <p className="text-muted-foreground">{t("footer.socialPlaceholder")}</p>
        )}
      </section>
    </InfoPageLayout>
  );
};

export default Contact;
