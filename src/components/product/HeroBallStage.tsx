import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { HeroBall } from "@/components/product/HeroBall";
import type { ProductPage } from "@/data/productPages";
import { productOrder } from "@/data/productPages";

/**
 * Quả cầu hero của trang sản phẩm, dựng theo ĐÚNG cơ chế đo được trên
 * dev.yuzu.money để nó BIẾN HÌNH khi bấm prev/next thay vì nhảy:
 *
 *   host   perspective: 1100px
 *   hộp    transform-style: preserve-3d; transform: translateZ(-112.5px) rotateY(θ)
 *   mặt    transform: rotateY(góc) translateZ(112.5px); backface-visibility: hidden
 *
 * Bên dev mỗi sản phẩm một mặt ở `rotateY(i*90deg)` (alpha 0, prime 90,
 * marketplace 180) và lúc chuyển họ chèn tạm mặt thứ hai rồi quay hộp. Ở đây làm
 * y vậy: quay ±90° theo hướng đi, mặt mới đặt đúng góc để nó xoay tới trước.
 *
 * Vì sao component này nằm ở `Layout` chứ không trong hero: prev/next là ĐỔI
 * ROUTE, nên `ProductHero` remount — quả cầu nằm trong đó thì mỗi lần chuyển là
 * unmount/mount, không có gì để mà xoay. `Layout` giữ nguyên `<main>` qua mọi
 * route nên stage sống sót; hero chỉ còn một ô rỗng 225px làm chỗ giữ khoảng,
 * đúng như bản dev (thẻ 225px của họ trống hoàn toàn, quả cầu là lớp overlay).
 *
 * Thời lượng và easing là của mình, KHÔNG đọc được từ dev: mọi `transition` trên
 * quả cầu bên dev đều `0s` vì họ chạy bằng JS từng frame.
 */

/** Nửa đường kính quả cầu 225px — bằng `translateZ` mà bản dev dùng. */
const DEPTH = 112.5;
const STEP = 90;
const DUR = 620;
/** Quả cầu trôi tối đa bấy nhiêu px theo con trỏ. */
const DRIFT = 10;
/** Ngoài bán kính này thì coi như con trỏ ở xa, quả cầu về chỗ. */
const REACH = 420;

const SCOPE: Record<ProductPage["id"], string> = {
  alpha: "alpha-scope",
  prime: "prime-scope",
  marketplace: "mkt-scope",
};

type Face = { id: ProductPage["id"]; at: number };

function idFromPath(pathname: string): ProductPage["id"] | null {
  const seg = pathname.replace(/^\/+|\/+$/g, "");
  return (productOrder as string[]).includes(seg) ? (seg as ProductPage["id"]) : null;
}

/**
 * Một bước đi từ `from` sang `to`: +1 là next, -1 là prev.
 *
 * Ba sản phẩm nối thành vòng nên mọi cặp đều kề nhau theo một trong hai chiều —
 * kể cả khi người dùng nhảy thẳng từ menu Products (alpha → marketplace là prev).
 * Nhờ vậy mỗi lần chuyển luôn chỉ quay 90°, không bao giờ quay qua ô trống 270°.
 */
function step(from: ProductPage["id"], to: ProductPage["id"]) {
  const n = productOrder.length;
  const d = (productOrder.indexOf(to) - productOrder.indexOf(from) + n) % n;
  return d === 1 ? 1 : -1;
}

/**
 * Quả cầu nhích nhẹ theo con trỏ.
 *
 * Nghe `mousemove` ở cấp `window` chứ không gắn vào chính quả cầu: lớp phủ chứa
 * nó là `pointer-events: none` nên không bao giờ tự nhận được sự kiện chuột.
 *
 * Chỉ TỊNH TIẾN, không xoay: hộp bên trong đang giữ `rotateY` của màn xoay
 * prev/next, thêm xoay ở đây sẽ đánh nhau với nó.
 */
function useDrift(ref: React.RefObject<HTMLDivElement | null>, on: boolean) {
  const [d, setD] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!on) return;
    let raf = 0;
    let last = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      last = { x: e.clientX, y: e.clientY };
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dx = last.x - (r.left + r.width / 2);
        const dy = last.y - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy);
        // Càng ra xa càng nhạt dần, quá REACH thì đứng yên hẳn.
        const k = dist > REACH ? 0 : (1 - dist / REACH) / Math.max(dist, 1);
        setD({ x: dx * k * DRIFT, y: dy * k * DRIFT });
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, on]);

  return d;
}

/** Đo ô giữ chỗ trong hero để đặt stage đúng vị trí, thay vì gán cứng 112px:
 *  quả cầu là 200px dưới `sm` và 225px từ `sm` trở lên. */
