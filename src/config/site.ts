const publicSiteUrl =
  import.meta.env.VITE_SITE_URL ||
  "https://dennisssssssssssss.github.io/atlaswear";

export const siteConfig = {
  brandName: "ATLAS Wear",
  brandShortName: "ATLAS",
  baseUrl: publicSiteUrl,
  defaultTitle: "ATLAS Wear | Fashion si accesorii autentice",
  defaultDescription:
    "Fashion si accesorii autentice, cu livrare in Romania si international. Comenzile se confirma direct.",
  heroImage: "/og-image.svg",
  contact: {
    supportEmail: "",
    orderEmail: "",
    whatsappNumber: "",
    responseTime: "de obicei in aceeasi zi",
  },
  socialLinks: [
    { label: "Instagram", url: "" },
    { label: "TikTok", url: "" },
    { label: "YouTube", url: "" },
  ],
  shipping: {
    processingWindow: "confirmare inainte de expediere",
    romaniaWindow: "2-4 zile lucratoare",
    internationalWindow: "se confirma inainte de expediere",
    dutiesNote:
      "Pentru livrarile internationale, costul si eventualele taxe se confirma inainte de expediere.",
  },
  returns: {
    windowDays: 14,
    conditionNote:
      "Produsul trebuie sa fie nefolosit si returnat in ambalajul original.",
    exclusionNote:
      "Produsele folosite, deteriorate sau fara ambalajul original pot fi refuzate la retur.",
  },
};

export const publicSupportEmail =
  siteConfig.contact.supportEmail || siteConfig.contact.orderEmail;

export const publicOrderEmail =
  siteConfig.contact.orderEmail || publicSupportEmail;

export const hasOrderChannel = Boolean(
  publicOrderEmail || siteConfig.contact.whatsappNumber,
);

export const hasNewsletterChannel = Boolean(publicSupportEmail);
