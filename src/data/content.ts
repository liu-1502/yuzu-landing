/* ==========================================================================
   NỘI DUNG — copy verbatim từ trang gốc yuzu-landing-test.vercel.app
   Sửa text ở đây, không cần chạm component.
   ========================================================================== */

/** Assets nằm trong /public, phục vụ theo `base` của Vite (GitHub Pages là
 * /<repo>/). Đặt VITE_ASSET_BASE nếu muốn trỏ sang CDN hay domain khác. */
const ASSET_OVERRIDE = import.meta.env.VITE_ASSET_BASE;
// Chuỗi rỗng cũng coi như không đặt: .env.local đang để `VITE_ASSET_BASE=` và `??`
// sẽ giữ nguyên "" — thế thì build cho Pages sẽ mất tiền tố /<repo>/.
export const ASSET_BASE = (ASSET_OVERRIDE || import.meta.env.BASE_URL).replace(/\/$/, "");

export const asset = (p: string) => (p.startsWith("http") ? p : `${ASSET_BASE}${p}`);

export const site = {
  name: "Yuzu Money",
  email: "contact@yuzu.money",
  telegram: "https://t.me/Fabyuzuvip",
  accountable: "https://yuzu.accountable.capital/",
  x: "https://x.com/YuzuMoneyX",
};

export const nav = {
  products: [
    { name: "Alpha", desc: "Stablecoin engine", color: "var(--alpha)", href: "#products" },
    { name: "Prime", desc: "Tokenized fixed income", color: "var(--prime)", href: "#products" },
    { name: "Marketplace", desc: "Curated single strategies", color: "var(--mkt)", href: "#products" },
  ],
  links: [
    { label: "Security", href: "#security" },
    { label: "Transparency", href: "#transparency" },
    { label: "Concierge", href: "#contact" },
    { label: "FAQ", href: "#faq" },
    { label: "Research", href: "#", external: true },
  ],
};

export const hero = {
  titleLead: "The ",
  titleAccent: "Yield Engine",
  titleTail: "for Neobanks",
  body:
    "Institutional-grade risk management meets on-chain transparency. Yuzu runs yield for neobanks, wealth managers and accredited investors through tokenized real-world assets and curated DeFi strategies.",
  primary: { label: "Launch app", href: "#" },
  secondary: { label: "Integrate us", href: "#contact" },
  orbitLabels: [
    { label: "Tokenized RWA", angle: 190 },
    { label: "Risk Tranching", angle: 315 },
    { label: "DeFi Composability", angle: 45 },
  ],
  orbitTokens: [
    { icon: "/assets/tokens/yzPrime.svg", angle: 20, ring: 1 },
    { icon: "/assets/tokens/yzCash.svg", angle: 140, ring: 1 },
    { icon: "/assets/tokens/yzSyrup.svg", angle: 260, ring: 1 },
    { icon: "/assets/tokens/yzPrime.svg", angle: 75, ring: 2 },
    { icon: "/assets/tokens/yzCash.svg", angle: 200, ring: 2 },
    { icon: "/assets/tokens/yzSyrup.svg", angle: 320, ring: 2 },
  ],
};

export type StatRow = {
  label: string;
  value: string;
  color?: string;
  attested?: boolean;
  children?: { label: string; value: string }[];
};

