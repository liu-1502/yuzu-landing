import type { CSSProperties } from "react";
import { MARK_PATHS } from "@/components/ui/YuzuMark";

/**
 * Lớp hạt cam nổi phía sau hero trang sản phẩm — port từ dev.yuzu.money.
 *
 * 30 hạt, cứ 3 hạt thì 1 hạt là mark Yuzu 8 cánh, còn lại là vòng tròn viền
 * (đúng tỉ lệ 20 tròn / 10 mark đo được trên trang gốc). Tham số của mỗi hạt
 * nằm trong các khoảng đo trực tiếp từ trang gốc:
 *
 *   left −0..92%   size 4..26px   duration 16..36s   delay −32..0s
 *   drift-x −37..39px   drift-spin −92..103deg   drift-peak 0.14..0.36
 *   drift-top −327..−117px
 *
 * Delay ÂM là điểm quan trọng: nó đẩy mỗi hạt vào một pha khác nhau ngay từ
 * frame đầu, nên vừa vào trang đã thấy hạt rải khắp chiều cao thay vì cả 30 hạt
 * cùng bò lên từ đáy.
 *
 * Random phải tiền định (LCG có seed) chứ không dùng Math.random: mỗi lần React
 * render lại là một bộ số mới, hạt sẽ nhảy vị trí.
 */

const COUNT = 30;

/** LCG 32-bit — cùng seed thì cùng dãy, đủ đều cho việc rải hạt. */
function makeRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

type Particle = {
  isMark: boolean;
  style: CSSProperties;
};

function build(seed: number): Particle[] {
  const rand = makeRandom(seed);
  const lerp = (a: number, b: number) => a + rand() * (b - a);

  return Array.from({ length: COUNT }, (_, i) => {
    const size = lerp(4, 26);
    const dur = lerp(16, 36);
    return {
      // 1/3 số hạt là mark, phần còn lại là vòng tròn.
      isMark: i % 3 === 0,
      style: {
        left: `${lerp(0, 92)}%`,
        width: `${size}px`,
        height: `${size}px`,
        animation: `citrus-rise ${dur}s linear ${-lerp(0, dur)}s infinite`,
        "--drift-x": `${lerp(-37, 39)}px`,
        "--drift-spin": `${lerp(-92, 103)}deg`,
        "--drift-peak": lerp(0.14, 0.36).toFixed(3),
        "--drift-top": `${Math.round(lerp(-327, -117))}px`,
      } as CSSProperties,
    };
  });
}

export function CitrusField({ seed = 1 }: { seed?: number }) {
  const particles = build(seed);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <span key={i} className="citrus-rise absolute bottom-0 block text-accent" style={p.style}>
          {p.isMark ? (
            <svg viewBox="0 0 146 146" fill="currentColor" className="size-full" aria-hidden>
              {/* Bỏ path cuối (vòng cung ngoài) — ở cỡ 4–26px nó chỉ thành một
                  vệt mờ, giữ lại 8 cánh cho hình đọc được. */}
              {MARK_PATHS.slice(0, 8).map((d) => (
                <path key={d} d={d} />
              ))}
            </svg>
          ) : (
            <span className="block size-full rounded-full border border-current" />
          )}
        </span>
      ))}
    </div>
  );
}
