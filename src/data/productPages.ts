/* ==========================================================================
   NỘI DUNG TRANG SẢN PHẨM — chép verbatim từ dev.yuzu.money/{alpha,prime,marketplace}.

   Riêng 4 số ở dải KPI: trang dev đang trả 0% / $0.0M vì API môi trường dev
   không có dữ liệu. Ở đây lấy đúng con số thật đã dùng trong `content.ts`
   (yields, facts, stats) thay vì bê nguyên số 0 — chép chữ thì verbatim,
   chép số hỏng thì không.
   ========================================================================== */

export type Kpi = { value: string; label: string };
export type Layer = { title: string; desc: string };
export type Step = { label: string; value: string };
export type TokenCard = { name: string; desc: string };
/** Thẻ vault của Marketplace: mô tả + 6 chỉ số. */
export type Vault = {
  name: string;
  desc: string;
  metrics: { label: string; value: string }[];
  /** Icon token — bản dev cho 3 icon này nhấp nhẹ trong khối Composition. */
  icon?: string;
  upcoming?: boolean;
};

export type ProductPage = {
  id: "alpha" | "prime" | "marketplace";
  /** Tên hiển thị ở breadcrumb sang 2 sản phẩm còn lại. */
  name: string;
  kicker: string;
  title: string;
  intro: string;
  primary: { label: string; rate?: string; href: string };
  secondary: { label: string; href: string };
  kpis: Kpi[];
  composition: { kicker: string; title: string; note?: string };
  /** Chỉ Marketplace có: mỗi vault là một exposure riêng, kèm bảng chỉ số. */
  vaults?: Vault[];
  terms: { kicker: string; title: string };
  tokens: TokenCard[];
  tokensNote?: string;
  protection: { kicker: string; title: string; layers: Layer[] };
  path: { kicker: string; steps: Step[]; note: string };
  closing: {
    title: string;
    body: string;
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
  };
};

export const alphaPage: ProductPage = {
  id: "alpha",
  name: "Alpha",
  kicker: "Stablecoin engine",
  title: "Yuzu Alpha",
  intro:
    "An actively managed portfolio of leveraged DeFi yield, split into two tranches. syzUSD takes the senior claim and pays a weekly yield. yzPP sits underneath it, absorbs the first loss, and is paid a premium for standing there.",
  primary: { label: "Start earning", rate: "8%", href: "#" },
  secondary: { label: "View research", href: "#" },
  kpis: [
    { value: "8%", label: "Senior APY, syzUSD" },
    { value: "28%", label: "Junior APY, yzPP" },
    { value: "$63.00M", label: "Capital deployed" },
    { value: "108.66%", label: "Collateralization" },
  ],
  composition: {
    kicker: "Composition",
    title: "Tranched yield from curated, institutional-grade strategies",
    note:
      "Every protocol and asset these strategies are allowed to touch is published in advance on the asset whitelist, so the venues behind each weight above can be read before you deposit rather than inferred afterwards.",
  },
  terms: {
    kicker: "Terms",
    title: "Who can get in, how fast you get out, what stands under you.",
  },
  tokens: [
    { name: "yzUSD", desc: "The stablecoin, senior claim, held at par" },
    { name: "syzUSD", desc: "Staked yzUSD, ERC-4626, earns the weekly yield" },
    { name: "yzPP", desc: "Junior tranche, takes the first loss" },
  ],
  tokensNote:
    "yzPP stands under both: it takes the first loss in full before yzUSD is touched.",
  protection: {
    kicker: "Protection",
    title: "Defence in depth, outermost first.",
    layers: [
      {
        title: "Overcollateral",
        desc:
          "Assets exceed liabilities; the cushion absorbs a drawdown before par is at risk",
      },
      {
        title: "yzPP junior tranche",
        desc: "Takes the first loss in full before yzUSD is touched",
      },
      {
        title: "Reserve Fund",
        desc: "Protocol-funded buffer sitting alongside the junior tranche",
      },
      {
        title: "Attestation",
        desc: "Assets and liabilities attested every 15 minutes by Accountable",
      },
    ],
  },
  path: {
    kicker: "The path in",
    steps: [
      { label: "You deposit", value: "USDT0" },
      { label: "Access", value: "No KYC to stake, screening to mint" },
      { label: "It runs", value: "Leveraged DeFi, two tranches" },
      { label: "You hold", value: "syzUSD" },
    ],
    note:
      "Yuzu takes the greater of 10% of yield generated or 1% a year on assets. Posted rates are what is distributed, so they are already net of it.",
  },
  closing: {
    title: "Put a dollar to work in Alpha.",
    body:
      "Staking open, minting gated. Positions and reserves are attested every fifteen minutes, and the attestation is public.",
    primary: { label: "Open Alpha", href: "#" },
    secondary: { label: "See the reserves", href: "#transparency" },
  },
};

