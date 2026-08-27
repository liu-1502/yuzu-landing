import type { Product } from "@/data/content";

type Slice = Product["slices"][number];

const TAU = Math.PI * 2;

/**
 * Easing chung cho biểu đồ. `cubic-bezier(.22,1,.36,1)` cũ vọt rất nhanh rồi phanh
 * gấp nên trông giật như prototype; đường này ra vào đều hơn, cộng thời lượng dài
 * hơn cho cảm giác mượt.
 */
const EASE = "cubic-bezier(.25,.46,.45,.94)";

/**
 * Chia góc: có weight thì theo tỉ trọng, không thì chia đều.
 *
 * Khe hở 0.03 rad mỗi đầu. Khe là góc nên bề rộng thật nở theo bán kính: 0.06 rad
 * cho ra khe ~4.8 đơn vị ở vành ngoài, nhìn như tổng không đủ 100%. 0.03 + stroke bo
 * góc 1 đơn vị ra khe thật ~0.4 đơn vị ở vành — các múi gần như chạm nhau.
 * Vẫn chặn trần theo bề rộng múi, không thì múi 1% bị khe ăn hết và path lộn ngược.
 */
const GAP = 0.03;

/**
 * Góc giữa của từng múi, để chỗ khác đặt thẻ mô tả đúng vị trí múi đó.
 * `right` = múi nằm nửa phải của quả chanh — cùng phép thử mà nhãn trong biểu đồ
 * đang dùng để chọn bên đặt chữ.
 */
export function sliceAngles(slices: Slice[]) {
  return layout(slices).map(({ i, mid }) => ({ i, mid, right: Math.cos(mid) >= 0 }));
}

function layout(slices: Slice[]) {
  const total = slices.reduce((a, s) => a + (s.weight ?? 0), 0);
  const even = total <= 0;
  const n = even ? slices.length : total;
  let cur = -Math.PI / 2;

  return slices.map((slice, i) => {
    const share = even ? 1 / n : (slice.weight ?? 0) / n;
    const span = share * TAU;
    const gap = Math.min(GAP, span * 0.3);
    const a0 = cur + gap;
    const a1 = cur + span - gap;
    cur += span;
    return { slice, i, a0, a1, mid: (a0 + a1) / 2, share };
  });
}

const pt = (r: number, a: number) => [50 + r * Math.cos(a), 50 + r * Math.sin(a)] as const;

/** Múi: cung ngoài r=40, cung trong r=8.5 */
function wedge(a0: number, a1: number) {
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const [x0, y0] = pt(40, a0);
  const [x1, y1] = pt(40, a1);
  const [x2, y2] = pt(8.5, a1);
  const [x3, y3] = pt(8.5, a0);
  return `M${x0} ${y0} A40 40 0 ${large} 1 ${x1} ${y1} L${x2} ${y2} A8.5 8.5 0 ${large} 0 ${x3} ${y3} Z`;
}

/**
 * Biểu đồ "múi cam" — section Products.
 * viewBox -38 -10 176 124 để chừa chỗ nhãn hai bên, giống trang gốc.
 */
