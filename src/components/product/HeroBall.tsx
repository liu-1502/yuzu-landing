import { asset } from "@/data/content";
import type { ProductPage } from "@/data/productPages";

/**
 * Quả cầu ở tâm hero trang sản phẩm — port đúng các lớp của dev.yuzu.money.
 *
 * Xếp lớp từ dưới lên:
 *  1. Quả cầu nền: gradient tròn gần đen, viền 3.2px màu glow,
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

/* Nền quả cầu KHÔNG còn màu đen.
   Bản dev để gradient gần đen (alpha #0d1210, prime #1a1200) và mình từng port
   đúng vậy, nhưng khối đen đó chiếm gần hết hero. Giờ lấy tông sáng của chính
   scope: `--surface` ra `--surface-2`, nên quả cầu thành khối thuỷ tinh nhạt và
   TỰ đổi theo theme từng trang — chỉ còn vành sáng, hào quang, vệt quét và icon
   là phần nhìn thấy rõ. */
const SPHERE = "radial-gradient(circle, var(--surface) 55%, var(--surface-2) 100%)";

const SKIN: Record<ProductPage["id"], BallSkin> = {
  alpha: {
    glow: "#9fe870",
    icon: "/assets/tokens/syzUSD.svg",
  },
  prime: {
    /* Vành và hào quang lấy đúng brand Prime của trang chủ (`--prime`), không
       phải cặp #ffaa15/#c97e05 của bản dev — cặp đó sáng và ngả cam hơn. */
    glow: "var(--prime)",
    icon: "/assets/tokens/yzPrime.svg",
  },
  marketplace: {
    glow: "#a8adff",
    icon: "/assets/tokens/yzCash.svg",
  },
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
          <div className="absolute inset-0" style={{ ...NOISE, opacity: 0.05 }} />
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
        <div className="absolute left-1/2 top-1/2 h-[52%] w-[52%] -translate-x-1/2 -translate-y-1/2">
          <img src={asset(s.icon)} alt="" className="size-full object-contain" />
        </div>
      </div>
    </div>
  );
}
