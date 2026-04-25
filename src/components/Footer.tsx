import { Link } from "react-router-dom";

import { publicOrderEmail, publicSupportEmail, siteConfig } from "@/config/site";
import { Currency, useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCatalogProducts } from "@/hooks/use-catalog-products";
import { getCatalogCategoryLabel } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const currencies: Currency[] = ["RON", "EUR", "USD"];
const languageOptions = [
  { value: "ro", label: "RO" },
  { value: "en", label: "EN" },
] as const;

const Footer = () => {
  const { lang, setLang, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { categories } = useCatalogProducts();
  const activeSocials = siteConfig.socialLinks.filter((link) => Boolean(link.url));
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-gold">
              {t("footer.statement")}
            </p>
            <h2 className="mt-4 font-heading text-3xl">{t("common.brandName")}</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              {t("footer.description")}
            </p>
            <p className="mt-4 text-sm text-foreground">
              {t("footer.authenticity")}
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.28em] text-gold">
              {t("footer.catalog")}
            </h3>
            <div className="mt-4 flex flex-col gap-3">
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  to={`/shop?category=${category.id}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {getCatalogCategoryLabel(category.id, lang)}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.28em] text-gold">
              {t("footer.customerCare")}
            </h3>
            <div className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
              <Link
                to="/contact"
                className="transition-colors hover:text-foreground"
              >
                {t("nav.contact")}
              </Link>
              <Link
                to="/shipping"
                className="transition-colors hover:text-foreground"
              >
                {t("nav.shipping")}
              </Link>
              <Link
                to="/returns"
                className="transition-colors hover:text-foreground"
              >
                {t("nav.returns")}
              </Link>
              <Link
                to="/privacy"
                className="transition-colors hover:text-foreground"
              >
                {t("nav.privacy")}
              </Link>
              <Link
                to="/terms"
                className="transition-colors hover:text-foreground"
              >
                {t("nav.terms")}
              </Link>
              {siteConfig.contact.whatsappNumber ? (
                <p>WhatsApp: {siteConfig.contact.whatsappNumber}</p>
              ) : null}
              {publicOrderEmail ? <p>Email: {publicOrderEmail}</p> : null}
              {!publicOrderEmail && publicSupportEmail ? (
                <p>Email: {publicSupportEmail}</p>
              ) : null}
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.28em] text-gold">
              {t("footer.follow")}
            </h3>
            <div className="mt-4 flex flex-col gap-3">
              {activeSocials.length > 0 ? (
                activeSocials.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t("footer.socialPlaceholder")}
                </p>
              )}
            </div>

            <div className="mt-8">
              <h3 className="text-xs uppercase tracking-[0.28em] text-gold">
                {t("footer.languageCurrency")}
              </h3>

              <div className="mt-4 flex flex-wrap gap-2">
                {languageOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setLang(option.value)}
                    className={cn(
                      "rounded-full border px-3 py-2 text-xs uppercase tracking-[0.22em] transition-colors",
                      lang === option.value
                        ? "border-gold bg-gold text-primary-foreground"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
                {currencies.map((value) => {
                  const label =
                    value === "RON" ? "LEI" : value === "EUR" ? "EUR" : "USD";

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setCurrency(value)}
                      className={cn(
                        "rounded-full border px-3 py-2 text-xs uppercase tracking-[0.22em] transition-colors",
                        currency === value
                          ? "border-gold bg-gold text-primary-foreground"
                          : "border-border text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Copyright {year} {siteConfig.brandName}. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
