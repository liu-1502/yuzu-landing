import { products } from "@/data/content";
import { alphaPage } from "@/data/productPages";
import { Partners } from "@/components/sections/Partners";
import { Composition, Terms } from "@/components/product/ProductBody";
import {
  ClosingCta,
  KpiRow,
  PathIn,
  ProductHero,
  Protection,
} from "@/components/product/ProductShell";

export default function Alpha() {
  const p = products.find((x) => x.id === "alpha")!;

  return (
    <>
      <ProductHero page={alphaPage} />
      <KpiRow items={alphaPage.kpis} />
      <Composition p={p} head={alphaPage.composition} />
      {/* Terms bao luôn bộ token — bản dev để chung một section. */}
      <Terms
        p={p}
        head={alphaPage.terms}
        tokens={alphaPage.tokens}
        tokensNote={alphaPage.tokensNote}
      />
      <Protection {...alphaPage.protection} />
      <PathIn {...alphaPage.path} />
      <Partners />
      <ClosingCta closing={alphaPage.closing} />
    </>
  );
}
