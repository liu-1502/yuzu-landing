import { products } from "@/data/content";
import { marketplacePage } from "@/data/productPages";
import { Partners } from "@/components/sections/Partners";
import { Composition, Terms } from "@/components/product/ProductBody";
import { VaultCards } from "@/components/product/PrimeSections";
import {
  ClosingCta,
  KpiRow,
  PathIn,
  ProductHero,
  Protection,
  TokenSet,
} from "@/components/product/ProductShell";

export default function Marketplace() {
  const p = products.find((x) => x.id === "marketplace")!;

  return (
    <>
      <ProductHero page={marketplacePage} />
      <KpiRow items={marketplacePage.kpis} />
      {/* Marketplace: mỗi vault là một exposure riêng nên phần Composition dùng
          thẻ vault có bảng chỉ số, thay cho danh sách trọng số của Alpha. */}
      <Composition p={p} head={marketplacePage.composition}>
        <VaultCards vaults={marketplacePage.vaults ?? []} />
      </Composition>
      <Terms p={p} head={marketplacePage.terms} />
      <TokenSet tokens={marketplacePage.tokens} note={marketplacePage.tokensNote} />
      <Protection {...marketplacePage.protection} />
      <PathIn {...marketplacePage.path} />
      <Partners />
      <ClosingCta closing={marketplacePage.closing} />
    </>
  );
}
