import { Link, useLocation } from "react-router-dom";

import { useLanguage } from "@/contexts/LanguageContext";
import { usePageMeta } from "@/hooks/use-page-meta";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  usePageMeta({
    title: t("404.title"),
    description: t("404.description"),
    path: location.pathname,
    noindex: true,
  });

  return (
    <div className="min-h-screen bg-background px-4 pt-32 pb-20 text-foreground">
      <div className="container max-w-2xl rounded-[2rem] border border-border bg-card p-10 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-gold">404</p>
        <h1 className="mt-4 font-heading text-5xl">{t("404.title")}</h1>
        <p className="mt-4 text-muted-foreground">{t("404.description")}</p>
        <Link
          to="/"
          className="mt-8 inline-flex text-sm uppercase tracking-[0.24em] text-gold transition-colors hover:text-gold-light"
        >
          {t("common.backToHome")}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