/** Thứ tự để dựng breadcrumb: mỗi trang trỏ sang 2 trang còn lại. */
export const productOrder: ProductPage["id"][] = ["alpha", "prime", "marketplace"];

export const marketplacePage: ProductPage = {
  id: "marketplace",
  name: "Marketplace",
  kicker: "Curated single strategies",
  title: "Yuzu Marketplace",
  intro:
    "Where Alpha and Prime hand you a managed portfolio, the Marketplace hands you one named exposure. Each vault is underwritten by the Yuzu risk team and publishes its diligence before it opens.",
  primary: { label: "Start earning", rate: "6-11.8%", href: "#" },
  secondary: { label: "View research", href: "#" },
  kpis: [
    { value: "$11.45M", label: "Capital deployed" },
    { value: "3", label: "Vaults live" },
    { value: "6-11.8%", label: "Net APY range" },
    { value: "24h-monthly", label: "Time to exit" },
  ],
  composition: {
    kicker: "Composition",
    title: "Single-asset yield exposure, one strategy at a time",
  },
  vaults: [
    {
      name: "yzCash",
      icon: "/assets/tokens/yzCash.svg",
      desc: "The U.S. sovereign rate, onchain. Backed by tokenized T-Bills from leading issuers, with no lockup.",
      metrics: [
        { label: "Net APY", value: "6%" },
        { label: "TVL", value: "$7.55M" },
        { label: "Liquidity", value: "24 hours" },
        { label: "Risk", value: "Low" },
        { label: "Chain", value: "Ethereum" },
        { label: "Leverage", value: "None" },
      ],
    },
    {
      name: "yzSyrup",
      icon: "/assets/tokens/yzSyrup.svg",
      desc: "Overcollateralized lending to institutional borrowers through Maple Syrup, wrapped as one yield-bearing token. Loans are secured by liquid digital assets, with recourse.",
      metrics: [
        { label: "Net APY", value: "10%" },
        { label: "TVL", value: "$3.85M" },
        { label: "Liquidity", value: "3 days" },
        { label: "Risk", value: "Low-Moderate" },
        { label: "Chain", value: "Ethereum" },
        { label: "Leverage", value: "Yes" },
      ],
    },
    {
      name: "yzmGLOBAL",
      icon: "https://assets.yuzu.money/vault-catalog/1-0x7c5ed3b2dc8c353d685005b9e06e3250d47d839e/icon-9923fa43-2149-402f-bc3c-eaf1ef715f78.png",
      desc: "This vault provides leverage exposure to Fasanara's M-Glo and M-Global, both bearing similar underlying exposure - to Fasanara Capital's Global Diversified Alternative Debt Fund (GDADF).",
      metrics: [
        { label: "Net APY", value: "11.8%" },
        { label: "TVL", value: "$50K" },
        { label: "Liquidity", value: "Monthly" },
        { label: "Risk", value: "Moderate" },
        { label: "Chain", value: "Ethereum" },
        { label: "Leverage", value: "Yes" },
      ],
    },
    {
      name: "More on the way",
      desc: "New vaults are underwritten and listed regularly, each with its diligence published before it opens. Announcements go out on X and Telegram first.",
      metrics: [],
      upcoming: true,
    },
  ],
  terms: {
    kicker: "Terms",
    title: "Who can get in, how fast you get out, what stands under you.",
  },
  tokens: [
    { name: "yzCash", desc: "Tokenized T-Bill cash management" },
    { name: "yzSyrup", desc: "Maple Syrup institutional lending" },
    { name: "yzmGLOBAL", desc: "Asset-Backed Credit" },
  ],
  protection: {
    kicker: "Protection",
    title: "Defence in depth, outermost first.",
    layers: [
      {
        title: "Pre-listing diligence",
        desc: "Published before a vault opens for deposits",
      },
      { title: "Risk rating", desc: "Low to Moderate across the 3 live vaults" },
      {
        title: "Underlying collateral",
        desc: "T-Bills for yzCash, recourse loans secured by liquid assets for yzSyrup",
      },
      {
        title: "Single exposure",
        desc: "One strategy per token, so nothing is hidden behind a basket",
      },
    ],
  },
  path: {
    kicker: "The path in",
    steps: [
      { label: "You deposit", value: "USDC" },
      { label: "Access", value: "Permissionless, connect and deposit" },
      { label: "It runs", value: "One curated strategy" },
      { label: "You hold", value: "yzCash or yzSyrup" },
    ],
    note:
      "Yuzu takes the greater of 10% of yield generated or 1% a year on assets. Posted rates are what is distributed, so they are already net of it.",
  },
  closing: {
    title: "Put a dollar to work in Marketplace.",
    body:
      "Permissionless. Positions and reserves are attested every fifteen minutes, and the attestation is public.",
    primary: { label: "Open Marketplace", href: "#" },
    secondary: { label: "See the reserves", href: "#transparency" },
  },
};

