import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const Checkout = () => {
  const { items, totalUSD, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', country: 'Romania', payment: 'cod'
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md px-4">
          <CheckCircle size={64} className="text-gold mx-auto mb-6" />
          <h1 className="font-heading text-3xl mb-4">{t('Order Confirmed!', 'Comandă confirmată!')}</h1>
          <p className="text-muted-foreground">{t('Thank you for your order. We\'ll send you tracking details soon.', 'Mulțumim pentru comandă. Îți trimitem detaliile de livrare în curând.')}</p>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <p className="text-muted-foreground">{t('Your cart is empty', 'Coșul tău este gol')}</p>
      </div>
    );
  }

  const inputClass = "w-full bg-surface border border-border rounded px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors";

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container max-w-4xl">
        <h1 className="font-heading text-3xl md:text-4xl mb-10">{t('Checkout', 'Finalizare comandă')}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <form
            onSubmit={e => { e.preventDefault(); clearCart(); setSubmitted(true); }}
            className="lg:col-span-3 space-y-5"
          >
            <input placeholder={t('Full Name', 'Nume complet')} value={form.name} onChange={e => update('name', e.target.value)} className={inputClass} required />
            <input type="email" placeholder="Email" value={form.email} onChange={e => update('email', e.target.value)} className={inputClass} required />
            <input placeholder={t('Phone', 'Telefon')} value={form.phone} onChange={e => update('phone', e.target.value)} className={inputClass} required />
            <input placeholder={t('Address', 'Adresă')} value={form.address} onChange={e => update('address', e.target.value)} className={inputClass} required />
            <div className="grid grid-cols-2 gap-4">
              <input placeholder={t('City', 'Oraș')} value={form.city} onChange={e => update('city', e.target.value)} className={inputClass} required />
              <select value={form.country} onChange={e => update('country', e.target.value)} className={inputClass}>
                <option value="Romania">Romania</option>
                <option value="USA">USA</option>
                <option value="Other">{t('Other', 'Altă țară')}</option>
              </select>
            </div>

            {/* Payment */}
            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-3">{t('Payment', 'Plată')}</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-border rounded cursor-pointer hover:border-gold transition-colors">
                  <input type="radio" name="payment" value="cod" checked={form.payment === 'cod'} onChange={() => update('payment', 'cod')} className="accent-gold" />
                  <span className="text-sm">{t('Cash on Delivery', 'Ramburs la livrare')}</span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-border rounded cursor-pointer opacity-50">
                  <input type="radio" name="payment" value="card" disabled />
                  <span className="text-sm">{t('Card Payment (coming soon)', 'Plată cu cardul (în curând)')}</span>
                </label>
              </div>
            </div>

            <Button variant="gold" size="lg" type="submit" className="w-full text-sm">
              {t('Place Order', 'Plasează comanda')}
            </Button>
          </form>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="bg-surface rounded p-6 sticky top-24">
              <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{t('Order Summary', 'Sumar comandă')}</h3>
              <div className="space-y-3 mb-6">
                {items.map(item => {
                  const price = item.product.onSale && item.product.salePrice ? item.product.salePrice : item.product.priceUSD;
                  return (
                    <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.product.name} x{item.quantity}</span>
                      <span>{formatPrice(price * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-border pt-4 flex justify-between">
                <span className="text-sm font-medium">{t('Total', 'Total')}</span>
                <span className="font-heading text-lg text-gold">{formatPrice(totalUSD)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