export const stats: {
  label: string;
  value: string;
  accent?: boolean;
  attested?: boolean;
  /** mực nước 0..1 của sóng trong stat box — số lấy từ trang gốc */
  level?: number;
  rows: StatRow[];
  note: string;
}[] = [
  {
    label: "Total value locked",
    level: 0.40,
    value: "$78.97M",
    rows: [
      {
        label: "Alpha",
        value: "$63.00M",
        color: "var(--alpha)",
        attested: true,
        children: [
          { label: "yzUSD", value: "$58.49M" },
          { label: "yzPP", value: "$4.52M" },
        ],
      },
      { label: "Prime", value: "$7.57M", color: "var(--prime)", attested: true },
      {
        label: "Marketplace",
        value: "$11.45M",
        color: "var(--mkt)",
        children: [
          { label: "yzCash", value: "$7.55M" },
          { label: "yzSyrup", value: "$3.85M" },
          { label: "yzmGLOBAL", value: "$50K" },
        ],
      },
      { label: "yzPrime held by Alpha", value: "-$3.05M", color: "var(--faint)" },
    ],
    note:
      "Alpha and Prime are attested. Marketplace vault sizes are read live from the app's public vault API. The last row removes the yzPrime sitting inside Alpha's collateral pool, so no dollar is counted twice.",
  },
  {
    label: "Yield paid out",
    level: 0.44,
    value: "$2.94M",
    rows: [
      { label: "Alpha", value: "$2.87M", color: "var(--alpha)", attested: true },
      { label: "Prime", value: "$23K", color: "var(--prime)", attested: true },
      {
        label: "Marketplace",
        value: "$48K",
        color: "var(--mkt)",
        children: [
          { label: "yzCash", value: "$25K" },
          { label: "yzSyrup", value: "$23K" },
          { label: "yzmGLOBAL", value: "$254.30" },
        ],
      },
    ],
    note:
      "Cumulative. Alpha and Prime are from the attested reserve history; Marketplace payouts are read live from the app's public vault API.",
  },
  {
    label: "Alpha collateral ratio",
    level: 0.38,
    value: "108.66%",
    accent: true,
    attested: true,
    rows: [
      { label: "Collateral", value: "$68.49M", color: "var(--alpha)", attested: true },
      { label: "yzUSD liabilities", value: "$63.03M", color: "var(--faint)" },
    ],
    note: "Attested by Accountable from on-chain reserves. Senior claim overcollateralised by yzPP and the Reserve Fund.",
  },
  {
    label: "Prime backing",
    level: 0.42,
    value: "100.05%",
    accent: true,
    attested: true,
    rows: [
      { label: "RWA portfolio", value: "$7.58M", color: "var(--prime)", attested: true },
      { label: "yzPrime supply", value: "$7.57M", color: "var(--faint)" },
    ],
    note: "Attested by Accountable from on-chain reserves. yzPrime is priced at NAV.",
  },
];

export const statsFootnote = {
  before: "Marked figures are attested by",
  link: { label: "Accountable", href: "https://yuzu.accountable.capital/" },
  after: "from on-chain reserves.",
  read: "Read 15 min ago.",
};

/* ---------------------------------- Partners ---------------------------------- */
export type PartnerItem = {
  name: string;
  href: string;
  logo?: string;
  w?: number;
  h?: number;
  /** tô một màu bằng mask thay vì ảnh màu */
  mono?: boolean;
  /** logo chữ dài, hiển thị ngang thay vì tròn */
  wide?: boolean;
};

export type PartnerRow = {
  label: string;
  seconds: number;
  reverse?: boolean;
  items: PartnerItem[];
};

