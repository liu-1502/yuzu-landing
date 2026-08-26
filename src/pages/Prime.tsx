import { primePage } from "@/data/productPages";
import { ProductPartners } from "@/components/product/ProductPartners";
import { Clo, Lending, Sources, TBills } from "@/components/product/PrimeSections";
import { ClosingCta, KpiRow, ProductHero } from "@/components/product/ProductShell";

export default function Prime() {
  return (
    /* prime-scope: khai lại --accent / --mark / --background / --surface cho cả trang,
       giống cách bản dev bọc root trong .prime-scope. Không có nó thì trang vẫn ra
       màu Alpha. */
    <div className="prime-scope">
      {/* Prime không có Terms / bộ token / Protection / Path in như hai trang kia:
          trang gốc dựng nó thành một bài research về ba mảng tài sản. */}
      <ProductHero page={{ ...primePage, id: "prime" }} />
      <KpiRow items={primePage.kpis} />
      <TBills data={primePage.tbills} />
      <Clo data={primePage.clo} />
      <Lending data={primePage.lending} />
      <ProductPartners />
      <ClosingCta closing={primePage.closing} />
      <Sources data={primePage.sources} />
    </div>
  );
}
