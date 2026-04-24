import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { ArrowLeft, CheckCircle2, Mail, MessageSquare } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { hasOrderChannel, publicOrderEmail, siteConfig } from '@/config/site';
import {
  getLocalizedText,
  getProductColorLabel,
  getProductPrice,
} from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePageMeta } from '@/hooks/use-page-meta';
import {
  buildMailtoHref,
  buildOrderText,
  buildWhatsappHref,
  type OrderCustomerDetails,
} from '@/lib/order';

const Checkout = () => {
  const { items, totalUSD, clearCart } = useCart();
  const { currency, formatPrice } = useCurrency();
  const { lang, t } = useLanguage();
  const [draftReady, setDraftReady] = useState(false);
  const [form, setForm] = useState<OrderCustomerDetails>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Romania',
    payment: 'Cash on Delivery',
  });

  usePageMeta({
    title: t('Order Request', 'Cerere de comanda'),
    description: t(
      'Prepare a real order request through the available ATLAS contact channels.',
      'Pregateste o cerere de comanda reala prin canalele de contact disponibile ATLAS.',
    ),
    path: '/checkout',
  });

  const update = (field: keyof OrderCustomerDetails, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const orderOptions = useMemo(
    () => ({
      customer: form,
      items,
      formatPrice,
      lang,
    }),
    [form, formatPrice, items, lang],
  );

  const orderDraftText = useMemo(
    () => buildOrderText(orderOptions),
    [orderOptions],
  );

  const emailHref = publicOrderEmail
    ? buildMailtoHref(publicOrderEmail, orderOptions)
    : '';
  const whatsappHref = siteConfig.contact.whatsappNumber
    ? buildWhatsappHref(siteConfig.contact.whatsappNumber, orderOptions)
    : '';

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <p className="text-muted-foreground mb-4">
            {t('Your cart is empty', 'Cosul tau este gol')}
          </p>
          <Link
            to="/shop"
            className="text-gold hover:text-gold-light transition-colors"
          >
            {t('Return to shop', 'Inapoi la magazin')}
          </Link>
        </div>
      </div>
    );
  }

  const handlePrepareRequest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!hasOrderChannel) {
      toast({
        title: t('Orders are not live yet', 'Comenzile nu sunt live inca'),
        description: t(
          'Configure email or WhatsApp before opening the order request flow.',
          'Configureaza emailul sau WhatsApp-ul inainte sa deschizi fluxul de comanda.',
        ),
      });
      return;
    }

    setDraftReady(true);
  };

  const handleCopyOrder = async () => {
    try {
      await navigator.clipboard.writeText(orderDraftText);
      toast({
        title: t('Order details copied', 'Detaliile comenzii au fost copiate'),
        description: t(
          'You can now paste the request into email or WhatsApp.',
          'Acum poti lipi cererea in email sau WhatsApp.',
        ),
      });
    } catch {
      toast({
        title: t('Copy failed', 'Copiere esuata'),
        description: t(
          'Please copy the order details manually from the draft card.',
          'Te rugam sa copiezi manual detaliile comenzii din cardul de draft.',
        ),
      });
    }
  };

  const handleOpenEmail = () => {
    if (!emailHref) {
      return;
    }

    window.location.href = emailHref;
  };

  const handleOpenWhatsapp = () => {
    if (!whatsappHref) {
      return;
    }

    window.open(whatsappHref, '_blank', 'noopener,noreferrer');
  };

  const inputClass =
    'w-full bg-surface border border-border rounded px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors';

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container max-w-5xl">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          {t('Back to shop', 'Inapoi la magazin')}
        </Link>

        <div className="max-w-3xl mb-10">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-3">
            {t('Order', 'Comanda')}
          </p>
          <h1 className="font-heading text-3xl md:text-4xl mb-4">
            {t('Order Request', 'Cerere de comanda')}
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            {hasOrderChannel
              ? t(
                  'Fill in your details, prepare the request, then send it through one of the available channels below. The order is only placed after you send the message and we confirm it.',
                  'Completeaza datele, pregateste cererea, apoi trimite-o prin unul dintre canalele disponibile de mai jos. Comanda este plasata doar dupa ce trimiti mesajul si noi o confirmam.',
                )
              : t(
                  'Orders are intentionally disabled until an email or WhatsApp channel is configured. This avoids fake confirmations and lost orders.',
                  'Comenzile sunt dezactivate intentionat pana cand este configurat un email sau un canal WhatsApp. Astfel evitam confirmarile false si comenzile pierdute.',
                )}
          </p>
        </div>

        {!hasOrderChannel ? (
          <div className="mb-8 rounded border border-gold/30 bg-gold/10 p-4 text-sm text-foreground">
            {t(
              'No live order channel is configured yet. Add an email or WhatsApp number before launch.',
              'Nu este configurat inca niciun canal live de comanda. Adauga un email sau un numar de WhatsApp inainte de lansare.',
            )}
          </div>
        ) : null}

        {draftReady ? (
          <div className="mb-8 rounded border border-border bg-surface p-6 space-y-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={22} className="text-gold mt-0.5 shrink-0" />
              <div>
                <h2 className="font-heading text-2xl mb-2">
                  {t(
                    'Your order request is ready',
                    'Cererea ta de comanda este pregatita',
                  )}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t(
                    'Choose a delivery channel below. The cart stays intact until you decide to clear it after sending the request.',
                    'Alege un canal de trimitere de mai jos. Cosul ramane intact pana cand alegi sa il golesti dupa trimiterea cererii.',
                  )}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {siteConfig.contact.whatsappNumber ? (
                <Button
                  variant="gold"
                  onClick={handleOpenWhatsapp}
                  className="sm:flex-1"
                >
                  <MessageSquare size={16} className="mr-2" />
                  {t('Send on WhatsApp', 'Trimite pe WhatsApp')}
                </Button>
              ) : null}
              {publicOrderEmail ? (
                <Button
                  variant="gold-outline"
                  onClick={handleOpenEmail}
                  className="sm:flex-1"
                >
                  <Mail size={16} className="mr-2" />
                  {t('Send by Email', 'Trimite prin email')}
                </Button>
              ) : null}
              <Button
                variant="outline"
                onClick={handleCopyOrder}
                className="sm:flex-1"
              >
                {t('Copy Details', 'Copiaza detaliile')}
              </Button>
            </div>

            <div className="rounded border border-border bg-background/40 p-4">
              <pre className="whitespace-pre-wrap break-words text-sm text-muted-foreground font-mono">
                {orderDraftText}
              </pre>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={() => setDraftReady(false)}>
                {t('Edit details', 'Editeaza detaliile')}
              </Button>
              <Button
                variant="gold-outline"
                onClick={() => {
                  clearCart();
                  setDraftReady(false);
                }}
              >
                {t('Clear cart after sending', 'Goleste cosul dupa trimitere')}
              </Button>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <form
            onSubmit={handlePrepareRequest}
            className="lg:col-span-3 space-y-5"
          >
            <input
              placeholder={t('Full Name', 'Nume complet')}
              value={form.name}
              onChange={(event) => update('name', event.target.value)}
              className={inputClass}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(event) => update('email', event.target.value)}
              className={inputClass}
              required
            />
            <input
              placeholder={t('Phone', 'Telefon')}
              value={form.phone}
              onChange={(event) => update('phone', event.target.value)}
              className={inputClass}
              required
            />
            <input
              placeholder={t('Address', 'Adresa')}
              value={form.address}
              onChange={(event) => update('address', event.target.value)}
              className={inputClass}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder={t('City', 'Oras')}
                value={form.city}
                onChange={(event) => update('city', event.target.value)}
                className={inputClass}
                required
              />
              <select
                value={form.country}
                onChange={(event) => update('country', event.target.value)}
                className={inputClass}
              >
                <option value="Romania">Romania</option>
                <option value="USA">USA</option>
                <option value="Other">{t('Other', 'Alta tara')}</option>
              </select>
            </div>

            <div>
              <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-3">
                {t('Payment', 'Plata')}
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-border rounded cursor-pointer hover:border-gold transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="Cash on Delivery"
                    checked={form.payment === 'Cash on Delivery'}
                    onChange={() => update('payment', 'Cash on Delivery')}
                    className="accent-gold"
                  />
                  <span className="text-sm">
                    {t('Cash on Delivery', 'Ramburs la livrare')}
                  </span>
                </label>
                <label className="flex items-center gap-3 p-3 border border-border rounded opacity-50">
                  <input type="radio" name="payment" value="Card" disabled />
                  <span className="text-sm">
                    {t(
                      'Card payments will appear after a payment provider is connected.',
                      'Plata cu cardul va aparea dupa conectarea unui procesator de plati.',
                    )}
                  </span>
                </label>
              </div>
            </div>

            <Button
              variant="gold"
              size="lg"
              type="submit"
              className="w-full text-sm"
              disabled={!hasOrderChannel}
            >
              {hasOrderChannel
                ? t('Prepare Order Request', 'Pregateste cererea de comanda')
                : t(
                    'Order channel not configured',
                    'Canal de comanda neconfigurat',
                  )}
            </Button>
          </form>

          <div className="lg:col-span-2">
            <div className="bg-surface rounded p-6 sticky top-24">
              <h3 className="text-xs tracking-[0.3em] uppercase text-gold mb-4">
                {t('Order Summary', 'Sumar comanda')}
              </h3>
              <div className="space-y-3 mb-6">
                {items.map((item) => {
                  const price = getProductPrice(item.product);

                  return (
                    <div
                      key={`${item.product.id}-${item.size}-${item.color}`}
                      className="flex justify-between text-sm gap-4"
                    >
                      <span className="text-muted-foreground">
                        {getLocalizedText(item.product.name, lang)} x
                        {item.quantity} {' · '} {item.size} /{' '}
                        {getProductColorLabel(item.product, item.color, lang)}
                      </span>
                      <span>{formatPrice(price * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-border pt-4 flex justify-between mb-4">
                <span className="text-sm font-medium">
                  {t('Total', 'Total')}
                </span>
                <span className="font-heading text-lg text-gold">
                  {formatPrice(totalUSD)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t('Displayed currency:', 'Moneda afisata:')} {currency}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
