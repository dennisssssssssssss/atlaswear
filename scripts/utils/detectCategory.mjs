function normalizeName(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

export function detectCategory(name, audienceHint) {
  const n = normalizeName(name).toLowerCase();
  const audience = normalizeName(audienceHint || "unisex").toLowerCase();
  const hasFormalFootwearTerm =
    /\b(?:loafers?|oxfords?|derbys?|moccasins?|monks?|brogues?)\b/i.test(n);
  const hasDressFootwearTerm =
    /\bshoes?\b/i.test(n) || hasFormalFootwearTerm;
  const hasBagDimensions = /\b\d{1,3}\s*x\s*\d{1,3}\s*x\s*\d{1,3}\s*cm\b/i.test(n);
  const hasShoeSizeRange =
    /\b(?:sz|size)?\s*(?:3[4-9]|4[0-8])\s*[-/]\s*(?:3[4-9]|4[0-8])\b/i.test(n);

  if (hasDressFootwearTerm) {
    if (audience === "women") {
      if (n.includes("boot") || n.includes("chelsea") || n.includes("ugg")) {
        return "boots";
      }

      if (
        n.includes("sandal") ||
        n.includes("slide") ||
        n.includes("flip") ||
        n.includes("heel") ||
        n.includes("pump") ||
        n.includes("stiletto")
      ) {
        return "sandals";
      }

      if (hasFormalFootwearTerm || n.includes("mule") || n.includes("flat")) {
        return "mules";
      }

      return "sneakers";
    }

    if (n.includes("boot") || n.includes("chelsea")) {
      return "boots";
    }

    if (n.includes("sandal") || n.includes("slide") || n.includes("flip")) {
      return "sandals";
    }

    return "men-sneakers";
  }

  if (hasBagDimensions) {
    return "bags";
  }

  if (audience === "men" || audience === "unisex") {
    if (hasShoeSizeRange) {
      return "men-sneakers";
    }

    if (
      n.includes("loafer") ||
      n.includes("oxford") ||
      n.includes("derby") ||
      n.includes("dress shoe") ||
      n.includes("moccasin") ||
      n.includes("monk")
    ) {
      return "men-sneakers";
    }

    if (
      n.includes("sneaker") ||
      n.includes("trainer") ||
      n.includes("air force") ||
      n.includes("jordan") ||
      n.includes("dunk") ||
      n.includes("yeezy") ||
      n.includes("samba") ||
      n.includes("campus")
    ) {
      return "men-sneakers";
    }

    if (n.includes("boot") || n.includes("chelsea")) {
      return "boots";
    }

    if (n.includes("sandal") || n.includes("slide") || n.includes("flip")) {
      return "sandals";
    }

    if (n.includes("polo") || n.includes("lacoste") || n.includes("ralph")) {
      return "polo-shirts";
    }

    if (n.includes("hoodie") || n.includes("sweatshirt")) {
      return "hoodies";
    }

    if (n.includes("jacket") || n.includes("coat") || n.includes("blazer")) {
      return "jackets";
    }

    if (n.includes("cap") || n.includes("hat") || n.includes("beanie")) {
      return "caps";
    }

    if (n.includes("sunglass") || n.includes("eyewear")) {
      return "sunglasses";
    }

    if (n.includes("watch") || n.includes("timepiece")) {
      return "men-watches";
    }

    if (n.includes("bag") || n.includes("backpack") || n.includes("tote")) {
      return "bags";
    }
  }

  if (audience === "women") {
    if (hasShoeSizeRange) {
      return n.includes("ugg") ? "boots" : "sneakers";
    }

    if (n.includes("sneaker") || n.includes("trainer")) {
      return "sneakers";
    }

    if (
      n.includes("sandal") ||
      n.includes("slide") ||
      n.includes("flip") ||
      n.includes("heel") ||
      n.includes("pump") ||
      n.includes("stiletto")
    ) {
      return "sandals";
    }

    if (n.includes("loafer") || n.includes("mule") || n.includes("flat")) {
      return "mules";
    }

    if (n.includes("boot") || n.includes("chelsea")) {
      return "boots";
    }

    if (
      n.includes("bag") ||
      n.includes("tote") ||
      n.includes("purse") ||
      n.includes("handbag") ||
      n.includes("clutch") ||
      n.includes("satchel") ||
      n.includes("hobo") ||
      n.includes("crossbody")
    ) {
      return "bags";
    }

    if (n.includes("dress") || n.includes("gown") || n.includes("skirt")) {
      return "dresses";
    }

    if (n.includes("bikini") || n.includes("swimsuit") || n.includes("swimwear")) {
      return "swimwear";
    }
  }

  if (
    n.includes("bag") ||
    n.includes("tote") ||
    n.includes("purse") ||
    n.includes("handbag")
  ) {
    return "bags";
  }

  if (n.includes("dress") || n.includes("gown")) {
    return "dresses";
  }

  if (n.includes("jacket") || n.includes("coat")) {
    return "jackets";
  }

  if (n.includes("hoodie") || n.includes("sweatshirt")) {
    return "hoodies";
  }

  return "clothing";
}
