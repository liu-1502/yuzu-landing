import { asset } from "@/data/content";
import type { ProductPage } from "@/data/productPages";

/**
 * Quả cầu ở tâm hero trang sản phẩm — port đúng các lớp của dev.yuzu.money.
 *
 * Xếp lớp từ dưới lên:
 *  1. Quả cầu nền: gradient tròn theo token hero landing, viền 3.2px màu glow,
 *     blur 0.8px và ba
 *     lớp box-shadow (30px / 60px ngoài + 20px inset) tạo hào quang.
 *  2. Khối tròn overflow-hidden chứa hai lớp noise và một lớp quét sáng bên trong.
 *  3. Vành sáng quét vòng ngoài, mix-blend hard-light + blur 2px.
 *  4. Icon token ở giữa, 65% đường kính.
 *
 * Ba lớp quét dùng chung keyframe `rotate-light` (8s linear) — nó chỉ chạy
 * `--light-angle` từ 0 tới 360deg, nên biến đó phải khai bằng @property mới nội
 * suy được (đã có sẵn trong index.css cho hero landing).
 */

type BallSkin = {
  /** Màu hào quang + viền. */
  glow: string;
  /** Viền — Prime dùng vàng đậm hơn glow, hai màu kia trùng glow. */
  rim?: string;
  /** Icon token ở giữa. */
  icon: string;
};

/* Nền quả cầu lấy đúng token của hero landing: light = xanh nhạt, dark = tối.
   Bản dev cho mỗi sản phẩm một nền gần đen riêng (#0d1210 / #1a1200) nhưng như
   vậy quả cầu ở trang sản phẩm lệch hẳn tông với quả cầu ở trang chủ. Sắc riêng
   của từng sản phẩm đã nằm ở hào quang, viền và icon. */
const SPHERE = "radial-gradient(circle, var(--hero-sphere-top) 55%, var(--hero-sphere-edge) 100%)";

const SKIN: Record<ProductPage["id"], BallSkin> = {
  alpha: { glow: "#9fe870", icon: "/assets/tokens/syzUSD.svg" },
  prime: { glow: "#ffaa15", rim: "#c97e05", icon: "/assets/tokens/yzPrime.svg" },
  marketplace: { glow: "#a8adff", icon: "/assets/tokens/yzCash.svg" },
};

const CENTER = "absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2";
const NOISE = { backgroundImage: `url(${asset("/assets/landing/noise.png")})`, backgroundSize: "200px" };

export function HeroBall({ id }: { id: ProductPage["id"] }) {
  const s = SKIN[id];
  const mix = (pct: number) => `color-mix(in srgb, ${s.glow} ${pct}%, transparent)`;

  return (
    <div className="relative h-[200px] w-[200px] sm:h-[225px] sm:w-[225px]" aria-hidden>
      <div className={`${CENTER} rounded-full`}>
        {/* 1. quả cầu nền + hào quang */}
        <div
          className={`${CENTER} rounded-full`}
          style={{
            background: SPHERE,
            border: `3.2px solid ${s.rim ?? s.glow}`,
            filter: "blur(0.8px)",
            boxShadow: `0 0 30px ${mix(30)}, 0 0 60px ${mix(10)}, inset 0 0 20px ${mix(5)}`,
          }}
        />

        {/* 2. noise + vệt sáng bên trong, cắt trong lòng cầu */}
        <div className={`${CENTER} overflow-hidden rounded-full`}>
          <div className="absolute inset-0" style={{ ...NOISE, opacity: 0.06 }} />
          <div
            className="absolute inset-0"
            style={{
              ...NOISE,
              opacity: 0.5,
              maskImage:
                "conic-gradient(from var(--light-angle), transparent 0%, transparent 70%, white 88%, white 92%, transparent 100%)",
              WebkitMaskImage:
                "conic-gradient(from var(--light-angle), transparent 0%, transparent 70%, white 88%, white 92%, transparent 100%)",
              animation: "rotate-light 8s linear infinite",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `conic-gradient(from var(--light-angle), transparent 0%, transparent 72%, ${mix(15)} 84%, ${mix(30)} 90%, ${mix(15)} 96%, transparent 100%)`,
              maskImage: "radial-gradient(circle closest-side, transparent 30%, white 70%)",
              WebkitMaskImage: "radial-gradient(circle closest-side, transparent 30%, white 70%)",
              animation: "rotate-light 8s linear infinite",
            }}
          />
        </div>

        {/* 3. vành sáng quét vòng ngoài */}
        <div
          className={`${CENTER} rounded-full`}
          style={{
            background: `conic-gradient(from var(--light-angle), transparent 0%, transparent 60%, ${mix(10)} 76%, ${mix(60)} 82%, white 88%, ${mix(60)} 93%, ${mix(10)} 97%, transparent 100%)`,
            maskImage: "radial-gradient(circle closest-side, transparent 88%, white 94%, white 100%)",
            WebkitMaskImage:
              "radial-gradient(circle closest-side, transparent 88%, white 94%, white 100%)",
            filter: "blur(2px)",
            mixBlendMode: "hard-light",
            animation: "rotate-light 8s linear infinite",
          }}
        />

        {/* 4. icon token */}
        <div className="absolute left-1/2 top-1/2 h-[65%] w-[65%] -translate-x-1/2 -translate-y-1/2">
          <img src={asset(s.icon)} alt="" className="size-full object-contain" />
        </div>
      </div>
    </div>
  );
}
