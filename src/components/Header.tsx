import { FormEvent, useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { Menu, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Currency, useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const currencies: Currency[] = ["RON", "EUR", "USD"];
const languageOptions = [
  { value: "ro", label: "RO" },
  { value: "en", label: "EN" },
] as const;

const Header = () => {
  const { currency, setCurrency } = useCurrency();
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchValue(params.get("q") ?? "");
  }, [location.search]);

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/shop", label: t("nav.shop") },
    { to: "/branduri", label: t("Brands", "Branduri") },
    { to: "/nou", label: t("New", "Nou") },
    { to: "/contact", label: t("nav.contact") },
  ];

  const updateSearchQuery = (nextValue: string) => {
    setSearchValue(nextValue);

    if (location.pathname !== "/shop") {
      return;
    }

    const params = new URLSearchParams(location.search);

    if (nextValue.trim()) {
      params.set("q", nextValue);
    } else {
      params.delete("q");
    }

    navigate(
      {
        pathname: "/shop",
        search: params.toString() ? `?${params.toString()}` : "",
      },
      { replace: true },
    );
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams();

    if (searchValue.trim()) {
      params.set("q", searchValue.trim());
    }

    navigate({
      pathname: "/shop",
      search: params.toString() ? `?${params.toString()}` : "",
    });
    setMobileOpen(false);
  };

  const activeLinkClass =
    "text-foreground after:scale-x-100 after:origin-left";
  const inactiveLinkClass =
    "text-muted-foreground hover:text-foreground after:scale-x-0 after:origin-left";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl">
      <div className="container py-4">
        <div className="grid gap-3 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
          <div className="flex items-center justify-between gap-3 lg:justify-start">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen((current) => !current)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-gold hover:text-gold lg:hidden"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>

              <Link
                to="/"
                className="font-heading text-lg font-semibold tracking-[0.24em] text-gold sm:text-xl sm:tracking-[0.32em] md:text-2xl"
              >
                ATLAS
              </Link>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <div className="inline-flex items-center rounded-full border border-border p-1">
                {languageOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setLang(option.value)}
                    className={cn(
                      "min-h-11 min-w-11 rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.18em] transition-colors",
                      lang === option.value
                        ? "bg-gold text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                    aria-label={t("nav.language")}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSearchSubmit}
            className="flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4"
          >
            <Search size={16} className="shrink-0 text-muted-foreground" />
            <input
              type="search"
              value={searchValue}
              onChange={(event) => updateSearchQuery(event.target.value)}
              placeholder={t("common.searchPlaceholder")}
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              aria-label={t("common.search")}
            />
            {searchValue ? (
              <button
                type="button"
                onClick={() => updateSearchQuery("")}
                className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-gold"
              >
                {t("common.clear")}
              </button>
            ) : null}
          </form>

          <div className="hidden items-center justify-end gap-3 lg:flex">
            <div className="inline-flex items-center rounded-full border border-border p-1">
              {languageOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setLang(option.value)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.22em] transition-colors",
                    lang === option.value
                      ? "bg-gold text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  aria-label={t("nav.language")}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="inline-flex items-center rounded-full border border-border p-1">
              {currencies.map((value) => {
                const label =
                  value === "RON" ? "LEI" : value === "EUR" ? "EUR" : "USD";

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setCurrency(value)}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.22em] transition-colors",
                      currency === value
                        ? "bg-gold text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-3 hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "relative text-sm uppercase tracking-[0.24em] transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-gold after:transition-transform",
                  isActive ? activeLinkClass : inactiveLinkClass,
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <AnimatePresence>
          {mobileOpen ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden lg:hidden"
            >
              <div className="mt-4 rounded-lg border border-border bg-card p-4">
                <nav className="flex flex-col gap-3">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === "/"}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "rounded-md px-3 py-3 text-sm uppercase tracking-[0.22em] transition-colors",
                          isActive
                            ? "bg-background text-gold"
                            : "text-muted-foreground hover:bg-background hover:text-foreground",
                        )
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </nav>

                <div className="mt-4 border-t border-border pt-4">
                  <p className="mb-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {t("nav.language")}
                  </p>
                  <div className="flex flex-wrap gap-2">
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
                  </div>
                </div>

                <div className="mt-4 border-t border-border pt-4">
                  <p className="mb-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {t("nav.currency")}
                  </p>
                  <div className="flex flex-wrap gap-2">
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
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
