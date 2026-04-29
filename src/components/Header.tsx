import { FormEvent, useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import { ChevronDown, Menu, Search, X } from "lucide-react";
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
  const [mobileExpanded, setMobileExpanded] = useState<"women" | "men" | null>(
    null,
  );
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchValue(params.get("q") ?? "");
  }, [location.search]);

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/shop", label: t("nav.shop") },
  ];

  const navGroups = [
    {
      id: "women" as const,
      label: t("Women", "Femei"),
      links: [
        { to: "/shop?audience=women", label: t("All Women", "Toate femei") },
        {
          to: "/shop?audience=women&category=clothing",
          label: t("Clothing", "Imbracaminte"),
        },
        {
          to: "/shop?audience=women&category=dresses",
          label: t("Dresses", "Rochii"),
        },
        { to: "/shop?audience=women&category=bags", label: t("Bags", "Genti") },
        {
          to: "/shop?audience=women&category=sneakers",
          label: t("Sneakers", "Sneakers"),
        },
        {
          to: "/shop?audience=women&category=sandals",
          label: t("Sandals", "Sandale"),
        },
        {
          to: "/shop?audience=women&category=accessories",
          label: t("Accessories", "Accesorii"),
        },
      ],
    },
    {
      id: "men" as const,
      label: t("Men", "Barbati"),
      links: [
        { to: "/shop?audience=men", label: t("All Men", "Toti barbatii") },
        {
          to: "/shop?audience=men&category=clothing",
          label: t("Clothing", "Imbracaminte"),
        },
        {
          to: "/shop?audience=men&category=men-sneakers",
          label: t("Sneakers", "Sneakers"),
        },
        {
          to: "/shop?audience=men&category=polo-shirts",
          label: t("Polo Shirts", "Tricouri polo"),
        },
        { to: "/shop?audience=men&category=caps", label: t("Caps", "Sepci") },
        {
          to: "/shop?audience=men&category=sunglasses",
          label: t("Sunglasses", "Ochelari de soare"),
        },
        {
          to: "/shop?audience=men&category=men-watches",
          label: t("Watches", "Ceasuri"),
        },
      ],
    },
  ];

  const contactLink = { to: "/contact", label: t("nav.contact") };

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
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-gold hover:text-gold lg:hidden"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>

              <Link
                to="/"
                className="font-heading text-xl font-semibold tracking-[0.32em] text-gold md:text-2xl"
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

          {navGroups.map((group) => (
            <div key={group.id} className="group relative">
              <button
                type="button"
                className="relative inline-flex items-center gap-1 text-sm uppercase tracking-[0.24em] text-muted-foreground transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gold after:transition-transform hover:text-foreground group-hover:after:scale-x-100"
              >
                {group.label}
                <ChevronDown size={14} />
              </button>
              <div className="pointer-events-none absolute left-0 top-full z-50 min-w-64 pt-4 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                <div className="rounded-lg border border-border bg-card p-4 shadow-2xl">
                  <div className="flex flex-col gap-3">
                    {group.links.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-gold"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <NavLink
            to={contactLink.to}
            className={({ isActive }) =>
              cn(
                "relative text-sm uppercase tracking-[0.24em] transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-gold after:transition-transform",
                isActive ? activeLinkClass : inactiveLinkClass,
              )
            }
          >
            {contactLink.label}
          </NavLink>
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

                  {navGroups.map((group) => (
                    <div key={group.id} className="rounded-md bg-background/50">
                      <button
                        type="button"
                        onClick={() =>
                          setMobileExpanded((current) =>
                            current === group.id ? null : group.id,
                          )
                        }
                        className="flex w-full items-center justify-between px-3 py-3 text-left text-sm uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {group.label}
                        <ChevronDown
                          size={16}
                          className={cn(
                            "transition-transform",
                            mobileExpanded === group.id ? "rotate-180" : "",
                          )}
                        />
                      </button>
                      <AnimatePresence initial={false}>
                        {mobileExpanded === group.id ? (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-3 px-3 pb-4 pt-1">
                              {group.links.map((link) => (
                                <Link
                                  key={link.to}
                                  to={link.to}
                                  onClick={() => {
                                    setMobileOpen(false);
                                    setMobileExpanded(null);
                                  }}
                                  className="text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-gold"
                                >
                                  {link.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  ))}

                  <NavLink
                    to={contactLink.to}
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
                    {contactLink.label}
                  </NavLink>
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