export const partnerRows: PartnerRow[] = [
  {
    label: "Chains",
    seconds: 62,
    items: [
      { name: "Ethereum", href: "https://ethereum.org", logo: "/assets/partners/ethereum.png", w: 256, h: 256 },
      { name: "Monad", href: "https://www.monad.xyz", logo: "/assets/partners/monad.png", w: 256, h: 256 },
      { name: "Plasma", href: "https://www.plasma.to", logo: "/assets/partners/plasma.svg", w: 32, h: 32, mono: true },
      { name: "Sei", href: "https://www.sei.io", logo: "/assets/partners/sei.png", w: 180, h: 180 },
      { name: "Pharos Network", href: "https://pharosnetwork.xyz", logo: "/assets/partners/pharos.png", w: 256, h: 256 },
      { name: "Hyperliquid", href: "https://hyperliquid.xyz", logo: "/assets/partners/hyperliquid.png", w: 64, h: 64 },
      { name: "Berachain", href: "https://www.berachain.com", logo: "/assets/partners/berachain.png", w: 32, h: 32 },
      { name: "Base", href: "https://www.base.org", logo: "/assets/partners/base.png", w: 32, h: 32 },
      { name: "Arbitrum", href: "https://arbitrum.io", logo: "/assets/partners/arbitrum.svg", w: 32, h: 32 },
      { name: "BNB Chain", href: "https://www.bnbchain.org", logo: "/assets/partners/bnbchain.png", w: 32, h: 32 },
      { name: "Solana", href: "https://solana.com", logo: "/assets/partners/solana.png", w: 180, h: 180 },
      { name: "Sui", href: "https://sui.io", logo: "/assets/partners/sui.png", w: 256, h: 256 },
      { name: "Ink", href: "https://inkonchain.com", logo: "/assets/partners/ink.svg", w: 32, h: 32 },
      { name: "Robinhood", href: "https://robinhood.com", logo: "/assets/partners/robinhood.png", w: 60, h: 60 },
    ],
  },
  {
    label: "Protocols",
    seconds: 96,
    reverse: true,
    items: [
      { name: "Maple", href: "https://maple.finance", logo: "/assets/security/maple.png", w: 200, h: 200 },
      { name: "Aave", href: "https://aave.com", logo: "/assets/security/aave.png", w: 225, h: 225 },
      { name: "Morpho", href: "https://morpho.org", logo: "/assets/security/morpho.png", w: 225, h: 225 },
      { name: "Ethena", href: "https://ethena.fi", logo: "/assets/security/ethena.png", w: 225, h: 225 },
      { name: "Fluid", href: "https://fluid.io", logo: "/assets/security/fluid.png", w: 200, h: 200 },
      { name: "Strata", href: "https://www.strata.money", logo: "/assets/security/strata.png", w: 225, h: 225 },
      { name: "Euler", href: "https://www.euler.finance", logo: "/assets/partners/euler.png", w: 48, h: 48 },
      { name: "Pendle", href: "https://www.pendle.finance", logo: "/assets/partners/pendle.png", w: 50, h: 50 },
      { name: "Curve", href: "https://curve.finance", logo: "/assets/partners/curve.png", w: 180, h: 180 },
      { name: "Spark", href: "https://spark.fi", logo: "/assets/partners/spark.png", w: 96, h: 96 },
      { name: "Sky Protocol", href: "https://sky.money", logo: "/assets/partners/sky.png", w: 256, h: 256 },
      { name: "Gearbox", href: "https://gearbox.fi", logo: "/assets/partners/gearbox.png", w: 180, h: 180 },
      { name: "Dolomite", href: "https://dolomite.io", logo: "/assets/partners/dolomite.png", w: 512, h: 512 },
      { name: "Curvance", href: "https://curvance.com", logo: "/assets/partners/curvance.png", w: 180, h: 180 },
      { name: "Kamino", href: "https://kamino.finance", logo: "/assets/partners/kamino.png", w: 180, h: 180 },
      { name: "Jupiter Lend", href: "https://jup.ag", logo: "/assets/partners/jupiter.png", w: 180, h: 180 },
      { name: "Cap", href: "https://cap.app", logo: "/assets/partners/cap.svg", w: 32, h: 32 },
      { name: "Securitize", href: "https://securitize.io", logo: "/assets/partners/securitize.png", w: 32, h: 32 },
      { name: "Superstate", href: "https://superstate.com", logo: "/assets/partners/superstate.png", w: 48, h: 48 },
      { name: "OpenEden", href: "https://openeden.com", logo: "/assets/partners/openeden.svg", w: 32, h: 32 },
      { name: "Centrifuge", href: "https://centrifuge.io", logo: "/assets/partners/centrifuge.png", w: 48, h: 48 },
      { name: "WisdomTree", href: "https://www.wisdomtree.com", logo: "/assets/partners/wisdomtree.png", w: 800, h: 301, wide: true },
      { name: "Midas", href: "https://midas.app", logo: "/assets/partners/midas.png", w: 32, h: 32 },
      { name: "Fasanara", href: "https://www.fasanara.com", logo: "/assets/partners/fasanara.png", w: 180, h: 180 },
      { name: "Theo", href: "https://theo.xyz", logo: "/assets/partners/theo.png", w: 180, h: 180 },
      { name: "Agora", href: "https://www.agora.finance", logo: "/assets/partners/agora.png", w: 32, h: 32 },
      { name: "M0", href: "https://m0.org", logo: "/assets/partners/m0.png", w: 256, h: 256 },
      { name: "Global Dollar", href: "https://www.global-dollar.com", logo: "/assets/partners/globaldollar.png", w: 80, h: 80 },
      { name: "PayPal USD", href: "https://www.paypal.com", logo: "/assets/partners/paypal.png", w: 258, h: 258 },
      { name: "Ripple", href: "https://ripple.com", logo: "/assets/partners/ripple.png", w: 46, h: 46 },
      { name: "World Liberty Financial", href: "https://www.worldlibertyfinancial.com", logo: "/assets/partners/wlfi.png", w: 512, h: 512 },
    ],
  },
  {
    label: "Infrastructure",
    seconds: 54,
    items: [
      { name: "Accountable", href: "https://www.accountable.capital", logo: "/assets/partners/accountable.svg", w: 21, h: 21, mono: true },
      { name: "Fordefi", href: "https://fordefi.com", logo: "/assets/partners/fordefi.png", w: 256, h: 256 },
      { name: "Hypernative", href: "https://hypernative.io", logo: "/assets/partners/hypernative.png", w: 512, h: 512 },
      { name: "RedStone", href: "https://www.redstone.finance", logo: "/assets/partners/redstone.png", w: 512, h: 512 },
      { name: "Chainlink CCIP", href: "https://chain.link/cross-chain", logo: "/assets/partners/chainlink.png", w: 256, h: 256 },
      { name: "LayerZero", href: "https://layerzero.network", logo: "/assets/partners/layerzero.png", w: 180, h: 180 },
      { name: "Pashov Audit Group", href: "https://www.pashov.net", logo: "/assets/security/pashov.png", w: 800, h: 800 },
      { name: "Dedaub", href: "https://dedaub.com", logo: "/assets/security/dedaub.png", w: 400, h: 400 },
    ],
  },
];