function useSlot(pathname: string) {
  const [slot, setSlot] = useState<{ top: number; size: number } | null>(null);

  useLayoutEffect(() => {
    let raf = 0;
    const read = () => {
      const el = document.querySelector<HTMLElement>("[data-ball-slot]");
      const main = document.getElementById("main");
      if (!el || !main) {
        setSlot(null);
        return;
      }
      const r = el.getBoundingClientRect();
      const m = main.getBoundingClientRect();
      setSlot({ top: Math.round(r.top - m.top), size: Math.round(r.width) });
    };
    // Đo sau một nhịp layout: lúc effect chạy thì route mới vừa mount, ảnh và
    // font còn đang xếp nên rect chưa đứng yên.
    raf = requestAnimationFrame(read);
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(read);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [pathname]);

  return slot;
}

export function HeroBallStage() {
  const { pathname } = useLocation();
  const active = idFromPath(pathname);
  const slot = useSlot(pathname);

  const [angle, setAngle] = useState(0);
  const [faces, setFaces] = useState<Face[]>(active ? [{ id: active, at: 0 }] : []);
  const [shown, setShown] = useState(false);
  const fromRef = useRef(active);
  const angleRef = useRef(0);
  const ball = useRef<HTMLDivElement>(null);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  /* `(hover: hover)`: chỉ chạy trên máy có con trỏ thật. Máy cảm ứng đôi khi tự
     sinh một `mousemove` khi chạm — không chặn thì quả cầu kẹt lệch vĩnh viễn vì
     sẽ không bao giờ có sự kiện tiếp theo kéo nó về. */
  const coTro =
    typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;
  const drift = useDrift(ball, !!active && !reducedMotion && coTro);

  useEffect(() => {
    const from = fromRef.current;
    fromRef.current = active;
    if (!active) return;

    // Vào thẳng một trang sản phẩm (hoặc từ landing sang): không có gì để xoay,
    // đặt mặt đó ngay trước mặt.
    if (!from || from === active) {
      setFaces([{ id: active, at: -angleRef.current }]);
      return;
    }

    const next = angleRef.current - STEP * step(from, active);
    angleRef.current = next;
    // Hai mặt cùng lúc: mặt đang đứng trước và mặt sẽ xoay tới — giống bản dev.
    setFaces((prev) => [...prev.slice(-1), { id: active, at: -next }]);
    setAngle(next);

    const t = window.setTimeout(() => setFaces([{ id: active, at: -next }]), DUR);
    return () => clearTimeout(t);
  }, [active]);

  /* Hiện dần lần đầu, như bản dev. Tách khỏi effect trên để lần chuyển trang sau
     không mờ lại — chỉ xoay. */
  useEffect(() => {
    if (active) setShown(true);
  }, [active]);

  if (!active || !slot) return null;

  const reduced = reducedMotion;
  const depth = (slot.size / 225) * DEPTH;

  return (
    /* Div ngoài KHÔNG được mang class scope: nó là con trực tiếp của `main`, mà
       `main > .alpha-scope` là rule sơn nền + ép `min-height: 100svh` cho wrapper
       trang sản phẩm. Trúng rule đó thì stage thành một khối đục cao hết màn, đặt
       `z-10` ngay trên hero và trùm kín chữ. Class scope đặt ở div TRONG — vẫn đủ
       để quả cầu đọc `--surface` / `--prime` của đúng sản phẩm. */
    <div
      className="pointer-events-none absolute inset-x-0 z-10 flex justify-center"
      style={{ top: slot.top, perspective: 1100 }}
      aria-hidden
    >
      <div
        ref={ball}
        className={`relative ${SCOPE[active]}`}
        style={{
          width: slot.size,
          height: slot.size,
          opacity: shown ? 1 : 0,
          transform: shown
            ? `translate3d(${drift.x.toFixed(1)}px, ${drift.y.toFixed(1)}px, 0)`
            : "translateY(16px)",
          /* Lúc chưa hiện thì dùng nhịp .6s của màn hiện dần; hiện rồi thì đổi
             sang nhịp ngắn để bám con trỏ cho kịp mà vẫn mượt. */
          transition: reduced
            ? undefined
            : shown
              ? "transform .45s cubic-bezier(.22,.61,.36,1)"
              : "opacity .6s ease, transform .6s cubic-bezier(.22,.61,.36,1)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
            willChange: "transform",
            transform: `translateZ(${-depth}px) rotateY(${angle}deg)`,
            transition: reduced ? undefined : `transform ${DUR}ms cubic-bezier(.22,.61,.36,1)`,
          }}
        >
          {faces.map((f) => (
            <div
              key={`${f.id}-${f.at}`}
              className="absolute inset-0"
              style={{
                transform: `rotateY(${f.at}deg) translateZ(${depth}px)`,
                backfaceVisibility: "hidden",
              }}
            >
              <HeroBall id={f.id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
