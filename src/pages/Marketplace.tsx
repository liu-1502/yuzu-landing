import { products } from "@/data/content";
import { marketplacePage } from "@/data/productPages";
import { ProductPartners } from "@/components/product/ProductPartners";
import { Composition, Terms } from "@/components/product/ProductBody";
import {
  ClosingCta,
  KpiRow,
  PathIn,
  ProductHero,
  Protection,
} from "@/components/product/ProductShell";

export default function Marketplace() {
  const p = products.find((x) => x.id === "marketplace")!;

  return (
    <div className="mkt-scope">
      <ProductHero page={marketplacePage} />
      <KpiRow items={marketplacePage.kpis} />
      <Composition
        p={p}
        head={marketplacePage.composition}
        vaults={marketplacePage.vaults}
      />
      <Terms
        p={p}
        head={marketplacePage.terms}
        tokens={marketplacePage.tokens}
        tokensNote={marketplacePage.tokensNote}
      />
      <Protection {...marketplacePage.protection} />
      <PathIn {...marketplacePage.path} />
      <ProductPartners />
      <ClosingCta closing={marketplacePage.closing} />
    </div>
  );
}