/* ---------------------------------- Products ---------------------------------- */
export type Product = {
  id: "alpha" | "prime" | "marketplace";
  name: string;
  kind: string;
  pitch: string;
  scope: string;
  color: string;
  ink: string;
  slices: {
    label: string;
    short: string;
    detail: string;
    /** null = chia đều, không hiện % */
    weight: number | null;
    color?: string;
    upcoming?: boolean;
  }[];
  yields: { apy: string; token: string; tail: string; icon: string }[];
  fee: string;
  facts: { label: string; value: string; icon: "lock" | "exit" | "shield" }[];
  cta: { label: string; note: string };
  hint: { token: string; text: string };
};

export const productsHeading = {
  kicker: "Products",
  title: "Every portfolio, cut open.",
  counter: (i: number) => `${i + 1} of 3 · keep scrolling`,
};

export const products: Product[] = [
  {
    id: "alpha",
    name: "Alpha",
    kind: "Stablecoin engine",
    pitch:
      "An actively managed portfolio of leveraged DeFi yield, split into two tranches. syzUSD takes the senior claim and pays a weekly yield. yzPP sits underneath it, absorbs the first loss, and is paid a premium for standing there.",
    scope: "",
    color: "var(--alpha)",
    ink: "var(--alpha-ink)",
    slices: [
      {
        label: "Leveraged stable strategies",
        short: "Leveraged",
        detail: "yzAUSD and USDe loops in isolated markets, on fundamental oracles",
        weight: 34,
      },
      {
        label: "Overcollateralized lending",
        short: "Lending",
        detail: "Maple Syrup, Curvance, Kamino, Jupiter Lend",
        weight: 57,
      },
      {
        label: "Tokenized T-Bills and AAA CLOs",
        short: "T-Bills, CLOs",
        detail: "BUIDL, VBILL, mGLOBAL and peers",
        weight: 8,
      },
      {
        label: "Stablecoin arbitrage and buffer",
        short: "Buffer",
        detail: "Curve, Balancer and Pendle pools",
        weight: 1,
      },
    ],
    yields: [
      { apy: "8%", token: "syzUSD", tail: ", the senior claim", icon: "/assets/tokens/syzUSD.svg" },
      { apy: "28%", token: "yzPP", tail: ", the junior claim", icon: "/assets/tokens/yzPP.svg" },
    ],
    fee:
      "Yuzu takes the greater of 10% of yield generated or 1% a year on assets. Posted rates are what is distributed, so they are already net of it.",
    facts: [
      { label: "Access", value: "Stake freely, mint screened", icon: "lock" },
      { label: "Exit", value: "Unstake instantly, 30d on yzPP", icon: "exit" },
      { label: "Buffer", value: "108.66%", icon: "shield" },
    ],
    cta: { label: "Open Alpha", note: "Tranched yield from curated, institutional-grade strategies" },
    hint: {
      token: "Leveraged stable strategies · 34%",
      text: "yzUSD and USDe loops in collateral markets, on funding-rate spreads.",
    },
  },
  {
    id: "prime",
    name: "Prime",
    kind: "Institutional fixed income",
    pitch:
      "An actively managed portfolio of leveraged institutional-grade real-world assets. One token, priced at NAV, with yield accruing continuously and nothing deployed outside a public mandate.",
    scope: "prime-scope",
    color: "var(--prime)",
    ink: "var(--prime-ink)",
    slices: [
      {
        label: "Tokenized U.S. T-Bills",
        short: "T-Bills",
        detail: "BUIDL, VBILL, WTGXX, JTRSY",
        weight: null,
      },
      {
        label: "Investment-grade credit",
        short: "AAA CLOs",
        detail: "AAA CLOs",
        weight: null,
      },
      {
        label: "Overcollateralized lending",
        short: "Lending",
        detail: "Syrup and peers",
        weight: null,
      },
    ],
    yields: [
      { apy: "7%", token: "yzPrime", tail: ", the whole RWA portfolio", icon: "/assets/tokens/yzPrime.svg" },
    ],
    fee:
      "Yuzu takes the greater of 10% of yield generated or 1% a year on assets. Posted rates are what is distributed, so they are already net of it.",
    facts: [
      { label: "Access", value: "Eligible investors only", icon: "lock" },
      { label: "Exit", value: "Redeem at NAV, gated", icon: "exit" },
      { label: "Buffer", value: "100.05%", icon: "shield" },
    ],
    cta: { label: "Open Prime", note: "Pure exposure to real-world asset yield" },
    hint: {
      token: "T-Bills · 45%",
      text: "Tokenized U.S. Treasury bills from regulated issuers, held to maturity.",
    },
  },
  {
    id: "marketplace",
    name: "Marketplace",
    kind: "Curated single strategies",
    pitch:
      "Where Alpha and Prime hand you a managed portfolio, the Marketplace hands you one named exposure. Each vault is underwritten by the Yuzu risk team and publishes its diligence before it opens.",
    scope: "mkt-scope",
    color: "var(--mkt)",
    ink: "var(--mkt-ink)",
    slices: [
      {
        label: "yzCash",
        short: "yzCash",
        color: "#DBDD50",
        detail:
          "The U.S. sovereign rate, onchain. Backed by tokenized T-Bills from leading issuers, with no lockup.",
        weight: null,
      },
      {
        label: "yzSyrup",
        short: "yzSyrup",
        color: "#FC784A",
        detail:
          "Overcollateralized lending to institutional borrowers through Maple Syrup, wrapped as one yield-bearing token. Loans are secured by liquid digital assets, with recourse.",
        weight: null,
      },
      {
        label: "yzmGLOBAL",
        short: "yzmGLOBAL",
        color: "#6E93F0",
        detail: "Asset-backed credit, diversified across global private-credit managers.",
        weight: null,
      },
      {
        label: "More on the way",
        short: "More soon",
        detail:
          "New vaults are underwritten and listed regularly, each with its diligence published before it opens. Announcements go out on X and Telegram first.",
        weight: null,
        upcoming: true,
      },
    ],
    yields: [
      { apy: "6%", token: "yzCash", tail: ", tokenized T-Bill cash", icon: "/assets/tokens/yzCash.svg" },
      { apy: "10%", token: "yzSyrup", tail: ", Maple Syrup lending", icon: "/assets/tokens/yzSyrup.svg" },
      {
        apy: "11.8%",
        token: "yzmGLOBAL",
        tail: ", asset-backed credit",
        icon: "https://assets.yuzu.money/vault-catalog/1-0x7c5ed3b2dc8c353d685005b9e06e3250d47d839e/icon-9923fa43-2149-402f-bc3c-eaf1ef715f78.png",
      },
    ],
    fee:
      "Yuzu takes the greater of 10% of yield generated or 1% a year on assets. Posted rates are what is distributed, so they are already net of it.",
    facts: [
      { label: "Access", value: "Anyone, no screening", icon: "lock" },
      { label: "Exit", value: "24 hours to monthly", icon: "exit" },
      { label: "Buffer", value: "Per vault", icon: "shield" },
    ],
    cta: { label: "Open Marketplace", note: "Single-asset yield exposure, one strategy at a time" },
    hint: {
      token: "yzCash",
      text: "The U.S. sovereign rate, onchain. Backed by tokenized T-Bills from leading issuers, with no lockup.",
    },
  },
];

