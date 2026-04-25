import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { detectInitialLanguage } from "@/lib/i18n";

export type Currency = "RON" | "EUR" | "USD";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (nextCurrency: Currency) => void;
  convertFromRon: (amountRon: number) => number;
  formatPrice: (amountRon: number) => string;
  isLoadingRates: boolean;
}

const CURRENCY_STORAGE_KEY = "atlas-currency";

const fallbackRates: Record<Currency, number> = {
  RON: 1,
  EUR: 0.2,
  USD: 1 / 4.6,
};

const defaultCurrency = (): Currency => {
  if (typeof window === "undefined") {
    return "RON";
  }

  const stored = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
  if (stored === "RON" || stored === "EUR" || stored === "USD") {
    return stored;
  }

  return detectInitialLanguage() === "ro" ? "RON" : "USD";
};

const CurrencyContext = createContext<CurrencyContextType | null>(null);

const numberFormats: Record<Currency, Intl.NumberFormat> = {
  RON: new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
  EUR: new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
  USD: new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currency, setCurrencyState] = useState<Currency>(defaultCurrency);
  const [rates, setRates] = useState<Record<Currency, number>>(fallbackRates);
  const [isLoadingRates, setIsLoadingRates] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadRates = async () => {
      try {
        const response = await fetch(
          "https://api.frankfurter.app/latest?from=RON&to=EUR,USD",
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch rates: ${response.status}`);
        }

        const data = (await response.json()) as {
          rates?: Partial<Record<Exclude<Currency, "RON">, number>>;
        };

        if (isActive && data.rates) {
          setRates({
            RON: 1,
            EUR: data.rates.EUR ?? fallbackRates.EUR,
            USD: data.rates.USD ?? fallbackRates.USD,
          });
        }
      } catch {
        if (isActive) {
          setRates(fallbackRates);
        }
      } finally {
        if (isActive) {
          setIsLoadingRates(false);
        }
      }
    };

    void loadRates();

    return () => {
      isActive = false;
    };
  }, []);

  const setCurrency = useCallback((nextCurrency: Currency) => {
    setCurrencyState(nextCurrency);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(CURRENCY_STORAGE_KEY, nextCurrency);
    }
  }, []);

  const convertFromRon = useCallback(
    (amountRon: number) => {
      const converted = amountRon * rates[currency];
      return Math.round(converted * 100) / 100;
    },
    [currency, rates],
  );

  const formatPrice = useCallback(
    (amountRon: number) => numberFormats[currency].format(convertFromRon(amountRon)),
    [convertFromRon, currency],
  );

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      convertFromRon,
      formatPrice,
      isLoadingRates,
    }),
    [convertFromRon, currency, formatPrice, isLoadingRates, setCurrency],
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }

  return context;
};