export function CitrusChart({
  id,
  accent,
  slices,
  active,
  setActive,
  interactive = true,
}: {
  id: string;
  accent: string;
  slices: Slice[];
  active: number | null;
  setActive: (i: number | null) => void;
  interactive?: boolean;
}) {
  const arr = layout(slices);

  /* Chiều cao viewBox 116 chứ không phải 124: phần vẽ thấp nhất trong cả ba sản
     phẩm là nhãn "AAA CLOs" của Prime ở y=102.7, để 124 thì thừa 11–19 đơn vị
     trống dưới đáy — quy ra 26–35px khoảng hở chết trên mobile. */
  return (
    <svg viewBox="-38 -10 176 116" className="block w-full" aria-hidden>
      <defs>
        <radialGradient id={`plate-${id}`}>
          <stop offset="50%" stopColor={accent} stopOpacity="0.7" />
          <stop offset="100%" stopColor={accent} stopOpacity="1" />
        </radialGradient>
      </defs>

      <circle
        cx={50}
        cy={50}
        r={45.25}
        fill="none"
        stroke={accent}
        strokeWidth={4.5}
        opacity={0.2}
        style={{ transition: `stroke .7s ${EASE}` }}
      />

      {arr.map(({ slice, i, a0, a1, share }) => {
        const isActive = active === i;
        const dim = active !== null && !isActive;
        const color = slice.upcoming ? "var(--faint)" : (slice.color ?? accent);
        const paint = slice.color || slice.upcoming ? color : `url(#plate-${id})`;
        const veins = Math.max(2, Math.round(30 * share));
        const opacity = slice.upcoming
          ? dim
            ? 0.14
            : isActive
              ? 0.42
              : 0.26
          : dim
            ? 0.25
            : isActive
              ? 1
              : 0.62;

        return (
          <g
            key={slice.label}
            /* Pointer event chứ không phải onMouseEnter/Leave: trên cảm ứng,
               mouseenter chỉ được trình duyệt giả lập lúc chạm và không có
               mouseleave tương ứng, nên múi chọn xong là kẹt luôn. Ở đây tách
               bạch — chuột thì rê để xem, chạm thì bấm để chọn (bấm lại để bỏ). */
            onPointerEnter={
              interactive ? (e) => e.pointerType === "mouse" && setActive(i) : undefined
            }
            onPointerLeave={
              interactive ? (e) => e.pointerType === "mouse" && setActive(null) : undefined
            }
            onPointerDown={
              interactive
                ? (e) => e.pointerType !== "mouse" && setActive(active === i ? null : i)
                : undefined
            }
            /* Bàn phím cũng phải tới được, không thì thông tin múi chỉ dành cho
               người dùng chuột. */
            tabIndex={interactive ? 0 : undefined}
            role={interactive ? "button" : undefined}
            aria-label={interactive ? `${slice.label}${slice.weight !== null ? `, ${slice.weight}%` : ""}` : undefined}
            onFocus={interactive ? () => setActive(i) : undefined}
            onBlur={interactive ? () => setActive(null) : undefined}
            style={{
              cursor: interactive ? "pointer" : "default",
              // Múi active PHÌNH TO quanh tâm biểu đồ, không đẩy ra ngoài.
              // `transformBox: view-box` để `transformOrigin` tính theo hệ viewBox,
              // nếu để mặc định (fill-box) thì gốc rơi vào bbox của riêng múi.
              transform: isActive ? "scale(1.06)" : "scale(1)",
              transformOrigin: "50px 50px",
              transformBox: "view-box",
              transition: `transform .7s ${EASE}`,
            }}
          >
            {/* stroke cùng màu fill + linejoin round = bo tròn hai đầu cung ngoài */}
            <path
              d={wedge(a0, a1)}
              fill={paint}
              stroke={paint}
              strokeWidth={1}
              strokeLinejoin="round"
              opacity={opacity}
              style={{ transition: `opacity .45s ${EASE}` }}
            />
            {Array.from({ length: veins }, (_, k) => {
              const a = a0 + ((k + 1) / (veins + 1)) * (a1 - a0);
              const [x1, y1] = pt(11, a);
              const [x2, y2] = pt(37.5, a);
              return (
                <line
                  key={k}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="var(--surface)"
                  strokeWidth={0.5}
                  opacity={dim ? 0.15 : 0.42}
                  strokeLinecap="round"
                  style={{ transition: `opacity .45s ${EASE}` }}
                />
              );
            })}
          </g>
        );
      })}

      {arr.map(({ slice, i, mid }) => {
        const isActive = active === i;
        const dim = active !== null && !isActive;
        const color = slice.upcoming ? "var(--faint)" : (slice.color ?? accent);
        const [lx, ly] = pt(52, mid);
        const [ex, ey] = pt(41.5, mid);
        const right = Math.cos(mid) >= 0;

        return (
          <g key={slice.label} style={{ pointerEvents: "none" }}>
            <line
              x1={ex}
              y1={ey}
              x2={lx}
              y2={ly}
              stroke={color}
              strokeWidth={0.7}
              strokeLinecap="round"
              opacity={dim ? 0.25 : 0.85}
            />
            <line
              x1={lx}
              y1={ly}
              x2={lx + (right ? 7 : -7)}
              y2={ly}
              stroke={color}
              strokeWidth={0.7}
              strokeLinecap="round"
              opacity={dim ? 0.25 : 0.85}
            />
            <text
              x={lx + (right ? 8.5 : -8.5)}
              y={ly - 0.4}
              textAnchor={right ? "start" : "end"}
              className="font-[family-name:var(--font-mono)]"
              fontSize={4.4}
              fill="var(--foreground)"
              opacity={dim ? 0.3 : 1}
              style={{ transition: `opacity .45s ${EASE}` }}
            >
              {slice.short}
            </text>
            {slice.weight !== null && (
              <text
                x={lx + (right ? 8.5 : -8.5)}
                y={ly + 4}
                textAnchor={right ? "start" : "end"}
                className="font-[family-name:var(--font-mono)]"
                fontSize={3.9}
                fill={color}
                opacity={dim ? 0.3 : 1}
              >
                {slice.weight}%
              </text>
            )}
          </g>
        );
      })}

      <circle cx={50} cy={50} r={7} fill={accent} opacity={0.28} />
    </svg>
  );
}

