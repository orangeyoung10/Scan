export const AFFILIATE_CONFIG = {
  amazonTag: (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_AMAZON_TAG) || "scanbeads-20",
  products: {
    blackBeadsJar: "https://www.amazon.com/dp/B000I0RTRY?tag=",
    whiteBeadsJar: "https://www.amazon.com/dp/B0000AW5GE?tag=",
    pegboardsPack: "https://www.amazon.com/dp/B000VTO4QY?tag=",
    ironingPaper: "https://www.amazon.com/dp/B000VTPF22?tag=",
    bundlePack: "https://www.amazon.com/dp/B0018N260Q?tag=",
    tweezers: "https://www.amazon.com/dp/B000VTO4PQ?tag="
  },
  buyMeACoffeeUrl: "https://buymeacoffee.com/scanbeads"
};

export function getAffiliateUrl(productKey: keyof typeof AFFILIATE_CONFIG.products): string {
  const base = AFFILIATE_CONFIG.products[productKey];
  return `${base}${AFFILIATE_CONFIG.amazonTag}`;
}