/* ---------------------------------- Security ---------------------------------- */
export const securityIntro = {
  kicker: "Security",
  title: "Multiple Layers of Protection",
  body:
    "Security isn't a feature, it's our foundation. Every layer builds on the last to protect your investment capital.",
};

export type SecurityPanel = {
  n: number;
  title: string;
  body: string;
  cta?: { label: string; href: string };
  logos?: { name: string; icon: string }[];
  visual?: "tranche" | "radar" | "wallet";
};

export const securityPanels: SecurityPanel[] = [
  {
    n: 1,
    title: "Security Audits",
    body: "Smart contracts rigorously audited by industry-leading security firms before deployment.",
    cta: { label: "View Audits", href: "#" },
    logos: [
      { name: "Pashov Audit Group", icon: "/assets/security/pashov.png" },
      { name: "Dedaub", icon: "/assets/security/dedaub.png" },
    ],
  },
  {
    n: 2,
    title: "Real-Time Threat Monitoring",
    body:
      "Continuous on-chain surveillance of Yuzu Money's smart contracts and deployed strategies via Hypernative which detects threats before they materialize.",
    cta: { label: "Learn More", href: "#" },
    visual: "radar",
  },
  {
    n: 3,
    title: "DeFi Suite: Risk Tranching",
    body:
      "yzUSD senior tranche is overcollateralized at 108.66%, supported by the Reserve Fund and yzPP junior tranche which absorbs first losses.",
    visual: "tranche",
  },
  {
    n: 4,
    title: "Diversified Yield Strategies",
    body: "Broad exposure across top-tier protocols for stable, risk-managed returns.",
    cta: { label: "Strategy Breakdown", href: "#" },
    logos: [
      { name: "Maple", icon: "/assets/security/maple.png" },
      { name: "Strata", icon: "/assets/security/strata.png" },
      { name: "Ethena", icon: "/assets/security/ethena.png" },
      { name: "Fluid", icon: "/assets/security/fluid.png" },
      { name: "Morpho", icon: "/assets/security/morpho.png" },
      { name: "Aave", icon: "/assets/security/aave.png" },
    ],
  },
  {
    n: 5,
    title: "Fordefi MPC Wallet",
    body: "Enterprise-grade MPC wallet securing all on-chain operations and key management.",
    cta: { label: "Learn More", href: "#" },
    visual: "wallet",
  },
];

