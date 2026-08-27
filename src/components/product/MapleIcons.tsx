/**
 * Ba icon của dải Maple, dựng INLINE thay vì `<img src>`.
 *
 * File gốc ghi cứng `#FFAA15` — một tông cam sáng, không phải màu brand Prime
 * (`--prime` = #93690b ở light, #edc15f ở dark). Không sửa được bằng cách đổi
 * màu trong file: dùng `currentColor` mà để trong `<img>` thì nó giải theo chính
 * file SVG chứ không theo trang, còn ghi cứng một mã thì sai một trong hai chế độ.
 * Nên vẽ thẳng ra đây và tô bằng `currentColor`.
 *
 * Hình giữ nguyên từng path của file gốc: một đĩa tròn nền ở 20% và nét vẽ 2px.
 */

const SHAPES = {
  shield: (
    <path
      d="M24.0013 14.3333L26.9879 20.3853L33.6679 21.3559L28.8346 26.0679L29.9759 32.7199L24.0013 29.5799L18.0266 32.7199L19.1679 26.0679L14.3346 21.3559L21.0146 20.3853L24.0013 14.3333Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  chart: (
    <>
      <path
        d="M24.0013 33.6666C29.34 33.6666 33.6679 29.3387 33.6679 23.9999C33.6679 18.6612 29.34 14.3333 24.0013 14.3333C18.6625 14.3333 14.3346 18.6612 14.3346 23.9999C14.3346 29.3387 18.6625 33.6666 24.0013 33.6666Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.668 24.3333L22.668 27.6666L28.3346 20.3333"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
  collateral: (
    <>
      <path
        d="M23.9987 25.6668C25.4715 25.6668 26.6654 24.4729 26.6654 23.0002C26.6654 21.5274 25.4715 20.3335 23.9987 20.3335C22.5259 20.3335 21.332 21.5274 21.332 23.0002C21.332 24.4729 22.5259 25.6668 23.9987 25.6668Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23.9987 25.6667V28.6667"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24.4054 14.4641L31.4054 16.7041C31.9574 16.8815 32.3321 17.3948 32.3321 17.9735V26.6668C32.3321 30.7068 26.0867 32.9975 24.4094 33.5401C24.1387 33.6281 23.8587 33.6281 23.5881 33.5401C21.9107 32.9975 15.6654 30.7068 15.6654 26.6668V17.9735C15.6654 17.3935 16.0401 16.8801 16.5921 16.7041L23.5921 14.4641C23.8561 14.3801 24.1401 14.3801 24.4054 14.4641Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  ),
} as const;

/** Lấy tên hình từ đường dẫn file trong data, khỏi phải sửa `productPages.ts`. */
function keyOf(src: string): keyof typeof SHAPES | null {
  const m = /maple-icon-(shield|chart|collateral)\.svg/.exec(src);
  return m ? (m[1] as keyof typeof SHAPES) : null;
}

export function MapleIcon({ src, className }: { src: string; className?: string }) {
  const key = keyOf(src);
  if (!key) return null;

  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      {/* Đĩa tròn nền ở 10% — file gốc để 20%, mà `currentColor` ở đây là nâu
          vàng Prime nên 20% đọc ra thành một mảng nâu đậm. */}
      <path
        d="M0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24Z"
        fill="currentColor"
        fillOpacity="0.1"
      />
      {SHAPES[key]}
    </svg>
  );
}
