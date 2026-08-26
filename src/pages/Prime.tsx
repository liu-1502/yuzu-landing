import { primePage } from "@/data/productPages";
import { Partners } from "@/components/sections/Partners";
import { Clo, Lending, Sources, TBills } from "@/components/product/PrimeSections";
import { ClosingCta, KpiRow, ProductHero } from "@/components/product/ProductShell";

export default function Prime() {
  return (
    <>
      {/* Prime không có Terms / bộ token / Protection / Path in như hai trang kia:
          trang gốc dựng nó thành một bài research về ba mảng tài sản. */}
      <ProductHero page={{ ...primePage, id: "prime" }} />
      <KpiRow items={primePage.kpis} />
      <TBills data={primePage.tbills} />
      <Clo data={primePage.clo} />
      <Lending data={primePage.lending} />
      <Partners />
      <ClosingCta closing={primePage.closing} />
      <Sources data={primePage.sources} />
    </>
  );
}
