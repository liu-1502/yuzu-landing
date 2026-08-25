# Fancy components

Component kéo về từ [fancycomponents.dev](https://fancycomponents.dev) (repo `danielpetho/fancy`, MIT).
Thư mục này **chỉ chứa code của thư viện**. Component tự viết của dự án nằm ở `src/components/ui/`.

## Thêm component

```bash
npx shadcn@latest add @fancy/<ten-component>
```

File tự rơi vào `src/components/fancy/<nhom>/<ten>.tsx` theo đường dẫn registry khai báo.
Registry `@fancy` đã khai trong `components.json` ở gốc dự án.
Nếu component khai thêm dependency thì chạy `npm install` sau đó.

## Đã cấu hình sẵn

- Đã cài `motion`, `clsx`, `tailwind-merge`
- `cn()` trong `src/lib/utils.ts` dùng `clsx + twMerge` — fancy/shadcn cần bản này; bản nối chuỗi cũ làm class Tailwind trùng nhóm không ghi đè đúng
- `types: ["node"]` — fancy hay dùng `NodeJS.Timeout`

**Không chạy `shadcn init`.** Nó ghi đè `src/index.css` và xoá sạch token màu, dark mode, keyframes của dự án. `components.json` đã viết tay sẵn.

## Bắt buộc sau mỗi lần `shadcn add`

Fancy viết `import { motion, ValueAnimationTransition } from "motion/react"` — gộp cả type lẫn giá trị.
Dự án bật `verbatimModuleSyntax: true`, mà Vite/esbuild không phân tích type, nên nó giữ nguyên
`ValueAnimationTransition` thành import runtime → **trang trắng**, lỗi
`does not provide an export named 'ValueAnimationTransition'`.

Sau khi thêm component, tách type ra:

```ts
import { motion } from "motion/react"
import type { ValueAnimationTransition } from "motion/react"

import { useEffect, useMemo, useRef } from "react"
import type { ElementType } from "react"
```

Chỉ `tsc` thôi không bắt được lỗi này — phải mở trang xem.

## Sửa so với bản gốc

Ghi lại để chạy lại `shadcn add` không mất:

- `blocks/stacking-cards.tsx`
  - **Không sửa file gốc.** File này đã tách `import type` sẵn nên không mắc bẫy trang trắng ở trên.
  - Cách dùng trong `sections/Security.tsx`:
    1. `StackingCardItem` đặt `className`/`style` lên div **ngoài** (div `sticky`), còn `scale` áp lên `motion.div` **trong**. Để `background` ở ngoài thì thẻ co lại mà nền vẫn nguyên khổ → không thấy hiệu ứng gì. Phải bọc nội dung trong một div riêng mang nền + `h-full` (ở đây là `PanelSurface`).
    2. **Thẻ phải cao đúng 1 viewport** (`md:h-svh`). Dải scroll của khối là `N·H − vh`, thẻ cuối cần ghim tại `(N−1)·H`, muốn `(N−1)·H ≤ N·H − vh` thì `H ≥ vh`. Để `h-[480px]` trong viewport 848 thì hai thẻ chót **không bao giờ ghim tới đỉnh** — đã dựng sai một lần rồi.
    3. Hai chỗ **phải** lệch khỏi thư viện vì dự án có header đục 64px:
       - ghim ở `md:top-32` (128px = 64 header + 64 hở) chứ không `top-0` — `top-16` là dán sát đáy nav, `top-0` thì bị nav che mất tiêu đề thẻ đầu;
       - `topPosition` tự tính `index * 103px` — mặc định `${5 + index * 3}%` chỉ hở 25px, không đủ đọc tiêu đề thẻ nằm dưới. Con số 103 bị kẹp hai đầu, xem chú thích `STRIP` trong `Security.tsx`.
       Khi tắt stacking thì truyền `topPosition="0px"`: lúc đó item cao auto, độ lệch làm mặt panel trôi xuống rồi bị panel sau che mất nội dung đáy (đo trên mobile: hình radar bị cắt ngang).
    4. Nếu có lúc nào cần buộc hiệu ứng nào đó vào tiến độ scroll: **đừng** dùng `1/totalCards` như `rangeScale` của thư viện. Với `H = vh` thì thẻ thứ k ghim tại `k/(N−1)` — `1/N` ra mốc sớm hơn thực tế (0.20 thay vì 0.31 với 5 thẻ).
  - `scaleMultiplier` truyền 0 khi màn < 768px hoặc khi `prefers-reduced-motion: reduce` → `scaleTo` thành 1, tắt hẳn animation mà không cần bỏ component.
  - Viền + bo 40px + `max-w-[1280px]` là code tự thêm ở `PanelSurface`, không phải của thư viện, và là **tĩnh** — không buộc vào scroll. Bản trước từng cho bo góc chạy theo `useTransform`; nếu quay lại kiểu đó thì nhớ: **không truyền `style={{ opacity: cond ? motionValue : 1 }}`** — đổi qua lại giữa số thường và MotionValue làm motion hiểu là animate chứ không phải bind, đo ra giá trị tự bò theo thời gian thay vì theo scroll. Luôn truyền MotionValue, muốn tắt thì cho dải output phẳng (`[0, 0]`).
  - Từng thử làm mờ nội dung thẻ đang lùi để khỏi hở tiêu đề panel trước. **Đừng.** Mốc canh sai một nhịp là ẩn luôn nội dung thẻ đang đọc. Cách đúng là để thẻ cao 1 viewport như điểm 2 — thẻ sau phủ kín thẻ trước, chỉ chừa dải mép bằng `topPosition`.
  - Thẻ cuối vẫn co nhẹ còn 0.97 dù không bị gì phủ: công thức gốc là `1 - (totalCards - index) * scaleMultiplier`, index cuối luôn ra hệ số 1. Chấp nhận, vì hạ `totalCards` xuống 1 sẽ làm `rangeScale` của thẻ cuối thành `[1, 1]`.

- `text/underline-to-background.tsx`
  - Thêm `[key: string]: unknown` vào `UnderlineProps` để truyền được `href`/`target`/`rel` khi dùng `as="a"`. Bản gốc chặn nên không làm link được.
  - Đổi thanh underline từ `motion.div` sang `motion.span` (+ class `block`). Bản gốc dùng `div`, mà `div` không hợp lệ bên trong `<p>` — React báo lỗi hydration khi đặt component trong đoạn văn.

## Component (46)

**background** — nền

`animated-gradient-with-svg`, `pixel-trail`

**blocks** — khối / hiệu ứng

`circling-elements`, `css-box`, `drag-elements`, `element-along-svg-path`, `float`, `marquee-along-svg-path`, `media-between-text`, `screensaver`, `simple-carousel`, `simple-marquee`, `stacking-cards`

**carousel** — carousel

`box-carousel`

**filter** — bộ lọc SVG

`gooey-svg-filter`, `pixelate-svg-filter`

**image** — ảnh

`image-trail`, `parallax-floating`

**khác** — khác

`pixelate-svg-filter-text`

**physics** — physics

`cursor-attractor-and-gravity`, `elastic-line`, `gravity`

**text** — chữ

`basic-number-ticker`, `breathing-text`, `letter-3d-swap`, `letter-swap-forward-anim`, `letter-swap-pingpong-anim`, `random-letter-swap-forward-anim`, `random-letter-swap-pingpong-anim`, `scramble-hover`, `scramble-in`, `scroll-and-swap-text`, `text-along-path`, `text-cursor-proximity`, `text-highlighter`, `text-rotate`, `typewriter`, `underline-center`, `underline-comes-in-goes-out`, `underline-goes-out-comes-in`, `underline-to-background`, `variable-font-and-cursor`, `variable-font-cursor-proximity`, `variable-font-hover-by-letter`, `variable-font-hover-by-random-letter`, `vertical-cut-reveal`

## Hook (11)

`use-debounced-dimensions`, `use-detect-browser`, `use-dimensions`, `use-elastic-line-events`, `use-line-breakdown`, `use-line-count`, `use-mounted`, `use-mouse-position`, `use-mouse-position-ref`, `use-mouse-vector`, `use-screen-size`
