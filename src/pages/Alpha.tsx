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
  TokenSet,
} from "@/components/product/ProductShell";

export default function Alpha() {
  const p = products.find((x) => x.id === "alpha")!;

  return (
    <>
      <ProductHero page={alphaPage} />
      <KpiRow items={alphaPage.kpis} />
      <Composition p={p} head={alphaPage.composition} />
      <Terms p={p} head={alphaPage.terms} />
      <TokenSet tokens={alphaPage.tokens} note={alphaPage.tokensNote} />
      <Protection {...alphaPage.protection} />
      <PathIn {...alphaPage.path} />
      <Partners />
      <ClosingCta closing={alphaPage.closing} />
    </>
  );
}
