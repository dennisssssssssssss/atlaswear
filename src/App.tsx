import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

import Checkout from "./pages/Checkout";
import Catalog from "./pages/Catalog";
import Contact from "./pages/Contact";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import ProductDetail from "./pages/ProductDetail";
import Returns from "./pages/Returns";
import Shipping from "./pages/Shipping";
import Shop from "./pages/Shop";
import Terms from "./pages/Terms";

const queryClient = new QueryClient();
const routerBase =
  import.meta.env.BASE_URL === "/"
    ? "/"
    : import.meta.env.BASE_URL.replace(/\/$/, "");

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter basename={routerBase}>
              <Header />
              <CartDrawer />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </BrowserRouter>
          </CartProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
