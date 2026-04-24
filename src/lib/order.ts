import type { CartItem } from '@/contexts/CartContext';
import {
  getLocalizedText,
  getProductColorLabel,
  getProductPrice,
} from '@/data/products';
import type { Lang } from '@/lib/i18n';

export interface OrderCustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  payment: string;
}

interface OrderDraftOptions {
  customer: OrderCustomerDetails;
  items: CartItem[];
  formatPrice: (usd: number) => string;
  lang: Lang;
}

const getLineTotal = (
  item: CartItem,
  formatPrice: (usd: number) => string,
) => formatPrice(getProductPrice(item.product) * item.quantity);

export const buildOrderText = ({
  customer,
  items,
  formatPrice,
  lang,
}: OrderDraftOptions) => {
  const total = items.reduce(
    (sum, item) => sum + getProductPrice(item.product) * item.quantity,
    0,
  );

  const lines = [
    lang === 'en' ? 'ATLAS order request' : 'Cerere de comanda ATLAS',
    '',
    lang === 'en' ? 'Customer' : 'Client',
    `${lang === 'en' ? 'Name' : 'Nume'}: ${customer.name}`,
    `Email: ${customer.email}`,
    `${lang === 'en' ? 'Phone' : 'Telefon'}: ${customer.phone}`,
    `${lang === 'en' ? 'Address' : 'Adresa'}: ${customer.address}, ${customer.city}, ${customer.country}`,
    `${lang === 'en' ? 'Payment preference' : 'Preferinta de plata'}: ${customer.payment}`,
    '',
    lang === 'en' ? 'Items' : 'Produse',
    ...items.map(
      (item, index) =>
        `${index + 1}. ${getLocalizedText(item.product.name, lang)} - ${item.size} / ${getProductColorLabel(
          item.product,
          item.color,
          lang,
        )} x${item.quantity} - ${getLineTotal(item, formatPrice)}`,
    ),
    '',
    `Total: ${formatPrice(total)}`,
  ];

  return lines.join('\n');
};

export const buildMailtoHref = (
  email: string,
  options: OrderDraftOptions,
) => {
  const subject = `${
    options.lang === 'en'
      ? 'ATLAS order request'
      : 'Cerere de comanda ATLAS'
  } - ${options.customer.name}`;
  const body = buildOrderText(options);

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export const buildWhatsappHref = (
  phoneNumber: string,
  options: OrderDraftOptions,
) => {
  const normalizedPhone = phoneNumber.replace(/[^\d]/g, '');
  const body = buildOrderText(options);

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(body)}`;
};
