import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Currency = 'USD' | 'EUR' | 'RON';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  convert: (usd: number) => number;
  symbol: string;
  formatPrice: (usd: number) => string;
}

const symbols: Record<Currency, string> = { USD: '$', EUR: '€', RON: 'lei' };

const fallbackRates: Record<Currency, number> = { USD: 1, EUR: 0.92, RON: 4.57 };

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    return (localStorage.getItem('atlas-currency') as Currency) || 'USD';
  });
  const [rates, setRates] = useState<Record<Currency, number>>(fallbackRates);

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(r => r.json())
      .then(data => {
        if (data?.rates) {
          setRates({ USD: 1, EUR: data.rates.EUR || fallbackRates.EUR, RON: data.rates.RON || fallbackRates.RON });
        }
      })
      .catch(() => {});
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('atlas-currency', c);
  }, []);

  const convert = useCallback((usd: number) => {
    return Math.round(usd * rates[currency] * 100) / 100;
  }, [currency, rates]);

  const formatPrice = useCallback((usd: number) => {
    const converted = convert(usd);
    if (currency === 'RON') return `${converted.toFixed(2)} lei`;
    return `${symbols[currency]}${converted.toFixed(2)}`;
  }, [convert, currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convert, symbol: symbols[currency], formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
};
