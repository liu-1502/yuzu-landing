/* ==========================================================================
   Dải "Trusted by leading institutions" của TRANG SẢN PHẨM — khác hẳn lưới 3
   băng ở landing. Bản dev chia hai hàng chạy ngược chiều nhau, mỗi logo có một
   cặp file sáng/tối.
   ========================================================================== */

export type PartnerLogo = { name: string; light: string; dark: string };

const A = "/assets/yzPrime/";

/** Hàng trên — chạy sang trái (`normal`), 9 logo. */
export const partnerRowA: PartnerLogo[] = [
  { name: "Movement", light: `${A}color-movement.png`, dark: `${A}dark-movement.png` },
  { name: "ether.fi", light: `${A}color-etherfi.png`, dark: `${A}dark-etherfi.png` },
  { name: "Yield", light: `${A}yield-ink.svg`, dark: `${A}yield-onDark.svg` },
  { name: "Rockbund", light: `${A}color-rockbund.png`, dark: `${A}dark-rockbund.png` },
  { name: "Accountable", light: `${A}color-accountable.png`, dark: `${A}dark-accountable.png` },
  { name: "JST", light: `${A}color-jst.png`, dark: `${A}dark-jst.png` },
  { name: "Coinchange", light: `${A}color-coinchange.png`, dark: `${A}dark-coinchange.png` },
  { name: "Piku", light: `${A}color-piku.png`, dark: `${A}dark-piku.png` },
  { name: "Bloq", light: `${A}color-bloq.png`, dark: `${A}dark-bloq.png` },
];

/** Hàng dưới — chạy ngược lại (`reverse`), 11 logo. */
export const partnerRowB: PartnerLogo[] = [
  { name: "K3 Capital", light: `${A}K3 Capital_Light Mode.svg`, dark: `${A}K3 Capital_Dark Mode.svg` },
  { name: "Euler", light: `${A}euler-logo-color-black.svg`, dark: `${A}euler-logo-color-white.svg` },
  { name: "KPK", light: `${A}KPK_light mode.svg`, dark: `${A}KPK_dark mode.svg` },
  { name: "Morpho", light: `${A}Morpho_light mode.svg`, dark: `${A}Morpho_dark mode.svg` },
  { name: "RockawayX", light: `${A}RockawayX - Full_Light mode.png`, dark: `${A}RockawayX - Full_Dark mode.png` },
  { name: "Pendle", light: `${A}Pendle_light mode.png`, dark: `${A}Pendle_dark mode.png` },
  { name: "Curvance", light: `${A}curvance-ink.svg`, dark: `${A}curvance-onDark.svg` },
  { name: "Balancer", light: `${A}balancer-black-1000x184.png`, dark: `${A}balancer-white-1000x184.png` },
  { name: "Feather", light: `${A}color-feather.png`, dark: `${A}dark-feather.png` },
  { name: "Redstone", light: `${A}color-redstone.png`, dark: `${A}dark-redstone.png` },
  { name: "Chainlink", light: `${A}Chainlink-Logo-Blue.svg`, dark: `${A}chainlink-onDark.svg` },
];

export const partnerHeading = "Trusted by leading institutions";
