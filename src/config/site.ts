const publicSiteUrl =
  import.meta.env.VITE_SITE_URL || "https://atlaswear.lovable.app";

export const siteConfig = {
  brandName: "ATLAS Wear",
  brandShortName: "ATLAS",
  baseUrl: publicSiteUrl,
  defaultTitle: "ATLAS Wear | Women’s edit with premium designer pieces",
  defaultDescription:
    "Curated women’s dresses, shoes, bags, and premium separates with attractive launch pricing.",
  heroImage:
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80",
  contact: {
    supportEmail: "",
    orderEmail: "",
    whatsappNumber: "",
    responseTime: "1-2 business days",
  },
  socialLinks: [
    { label: "Instagram", url: "" },
    { label: "TikTok", url: "" },
    { label: "YouTube", url: "" },
  ],
  shipping: {
    processingWindow: "1-3 business days",
    romaniaWindow: "2-4 business days",
    internationalWindow: "5-10 business days",
    dutiesNote:
      "Orders shipped outside Romania may be subject to local duties and taxes.",
  },
  returns: {
    windowDays: 14,
    conditionNote:
      "Items must be unworn, unused, and returned with their original packaging.",
    exclusionNote:
      "Personalized, damaged through misuse, or final-sale items may not be eligible for return.",
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
