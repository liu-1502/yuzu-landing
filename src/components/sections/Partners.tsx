import { asset, partnerRows, type PartnerItem } from "@/data/content";
import { cn } from "@/lib/utils";

/**
 * 9 ô logo, 3 ô cho mỗi nhóm.
 * Mobile (3 cột): mỗi nhóm là một cột, 3 logo xếp dọc.
 * Desktop (9 cột): mỗi nhóm chiếm 3 cột liền, nằm ngay dưới nhãn của nó.
 */
/** Vị trí băng logo của từng nhóm: mobile 1 cột, desktop chiếm trọn 3 cột của nhóm. */
const BAND_PLACE = [
  "col-start-1 row-start-2 md:col-start-1 md:col-span-3",
  "col-start-2 row-start-2 md:col-start-4 md:col-span-3",
  "col-start-3 row-start-2 md:col-start-7 md:col-span-3",
];

const LABEL_PLACE = [
  "col-start-1 row-start-1 md:col-start-1 md:col-span-3",
  "col-start-2 row-start-1 md:col-start-4 md:col-span-3",
  "col-start-3 row-start-1 md:col-start-7 md:col-span-3",
];

/** Logo partner: ảnh màu, mask một màu (mono), logo ngang (wide) hoặc chữ cái dự phòng. */
function PartnerLogo({ partner }: { partner: PartnerItem }) {
  if (!partner.logo) {
    return (
      <span
        aria-hidden
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line-strong font-mono text-[11px] font-semibold text-accent"
      >
        {partner.name.slice(0, 1)}
      </span>
    );
  }

  const src = asset(partner.logo);

  if (partner.mono) {
    return (
      <span
        aria-hidden
        className="h-7 w-7 shrink-0 bg-current"
        style={{
          WebkitMaskImage: `url(${src})`,
          maskImage: `url(${src})`,
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
    );
  }

  return (
    <img
      src={src}
      alt=""
      width={partner.w}
      height={partner.h}
      loading="lazy"
      decoding="async"
      className={
        partner.wide
          ? "h-6 w-auto max-w-[88px] shrink-0 object-contain"
          : "h-7 w-7 shrink-0 rounded-full object-cover"
      }
    />
  );
}

export function Partners() {
  return (
    <section
      id="partners"
      aria-label="Partnerships"
      className="bg-surface"
    >
      <div className="px-6 lg:px-[60px]">
        <div className="relative mx-auto max-w-[1280px] before:absolute before:inset-x-[calc(50%-50vw)] before:top-0 before:h-px before:bg-line-solid before:content-[''] after:absolute after:inset-x-[calc(50%-50vw)] after:bottom-0 after:h-px after:bg-line-solid after:content-['']">
          <div className="grid grid-cols-3 gap-px border-x border-line-solid bg-line-solid md:grid-cols-9">
            {/* hàng nhãn — mỗi nhóm span 2 cột ở desktop */}
            {partnerRows.map((row, g) => (
              <div
                key={row.label}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 bg-surface px-2 py-3 sm:flex-row sm:gap-2",
                  LABEL_PLACE[g],
                )}
              >
                <span className="data text-[17px] font-semibold leading-none text-foreground">
                  {row.items.length}
                </span>
                <span className="whitespace-nowrap font-mono text-[10px] font-semibold uppercase leading-none tracking-[0.08em] text-muted-foreground sm:text-[11.5px] sm:tracking-[0.16em]">
                  {row.label}
                </span>
              </div>
            ))}

            {/* hàng logo — mỗi nhóm một băng chạy ngang, có cả logo lẫn tên */}
            {partnerRows.map((row, g) => {
              // Hệ số khác nhau cho từng nhóm: chuẩn hoá cùng tốc độ thì ba băng trôi
              // y hệt nhau, đọc ra thành một dòng liền. Cùng chiều, chỉ khác tốc độ.
              const PACE = [3.4, 2.5, 4.4];
              const dur = `${row.items.length * PACE[g]}s`;
              /**
               * Trả về một track. Bản sao phải là SIBLING trực tiếp trong flex, không
               * bọc thêm <div> — div bọc không có `shrink-0` nên co lại, tạo khe hở ở
               * chỗ nối hai bản.
               */
              const renderTrack = (hidden: boolean) => (
                <div
                  key={hidden ? "copy" : "main"}
                  aria-hidden={hidden || undefined}
                  className="partner-track flex shrink-0 items-center gap-9 pr-9"
                  style={{ "--marquee-dur": dur } as React.CSSProperties}
                >
                  {row.items.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex shrink-0 items-center gap-2 text-muted-foreground transition-colors duration-300 hover:text-foreground"
                    >
                      <PartnerLogo partner={item} />
                      <span className="whitespace-nowrap text-[14px] font-medium text-foreground">
                        {item.name}
                      </span>
                    </a>
                  ))}
                </div>
              );

              return (
                <div
                  key={row.label}
                  className={cn(
                    "partner-marquee relative flex h-[64px] items-center overflow-hidden bg-surface",
                    BAND_PLACE[g],
                  )}
                >
                  {renderTrack(false)}
                  {/* bản sao để vòng lặp liền mạch */}
                  {renderTrack(true)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
