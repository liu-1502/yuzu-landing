import { products } from "@/data/content";
import { alphaPage } from "@/data/productPages";
import { ProductPartners } from "@/components/product/ProductPartners";
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
    /* alpha-scope: bản dev cũng bọc trang Alpha trong một scope riêng (nền và
       viền ngả xanh hơn token gốc). */
    <div className="alpha-scope">
      <ProductHero page={alphaPage} />
      <KpiRow items={alphaPage.kpis} />
      <Composition p={p} head={alphaPage.composition} />
      {/* Terms bao luôn bộ token — bản dev để chung một section. */}
      <Terms
        p={p}
        head={alphaPage.terms}
        tokens={alphaPage.tokens}
        tokensNote={alphaPage.tokensNote}
        overlap
      />
      <Protection {...alphaPage.protection} />
      <PathIn {...alphaPage.path} />
      <ProductPartners />
      <ClosingCta closing={alphaPage.closing} />
    </div>
  );
}
