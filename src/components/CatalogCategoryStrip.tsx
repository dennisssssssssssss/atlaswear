import { useSearchParams } from "react-router-dom";

import type {
  SourceCategory,
  SourceProductAudience,
} from "@/data/source-products";
import {
  catalogUmbrellaOptions,
  isCategoryInCatalogUmbrella,
  normalizeCatalogUmbrella,
  type CatalogUmbrella,
} from "@/lib/catalog-filters";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const audienceOptions: Array<{
  id: SourceProductAudience | null;
  labelEn: string;
  labelRo: string;
}> = [
  { id: null, labelEn: "All", labelRo: "Toate" },
  { id: "women", labelEn: "Women", labelRo: "Femei" },
  { id: "men", labelEn: "Men", labelRo: "Barbati" },
];

const categoryOptions: Array<{
  id: CatalogUmbrella | null;
  labelEn: string;
  labelRo: string;
}> = [
  { id: null, labelEn: "All", labelRo: "Toate" },
  ...catalogUmbrellaOptions.map((option) => ({
    id: option.id,
    labelEn: option.label.en,
    labelRo: option.label.ro,
  })),
];

const stripButtonClass =
  "flex h-8 shrink-0 items-center rounded-full border px-3 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors";

const CatalogCategoryStrip = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeAudience = searchParams.get("audience") as SourceProductAudience | null;
  const activeCategory = searchParams.get("category") as SourceCategory | null;
  const activeUmbrella = normalizeCatalogUmbrella(searchParams.get("umbrella"));

  const updateAudience = (audience: SourceProductAudience | null) => {
    const nextParams = new URLSearchParams(searchParams);

    if (audience) {
      nextParams.set("audience", audience);
    } else {
      nextParams.delete("audience");
    }

    nextParams.delete("brand");
    setSearchParams(nextParams);
  };

  const updateUmbrella = (umbrella: CatalogUmbrella | null) => {
    const nextParams = new URLSearchParams(searchParams);

    if (umbrella) {
      nextParams.set("umbrella", umbrella);
    } else {
      nextParams.delete("umbrella");
    }

    nextParams.delete("category");
    nextParams.delete("brand");
    setSearchParams(nextParams);
  };

  const isUmbrellaActive = (umbrella: CatalogUmbrella | null) => {
    if (!umbrella) {
      return !activeUmbrella && !activeCategory;
    }

    return (
      activeUmbrella === umbrella ||
      (!activeUmbrella &&
        Boolean(activeCategory) &&
        isCategoryInCatalogUmbrella(activeCategory, umbrella))
    );
  };

  const renderButton = (
    key: string,
    label: string,
    isActive: boolean,
    onClick: () => void,
  ) => (
    <button
      key={key}
      type="button"
      onClick={onClick}
      className={cn(
        stripButtonClass,
        isActive
          ? "border-gold text-gold"
          : "border-border text-muted-foreground hover:border-gold hover:text-gold",
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-x-0 top-[8.875rem] z-40 border-b border-gold bg-background/95 backdrop-blur-xl lg:top-[7rem]">
      <div className="container px-4">
        <div className="flex min-h-[87px] flex-col justify-center gap-0 lg:h-[43px] lg:min-h-0 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <div className="flex h-[43px] items-center gap-2 overflow-x-auto whitespace-nowrap pr-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {audienceOptions.map((option) =>
              renderButton(
                option.id ?? "all-audience",
                t(option.labelEn, option.labelRo),
                activeAudience === option.id,
                () => updateAudience(option.id),
              ),
            )}
          </div>

          <div className="flex h-[43px] items-center gap-2 overflow-x-auto whitespace-nowrap lg:justify-end [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categoryOptions.map((option) =>
              renderButton(
                option.id ?? "all-categories",
                t(option.labelEn, option.labelRo),
                isUmbrellaActive(option.id),
                () => updateUmbrella(option.id),
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogCategoryStrip;
