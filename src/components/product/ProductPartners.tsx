import { asset } from "@/data/content";
import {
  partnerHeading,
  partnerRowA,
  partnerRowB,
  type PartnerLogo,
} from "@/data/productPartners";
import { cn } from "@/lib/utils";

/**
 * Dải "Trusted by leading institutions" của trang sản phẩm.
 *
 * KHÔNG dùng lại `Partners` của landing: bản dev cho trang sản phẩm một dải
 * khác hẳn — hai hàng logo chạy ngược chiều nhau thay vì lưới 3 băng có nhãn
 * Chains/Protocols/Infrastructure. Đo được ở 1512px: dev 308px, lưới của
 * landing chỉ 106px.
 *
 * Mỗi logo có một cặp file sáng/tối; đổi bằng CSS (`dark:` ẩn/hiện) chứ không
 * bằng JS, để không nhảy ảnh lúc chuyển theme.
 */
function Row({ logos, reverse }: { logos: PartnerLogo[]; reverse?: boolean }) {
  // Nhân đôi danh sách để vòng lặp khớp mép: track dịch -50% là về đúng chỗ cũ.
  const track = [...logos, ...logos];

  return (
    <div className="relative w-full overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 z-10 h-full w-24 bg-gradient-to-r from-[var(--surface)] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 z-10 h-full w-24 bg-gradient-to-l from-[var(--surface)] to-transparent"
      />
      <div
        className={cn(
          "flex w-max items-center gap-8 md:gap-12",
          reverse ? "prime-marquee-rev" : "prime-marquee",
        )}
      >
        {track.map((l, i) => (
          <span
            key={`${l.name}-${i}`}
            className="relative h-6 w-28 shrink-0 opacity-90 transition-opacity duration-300 hover:opacity-100 md:h-12 md:w-36"
          >
            <img
              src={asset(l.light)}
              alt={i < logos.length ? l.name : ""}
              aria-hidden={i >= logos.length || undefined}
              loading="lazy"
              className="absolute inset-0 size-full object-contain dark:hidden"
            />
            <img
              src={asset(l.dark)}
              alt=""
              aria-hidden
              loading="lazy"
              className="absolute inset-0 hidden size-full object-contain dark:block"
            />
          </span>
        ))}
      </div>
    </div>
  );
}

export function ProductPartners() {
  return (
    <section
      aria-label={partnerHeading}
      className="flex flex-col items-center gap-8 bg-surface py-14"
    >
      {/* Cùng dạng với kicker của các section: IN HOA, giãn chữ, màu brand —
          `.kicker` tự đọc `--accent` trong scope sản phẩm nên Alpha ra xanh lá,
          Prime nâu vàng, Marketplace tím. `text-center` không ăn vì `.kicker`
          là `inline-flex`, nên căn giữa bằng flex ở thẻ bọc. */}
      <p className="flex justify-center">
        <span className="kicker">{partnerHeading}</span>
      </p>
      <div className="flex w-full flex-col gap-10">
        <Row logos={partnerRowA} />
        <Row logos={partnerRowB} reverse />
      </div>
    </section>
  );
}
