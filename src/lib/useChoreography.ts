import { useEffect, useState } from "react";

/**
 * Bật/tắt toàn bộ dàn dựng theo scroll của phần giữa trang: Products ghim 3 tab,
 * Security trượt đè lên tấm Marketplace, Transparency trượt đè lên thẻ số 5.
 *
 * Ba section đó buộc phải cùng một câu trả lời. Chúng nối với nhau bằng
 * `-mt-[100svh]`, mà margin âm thì luôn có tác dụng — trong khi Products chỉ ghim
 * ở chế độ `pinned`. Trước đây điều kiện bị chia đôi: Products quyết bằng JS
 * (rộng ≥ 768, không reduced-motion, cao ≥ 620), còn margin âm gán cứng trong
 * class. Hậu quả: trên mobile Products đổ về carousel cao 772px nhưng Security
 * vẫn bị kéo lên 812px và trùm kín nó.
 *
 * Cùng ngưỡng với `resolveMode()` trong Products:
 *  - rộng < 768 → mobile, không dàn dựng
 *  - reduced-motion → tôn trọng thiết lập của người dùng
 *  - cao < 620 → màn quá thấp, thẻ ghim sẽ bị cắt
 */
export function isChoreographyOn() {
  if (typeof window === "undefined") return false;
  return (
    window.innerWidth >= 768 &&
    window.innerHeight >= 620 &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function useChoreography() {
  const [on, setOn] = useState(isChoreographyOn);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setOn(isChoreographyOn());
    sync();
    window.addEventListener("resize", sync);
    mq.addEventListener("change", sync);
    return () => {
      window.removeEventListener("resize", sync);
      mq.removeEventListener("change", sync);
    };
  }, []);

  return on;
}