/* -------------------------------- Transparency -------------------------------- */
export const transparency = {
  kicker: "Transparency",
  title: "Transparency as a Feature",
  body:
    "On-chain verifiability, independent audits, and asset whitelist feature; because trust is earned through action, not words.",
  cards: [
    {
      icon: "solvency",
      title: "Real-Time Proof of Solvency",
      body:
        "Through {Accountable|https://www.accountable.capital/}, all reserves are verifiable on-chain in real-time. Full visibility into every dollar backing yzUSD.",
      logoHref: "https://yuzu.accountable.capital/",
    },
    {
      icon: "attest",
      title: "Independent Attestations",
      body:
        "Powered by {Accountable|https://www.accountable.capital/}. Third-party attestations of the team's permissioned access are regularly published and made accessible to the public.",
    },
    {
      icon: "whitelist",
      title: "Asset Whitelist",
      body:
        "Every new asset or platform undergoes a mandatory 7-day activation period and strict risk framework review before funds are deployed. {View the Asset Whitelist|https://app.yuzu.money/asset-whitelist} or {read our risk framework|https://yuzu-money.gitbook.io/yuzu-money/transparency/asset-whitelist}.",
    },
  ],
} as const;

/* ---------------------------------- Concierge --------------------------------- */
export const concierge = {
  kicker: "Concierge",
  title: "There is a person on the other end.",
  body:
    "Every Yuzu user and future user has access to the concierge. If the products look relevant to you, if you want to start KYC, if you want to be kept informed, or if you need help at any level at all, ask.",
  /** Giữ nguyên câu gốc — icon gán theo thứ tự, không thêm chữ. */
  bullets: [
    "Working out which product fits your mandate",
    "Starting KYC or KYB, and what it asks for",
    "Reading the reserve dashboard and the strategy breakdown",
    "Anything at all, before or after you deposit",
  ],

  cta: { title: "Chat with us", note: "No form, no queue, no ticket number. A message reaches the team." },
  /** Dải 3 ô trong card — copy lấy từ mockup người dùng gửi. */
  assurances: [
    { icon: "users", label: "Real people", sub: "on the team" },
    { icon: "clock", label: "Fast response", sub: "during business hours" },
    { icon: "shield", label: "Private & secure", sub: "Your info is safe with us" },
  ],
  email: { label: "Prefer email?", sub: "We'll get back to you." },
};

