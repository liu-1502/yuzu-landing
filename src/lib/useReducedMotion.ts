import { useEffect, useState } from "react";

/**
 * prefers-reduced-motion, giống useReducedMotion của trang gốc.
 *
 * Trước đây hàm này nằm riêng trong StatBox; giờ dải KPI của trang sản phẩm cũng
 * cần (nó dùng cùng một mặt nước), nên tách ra dùng chung thay vì chép lại.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}