/** Thẻ mô tả múi đang hover.
 *
 * Mọi thẻ đều được render và chồng lên nhau trong CÙNG một ô lưới (col/row-start-1),
 * nên chiều cao khung luôn bằng thẻ CAO NHẤT — không thẻ nào tràn lên đè quả chanh,
 * và đổi múi cũng không làm layout nhảy.
 *
 * Thẻ để mặc định `stretch` (không self-end/self-start): mọi thẻ cao bằng nhau nên
 * vừa neo đáy, vừa cách quả chanh đúng mt-8 = 32px. Neo một đầu thì đầu kia phải
 * xê dịch theo độ dài text — thẻ ngắn sẽ tụt xa quả chanh. Nội dung vẫn căn giữa
 * theo chiều dọc nhờ items-center.
 */
export function SliceDetail({
  slices,
  accent,
  active,
}: {
  slices: Slice[];
  accent: string;
  active: number | null;
}) {
  return (
    <div className="mt-3 grid grid-cols-1 sm:mt-8">
      {slices.map((s, i) => {
        const on = i === active;
        return (
        <div
          key={`${i}-${on}`}
          aria-hidden={!on}
          className="col-start-1 row-start-1 mx-auto flex max-w-[42ch] items-center gap-3 rounded-md bg-surface px-3.5 py-3 shadow-[0_4px_14px_color-mix(in_srgb,var(--foreground)_7%,transparent)]"
          style={{
            visibility: on ? "visible" : "hidden",
            animation: on ? `slice-detail-in .34s ${EASE}` : undefined,
          }}
        >
          <span
            className="h-[7px] w-[7px] shrink-0 self-start rounded-[2px] sm:mt-[5px]"
            style={{ background: s.upcoming ? "var(--faint)" : (s.color ?? accent) }}
          />

          <span className="min-w-0 flex-1">
            <span className="block text-[12.5px] font-medium leading-tight text-foreground">
              {s.label}
            </span>
            <span className="mt-1 block text-[11.5px] leading-[1.5] text-faint">{s.detail}</span>
          </span>

          {/* Tỉ trọng: cỡ lớn, neo sát mép phải của thẻ */}
          {s.weight !== null && (
            <span
              className="data shrink-0 text-[30px] font-semibold leading-none tracking-[-0.02em]"
              style={{ color: s.color ?? accent }}
            >
              {s.weight}%
            </span>
          )}
        </div>
        );
      })}
    </div>
  );
}