/* ------------------------------------- FAQ ------------------------------------ */
export const faq = {
  kicker: "FAQ",
  title: "The questions worth asking first.",
  body:
    "Every answer here links to the documentation it came from. If something on this page and something in the docs disagree, the docs win.",
  items: [
    {
      q: "What happens if a strategy loses money?",
      a: "Losses run down a fixed waterfall. In Alpha, the {Yuzu Protection Pool (yzPP)|https://yuzu-money.gitbook.io/yuzu-money/yuzu-alpha/yuzu-protection-pool-yzpp} is the first-loss tranche and is exhausted in full before any loss reaches yzUSD holders. The {Reserve Fund|https://yuzu-money.gitbook.io/yuzu-money/yuzu-alpha/reserve-fund} sits behind it and may absorb what exceeds yzPP. Coverage is limited to the balances actually standing there — it is not insurance, and it is subject to the terms. On a loss to the collateral pool, yzPP minting and redemptions are paused, including orders already in flight, until the assessment is done.",
    },
    {
      q: "Am I eligible to deposit?",
      a: "It depends which product. Marketplace vaults are permissionless: you deposit and withdraw from your own wallet with no screening. Minting or redeeming {yzUSD|https://yuzu-money.gitbook.io/yuzu-money/yuzu-alpha/yuzu-stablecoin-yzusd}, yzPP or {yzPrime|https://yuzu-money.gitbook.io/yuzu-money/yuzu-prime/yuzu-prime} is restricted to Accredited, Qualified, Institutional or Sophisticated Investors, defined by your country of residence or incorporation, and requires KYC or KYB, sanctions screening, AML checks and Source-of-Funds verification. Retail users are not eligible to mint. Once minted, the tokens trade on open secondary markets that Yuzu does not operate.",
    },
    {
      q: "How long does it take to get my money out?",
      a: "Per product, and worth reading before you deposit. Unstaking syzUSD back to yzUSD completes almost instantly. Redeeming yzUSD for USDT0 is a gated primary flow. yzPP runs a {30-day redemption period|https://yuzu-money.gitbook.io/yuzu-money/yuzu-alpha/yuzu-protection-pool-yzpp} during which yield keeps accruing and you stay exposed to first loss, with a 5,000 yzPP minimum order. yzPrime redeems at prevailing NAV through the gated flow. Marketplace vaults set their own terms, stated on each vault's card before you deposit — from 24-hour exits to monthly redemption epochs.",
    },
    {
      q: "Where does the yield actually come from?",
      a: "From positions held on-chain, all of them listed. Alpha runs leveraged stablecoin loops, overcollateralized lending, tokenized T-Bills and funding-rate arbitrage. Prime runs leverage on institutional fixed income — T-Bills, AAA CLOs and overcollateralized loans. Every live position, venue and size is published on the {Accountable dashboard|https://yuzu.accountable.capital/}, and nothing deploys outside the {Asset Whitelist|https://yuzu-money.gitbook.io/yuzu-money/transparency/asset-whitelist}, which imposes a 7-day activation period and a risk review on any new asset or venue.",
    },
    {
      q: "What does Yuzu charge?",
      a: "The greater of the two, never both: 10% of yield generated, or 1% a year on assets. It is not levied on each profitable week — it comes out of the spread between what the strategies earn and what is posted, which is also why the rates on this page are already net of it. What you see is what is distributed.",
    },
    {
      q: "Is the posted APY what the strategies earned?",
      a: "Not exactly, and the difference is the point. The posted rate is set discretionarily — weekly for syzUSD, daily for yzPP, continuously for Prime and the Marketplace — rather than tracking the underlying week to week. In a {surplus week|https://yuzu-money.gitbook.io/yuzu-money/faq/performance-fee} the excess accrues to the Reserve Fund; in a deficit week the Reserve Fund covers the gap. That buys a smoother payout than the strategies themselves produce. It does not buy a guaranteed one: every rate on this page is variable and can fall.",
    },
    {
      q: "Can I verify the backing myself?",
      a: "Yes, and you should. Reserves and liabilities are attested by {Accountable|https://yuzu-money.gitbook.io/yuzu-money/transparency/accountable} using secure enclaves and zero-knowledge proofs, published live rather than as a periodic report. The figures at the top of this page are read from that same feed — you can compare them against the {public dashboard|https://yuzu.accountable.capital/} at any moment. Contract addresses are in the docs, per product.",
    },
  ],
};

/* ----------------------------------- Footer ----------------------------------- */
export const footer = {
  tagline: ["Institutional-grade risk management.", "On-chain Transparency.", "Yield Engine for everyone."],
  links: [
    { label: "Docs", href: "#" },
    { label: "Audit", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Privacy", href: "#" },
  ],
  socials: [
    { label: "X", href: "https://x.com/YuzuMoneyX" },
    { label: "Telegram", href: "https://t.me/Fabyuzuvip" },
    { label: "Discord", href: "#" },
  ],
  /** Một hàng, các đoạn cách nhau bởi divider nhạt. */
  legalLine: [
    "© 2026 Yuzu Money",
    "All rights reserved",
    "Yields are variable and not guaranteed, capital is at risk, and nothing here is investment advice.",
  ],
};
