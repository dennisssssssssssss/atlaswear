const appBasePath =
  import.meta.env.BASE_URL === "/"
    ? ""
    : import.meta.env.BASE_URL.replace(/\/$/, "");

const hasProtocol = (value: string) =>
  /^(?:[a-z]+:)?\/\//i.test(value) || value.startsWith("data:");

export const resolveAssetUrl = (value?: string | null) => {
  if (!value) {
    return "";
  }

  if (hasProtocol(value)) {
    return value;
  }

  if (appBasePath && (value === appBasePath || value.startsWith(`${appBasePath}/`))) {
    return value;
  }

  const normalized = value.startsWith("/") ? value : `/${value}`;
  return `${appBasePath}${normalized}`;
};

export const resolveAbsoluteAssetUrl = (value: string, siteBaseUrl: string) =>
  new URL(resolveAssetUrl(value), siteBaseUrl).toString();
