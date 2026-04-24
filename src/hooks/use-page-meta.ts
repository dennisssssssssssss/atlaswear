import { useEffect } from "react";

import { siteConfig } from "@/config/site";

interface PageMetaOptions {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noindex?: boolean;
}

const upsertMeta = (
  attribute: "name" | "property",
  value: string,
  content: string,
) => {
  let element = document.head.querySelector(
    `meta[${attribute}="${value}"]`,
  ) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const upsertCanonical = (href: string) => {
  let element = document.head.querySelector(
    'link[rel="canonical"]',
  ) as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }

  element.href = href;
};

export const usePageMeta = ({
  title,
  description,
  path = "/",
  image,
  noindex = false,
}: PageMetaOptions) => {
  useEffect(() => {
    const pageTitle = title
      ? `${title} | ${siteConfig.brandShortName}`
      : siteConfig.defaultTitle;
    const pageDescription = description ?? siteConfig.defaultDescription;
    const canonicalUrl = new URL(path, siteConfig.baseUrl).toString();
    const shareImage = image ?? siteConfig.heroImage;

    document.title = pageTitle;

    upsertMeta("name", "description", pageDescription);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:title", pageTitle);
    upsertMeta("property", "og:description", pageDescription);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:image", shareImage);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", pageTitle);
    upsertMeta("name", "twitter:description", pageDescription);
    upsertMeta("name", "twitter:image", shareImage);

    upsertCanonical(canonicalUrl);
  }, [description, image, noindex, path, title]);
};