/* --------------------------------- Prime ---------------------------------
   Prime không dùng khung Terms / token / protection / path-in như hai trang kia.
   Nó là một trang research: ba mảng tài sản, mỗi mảng có số liệu và luận điểm,
   kèm timeline CLO và phần chú thích nguồn. Vì vậy có kiểu riêng.
   ------------------------------------------------------------------------- */

export type Stat = { value: string; label: string };
export type Claim = { title: string; body: string };
export type Era = { year: string; title: string; body: string };

export type PrimePage = {
  kicker: string;
  title: string;
  intro: string;
  primary: { label: string; rate?: string; href: string };
  secondary: { label: string; href: string };
  kpis: Kpi[];
  tbills: { kicker: string; title: string; stats: Stat[]; claims: Claim[] };
  clo: {
    kicker: string;
    title: string;
    body: string;
    stats: Stat[];
    timeline: Era[];
    compare: { title: string; cards: Claim[] };
  };
  lending: { kicker: string; title: string; body: string; cards: Claim[]; note: string };
  closing: ProductPage["closing"];
  sources: { title: string; items: { ref: string; text: string }[]; disclaimer: string };
};

export const primePage: PrimePage = {
  kicker: "Tokenized fixed income",
  title: "Yuzu Prime",
  intro:
    "Institutional-grade fixed income, tokenized onchain. Powered by a diversified portfolio of US Treasuries, A-grade investment credit, and overcollateralized lending.",
  primary: { label: "Start Earning", rate: "7% APY", href: "#" },
  secondary: { label: "View Research", href: "#" },
  kpis: [
    { value: "7%", label: "APY" },
    { value: "$7.57M", label: "TVL" },
    { value: "100.05%", label: "Backing" },
  ],
  tbills: {
    kicker: "US Treasuries (tokenized T-Bills)",
    title: "Near-instant liquidity, institutional-grade safety",
    stats: [
      { value: "$9B+", label: "Tokenized T-Bill market" },
      { value: "$2.9B", label: "BlackRock BUIDL fund" },
      { value: "40%+", label: "Market share (BUIDL)" },
    ],
    claims: [
      {
        title: "Issued by the world's largest asset managers",
        body:
          "BlackRock's BUIDL fund surpassed $2.9 billion in assets, commanding over 40% of the tokenized Treasury market.[1] Franklin Templeton's BENJI crossed $800 million. The tokenized T-Bill market grew from $2 billion in mid-2024 to over $9 billion by late 2025.[2] BlackRock is now exploring tokenized ETFs beyond Treasuries.[9]",
      },
      {
        title: "Instant settlement, 24/7 liquidity",
        body:
          "Traditional T-Bills settle on T+1 or T+2 cycles within business hours. Tokenized versions settle near-instantly on-chain, any time, any day. Institutions can redeem into USDC in minutes, freeing capital that would otherwise sit locked in settlement windows.[2]",
      },
      {
        title: "Backed by the US government",
        body:
          "Underlying assets are short-dated US Treasury bills – one of the safest and most liquid instruments in global finance, backed by the full faith and credit of United States. Custody is held at Bank of New York Mellon under institutional-grade infrastructure.[1]",
      },
      {
        title: "DeFi composability, Yield-bearing collateral",
        body:
          "Tokenized T-Bills are increasingly accepted as margin collateral on decentralized and centralized platforms. BUIDL is already accepted as collateral on Deribit and Aave.[3] Tokenized T-Bills have become the base layer for on-chain lending, reducing reliance on volatile crypto-native collateral while earning the risk-free rate.",
      },
    ],
  },
  clo: {
    kicker: "A-grade investment credit",
    title: "CLOs are battle-tested",
    body:
      "CLOs survived even the 2008 subprime mortgage crisis. AAA-rated CLO tranches have never experienced a default — through the dot-com crash, the Global Financial Crisis, the COVID-19 pandemic, and every downturn in between. 60% of loans in a CLO portfolio would need to default before AAA tranches even begin to lose money.",
    stats: [
      { value: "0", label: "AAA CLO defaults ever[4]" },
      { value: "$325B", label: "CDO losses in 2008 (CLOs: $0)[4]" },
      { value: "60%", label: "Loan defaults needed to touch AAA[5]" },
      { value: "$1T+", label: "CLO market outstanding[6]" },
    ],
    timeline: [
      {
        year: "1996",
        title: "First CLO issued",
        body:
          "CLO market established as a new structured credit vehicle for institutional investors.",
      },
      {
        year: "2001",
        title: "Dot-com crash",
        body:
          "AAA CLO tranches held firm through the tech collapse and recession. Zero defaults recorded on senior tranches.",
      },
      {
        year: "2008",
        title: "Global Financial Crisis",
        body:
          "While CDOs lost $325 billion, AAA CLO tranches lost nothing. S&P confirmed zero defaults on AAA-rated CLO tranches pre-crisis.[4]",
      },
      {
        year: "2011",
        title: "European debt crisis",
        body:
          "Sovereign debt turmoil left AAA CLOs untouched. Post-crisis CLO 2.0 structures emerged with stronger protections.[4]",
      },
      {
        year: "2020",
        title: "COVID-19 pandemic",
        body:
          "AAA coverage ratios fell only 13% vs 26% in 2008. No AAA defaults. Recovery was swift — full restoration by year-end.[4] [10]",
      },
      {
        year: "2022",
        title: "Rate shock & bank failures",
        body:
          "Aggressive Fed hikes and SVB collapse stressed fixed income. AAA CLOs maintained performance through the volatility.",
      },
      {
        year: "2026",
        title: "Today",
        body:
          "No AAA-rated CLO tranche has ever defaulted in the 30-year history of the asset class. Over $1 trillion outstanding.",
      },
    ],
    compare: {
      title: "CLOs are not CDOs.",
      cards: [
        {
          title: "CDOs (2008 villain)",
          body:
            "Pools of subprime consumer mortgages. Correlated defaults amplified losses. AAA-rated CDOs lost $325 billion. Highly concentrated in a single, deteriorating asset class.",
        },
        {
          title: "CLOs (battle-tested)",
          body:
            "Pools of 150–250 senior secured corporate loans, diversified across dozens of industries. Actively managed with monthly coverage tests. No AAA tranche has ever defaulted in 30 years.",
        },
      ],
    },
  },
  lending: {
    kicker: "Overcollateralized lending",
    title: "Maple Finance",
    body:
      "Collateral pool comprises of only highly liquid digital assets. Liquidations are processed in seconds and battle tested through deep drawdowns and volatility[7]. Assets without acceptable liquidity are not eligible, and concentration limits are enforced across the loan book.[8]",
    cards: [
      {
        title: "166.5% — Collateralization ratio",
        body:
          "Every loan is overcollateralized with highly liquid digital assets. Automated liquidation triggers protect lenders from any shortfall.",
      },
      {
        title: "$12B+ — Processed, zero lender losses",
        body:
          "Over $12 billion cumulative loan volume with a >99% repayment rate. During October 2025's flash crash, all margin calls were met within three hours, followed by $150 million in net inflows.[7]",
      },
      {
        title: "BTC, ETH, XRP — Large-cap liquid collateral",
        body:
          "Collateral ratios verifiable on-chain in real time with active margin call monitoring 24/7/365 with 3 independent price feed sources.[8]",
      },
    ],
    note: "Collateral ratios verified on-chain 24/7 via 3 independent price feeds",
  },
  closing: {
    title: "Put a dollar to work in Prime.",
    body:
      "Deposit USDC to mint yzPrime. Your capital is deployed into investment-grade fixed-income strategies from traditional finance, reachable entirely on-chain, and the reserves behind it are attested every fifteen minutes.",
    primary: { label: "Mint yzPrime", href: "#" },
    secondary: { label: "RWA dashboard", href: "#transparency" },
  },
  sources: {
    title: "Sources & References",
    items: [
      {
        ref: "[1]",
        text: "BlackRock BUIDL fund AUM and custody infrastructure. The Block — “BlackRock’s BUIDL first to cross $1 billion” (Mar 2025); Securitize / BlackRock Press Release (Jun 2025): “BUIDL… the largest tokenized short-term treasury fund in the world.” BNY Mellon serves as custodian.",
      },
      {
        ref: "[2]",
        text: "Tokenized US Treasury market growth. Financial Times (Aug 2025): “Tokenised US treasury funds more than double to $7.4bn in 2025.” Cited in Zoniqx Market Trends Report; Bank for International Settlements — Bulletin No. 115: “TVL rose more than tenfold to almost $9 billion by the end of October 2025.”",
      },
      {
        ref: "[3]",
        text: "BUIDL accepted as collateral on Deribit, Binance, and Aave. CoinDesk — “BlackRock’s Tokenized Fund Gets Listed as Collateral on Binance” (Nov 2025); PR Newswire / Securitize (Jun 2025); Messari: SyrupUSDC onboarded to Aave V3 (Jan 2026).",
      },
      {
        ref: "[4]",
        text: "AAA CLO zero default history; CDO losses of $325B. Wharton School of Business — “Why CLOs Will Not Cause the Next Financial Crisis” (Roberts & Schwert, 2020); Oaktree Capital — “CLO Myth-Busting: The Top Three Misconceptions”; Clarion Capital: “Of the nearly 21,000 CLO tranches rated by S&P, only 67 or 0.3% have defaulted.”",
      },
      {
        ref: "[5]",
        text: "60% default threshold for AAA CLO tranches. Wharton — Roberts & Schwert: “If lenders were to recover $0.40 on the dollar for loans in default, then 60% of the loans in CLO portfolios would have to default before the AAA-rated tranches would even begin to lose money.”",
      },
      {
        ref: "[6]",
        text: "CLO market size exceeding $1 trillion. Federal Reserve Bank of Philadelphia — “CLO Performance” Working Paper (Cordell, Roberts, Schwert); S&P Global (2020): “$2.1 trillion of leveraged loan issuance since the 2008 financial crisis has been funded by CLOs.”",
      },
      {
        ref: "[7]",
        text: "Maple Finance loan volume, repayment record, and Oct 2025 stress test. Maple Finance — “syrupUSDC and syrupUSDT: Built for Scale” (2026): “zero losses to date, including during sharp drawdowns such as October 10th”; Messari — Maple Finance: CEO confirmed all margin calls met within 3 hours during Oct 10 flash crash, followed by $150M inflows. Total deposits surpassed $4 billion (Dec 2025).",
      },
      {
        ref: "[8]",
        text: "Maple collateral management, margin call process, and eligible asset framework. Maple Finance Documentation — FAQ: 24/7/365 monitoring, three separate price feed sources, strict concentration limits. All loans are overcollateralized; Maple does not use a tranched structure — all lenders in a pool have equal priority via an ERC-4626 vault standard.",
      },
      {
        ref: "[9]",
        text: "BlackRock exploring tokenized ETFs beyond Treasuries. Bloomberg, reported via CoinDesk — “BlackRock Weighs Tokenized ETFs on Blockchain” (Sep 2025).",
      },
      {
        ref: "[10]",
        text: "CLO resilience during COVID-19: AAA coverage ratios. Lord Abbett — “CLO Equity: A History of Resilience Across Market Cycles”; NYU Stern / Philadelphia Fed — CLO Performance: “AAA coverage ratios only fell by 13% in the first quarter of 2020” vs 26% in 2008.",
      },
    ],
    disclaimer:
      "This page is for informational purposes only and does not constitute investment advice. Past performance is not indicative of future results. All investments carry risk, including potential loss of principal. Data sourced from public reports and may not reflect the most current figures.",
  },
};
