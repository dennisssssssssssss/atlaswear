import { Suspense, lazy } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ErrorBoundary from "@/components/ErrorBoundary";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

const queryClient = new QueryClient();
const routerBase =
  import.meta.env.BASE_URL === "/"
    ? "/"
    : import.meta.env.BASE_URL.replace(/\/$/, "");

const Index = lazy(() => import("./pages/Index"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Privacy = lazy(() => import("./pages/Privacy"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Returns = lazy(() => import("./pages/Returns"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Shop = lazy(() => import("./pages/Shop"));
const Terms = lazy(() => import("./pages/Terms"));

const RouteFallback = () => (
  <div className="min-h-screen bg-background text-foreground px-4 pt-32">
    <div className="container max-w-2xl text-center">
      <p className="text-xs uppercase tracking-[0.35em] text-gold">ATLAS</p>
      <p className="mt-4 text-muted-foreground">Loading storefront...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={routerBase}>
            <ErrorBoundary>
              <Header />
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/catalog" element={<Navigate to="/shop" replace />} />
                  <Route
                    path="/catalog/collection/:id"
                    element={<Navigate to="/shop" replace />}
                  />
                  <Route path="/catalog/item/:id" element={<ProductDetail />} />
                  <Route
                    path="/checkout"
                    element={<Navigate to="/contact" replace />}
                  />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/shipping" element={<Shipping />} />
                  <Route path="/returns" element={<Returns />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <Footer />
            </ErrorBoundary>
          </BrowserRouter>
        </CurrencyProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
