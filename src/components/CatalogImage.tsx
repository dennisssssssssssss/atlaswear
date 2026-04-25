import { useState, type ImgHTMLAttributes } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface CatalogImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string;
  fallbackLabel?: string;
}

const CatalogImage = ({
  alt,
  className,
  fallbackClassName,
  fallbackLabel = siteConfig.brandShortName,
  onError,
  src,
  ...props
}: CatalogImageProps) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex h-full w-full items-center justify-center bg-[#f8f5ef] px-4 text-center text-xs uppercase tracking-[0.35em] text-muted-foreground",
          fallbackClassName,
        )}
      >
        {fallbackLabel}
      </div>
    );
  }

  return (
    <img
      {...props}
      src={src}
      alt={alt}
      className={className}
      onError={(event) => {
        setHasError(true);
        onError?.(event);
      }}
    />
  );
};

export default CatalogImage;
