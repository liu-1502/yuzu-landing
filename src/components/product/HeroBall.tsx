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
  /** Icon token ở giữa. Nhiều icon thì xếp chồng mép nhau thành một cụm. */
  icon: string | string[];
};

/* Quả cầu KHÔNG có nền.
   Bản dev để gradient gần đen; sau đó mình đổi sang tông sáng của scope, nhưng
   cái đĩa sáng đó vẫn là một mảng đặc giữa hero. Giờ bỏ hẳn: chỉ còn vành sáng,
   hào quang, ba vệt quét và icon token nổi trên nền trang. */
const SPHERE = "transparent";

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
    /* Marketplace không có MỘT token đại diện như hai trang kia — nó là chỗ
       chứa nhiều vault — nên hero xếp cả ba token đang mở, đúng ba cái mà
       section Terms liệt kê. */
    icon: [
      "/assets/tokens/yzCash.svg",
      "/assets/tokens/yzSyrup.svg",
      "https://assets.yuzu.money/vault-catalog/1-0x7c5ed3b2dc8c353d685005b9e06e3250d47d839e/icon-9923fa43-2149-402f-bc3c-eaf1ef715f78.png",
    ],
  },
};

const CENTER = "absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2";
const NOISE = { backgroundImage: `url(${asset("/assets/landing/noise.png")})`, backgroundSize: "200px" };

/** Bề rộng một huy hiệu, tính theo % bề rộng cụm — ba cái chồng nhau vừa kín
 *  khung: 45.8*3 - 45.8*0.4*2 ≈ 100. */
const BADGE = 45.8;
/** Cái sau lùi vào 40% bề rộng của chính nó. */
const OVERLAP = 0.4;

export function HeroBall({ id }: { id: ProductPage["id"] }) {
  const s = SKIN[id];
  const icons = Array.isArray(s.icon) ? s.icon : [s.icon];
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

        {/* 4. icon token — một cái thì canh giữa như cũ; nhiều cái thì xếp chồng
            mép nhau, cái trước đè lên cái sau.
            Bề rộng cụm và mức chồng đều tính bằng % của khung nên tự co theo quả
            cầu (200px dưới `sm`, 225px từ `sm`), khỏi phải gán cứng px. Cụm ba
            rộng 60%: to hơn mức 48% ban đầu nhưng vẫn còn 20% bán kính hở tới
            vành sáng ở hai đầu. */}
        {icons.length === 1 ? (
          <div className="absolute left-1/2 top-1/2 h-[52%] w-[52%] -translate-x-1/2 -translate-y-1/2">
            <img src={asset(icons[0])} alt="" className="size-full object-contain" />
          </div>
        ) : (
          <div className="absolute left-1/2 top-1/2 flex w-[60%] -translate-x-1/2 -translate-y-1/2 items-center">
            {icons.map((src, i) => (
              <img
                key={src}
                src={asset(src)}
                alt=""
                className="block rounded-full"
                style={{
                  width: `${BADGE}%`,
                  marginLeft: i === 0 ? 0 : `${-BADGE * OVERLAP}%`,
                  zIndex: icons.length - i,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
