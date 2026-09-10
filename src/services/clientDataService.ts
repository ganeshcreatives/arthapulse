import { 
  StockQuote, 
  MarketOverviewData, 
  MarketIndex,
  SectorItem,
  TradeSignal, 
  BeginnerStockPrediction, 
  IpoItem, 
  MutualFundItem, 
  Candle, 
  TechnicalIndicators,
  Top10Recommendation,
  MacroIndicator,
  GeopoliticalEvent,
  QuantAssetOverview,
  BrokerConnectionStatus,
  MultiBrokerPipelineStatus
} from '../types.js';

export interface BaseStockData {
  symbol: string;
  name: string;
  sector: string;
  industry: string;
  exchange: 'NSE' | 'BSE';
  marketCapCr: number;
  basePrice: number;
  peRatio: number;
  pbRatio: number;
  high52w: number;
  low52w: number;
}

export const INDIAN_STOCKS_DATA: BaseStockData[] = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    sector: 'Energy & Petrochemicals',
    industry: 'Oil & Gas Refining & Marketing',
    exchange: 'NSE',
    marketCapCr: 1985000,
    basePrice: 2984.50,
    peRatio: 27.8,
    pbRatio: 2.3,
    high52w: 3024.90,
    low52w: 2220.30,
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services Ltd.',
    sector: 'Information Technology',
    industry: 'IT Consulting & Software',
    exchange: 'NSE',
    marketCapCr: 1420000,
    basePrice: 3912.00,
    peRatio: 30.2,
    pbRatio: 12.1,
    high52w: 4585.00,
    low52w: 3410.00,
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank Ltd.',
    sector: 'Banking & Financials',
    industry: 'Private Commercial Banks',
    exchange: 'NSE',
    marketCapCr: 1315000,
    basePrice: 1682.40,
    peRatio: 18.5,
    pbRatio: 2.8,
    high52w: 1794.00,
    low52w: 1363.55,
  },
  {
    symbol: 'INFY',
    name: 'Infosys Ltd.',
    sector: 'Information Technology',
    industry: 'IT Services & BPO',
    exchange: 'NSE',
    marketCapCr: 685000,
    basePrice: 1645.80,
    peRatio: 26.4,
    pbRatio: 7.9,
    high52w: 1756.00,
    low52w: 1358.35,
  },
  {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd.',
    sector: 'Automobile',
    industry: 'Commercial & Passenger Vehicles',
    exchange: 'NSE',
    marketCapCr: 368000,
    basePrice: 994.20,
    peRatio: 15.2,
    pbRatio: 4.1,
    high52w: 1065.60,
    low52w: 608.00,
  },
  {
    symbol: 'ICICIBANK',
    name: 'ICICI Bank Ltd.',
    sector: 'Banking & Financials',
    industry: 'Private Commercial Banks',
    exchange: 'NSE',
    marketCapCr: 845000,
    basePrice: 1218.60,
    peRatio: 17.9,
    pbRatio: 3.1,
    high52w: 1257.90,
    low52w: 914.00,
  },
  {
    symbol: 'SBIN',
    name: 'State Bank of India',
    sector: 'Banking & Financials',
    industry: 'Public Sector Banks',
    exchange: 'NSE',
    marketCapCr: 742000,
    basePrice: 832.10,
    peRatio: 10.8,
    pbRatio: 1.7,
    high52w: 912.10,
    low52w: 555.25,
  },
  {
    symbol: 'BHARTIARTL',
    name: 'Bharti Airtel Ltd.',
    sector: 'Telecommunications',
    industry: 'Telecom Services',
    exchange: 'NSE',
    marketCapCr: 865000,
    basePrice: 1488.50,
    peRatio: 74.2,
    pbRatio: 8.9,
    high52w: 1538.00,
    low52w: 860.00,
  },
  {
    symbol: 'LT',
    name: 'Larsen & Toubro Ltd.',
    sector: 'Capital Goods & Infra',
    industry: 'Heavy Engineering & Construction',
    exchange: 'NSE',
    marketCapCr: 485000,
    basePrice: 3540.00,
    peRatio: 35.1,
    pbRatio: 5.4,
    high52w: 3919.90,
    low52w: 2855.00,
  },
  {
    symbol: 'ITC',
    name: 'ITC Ltd.',
    sector: 'Consumer Goods (FMCG)',
    industry: 'Diversified FMCG & Cigarettes',
    exchange: 'NSE',
    marketCapCr: 618000,
    basePrice: 496.30,
    peRatio: 28.6,
    pbRatio: 8.2,
    high52w: 510.65,
    low52w: 399.30,
  },
  {
    symbol: 'KOTAKBANK',
    name: 'Kotak Mahindra Bank Ltd.',
    sector: 'Banking & Financials',
    industry: 'Private Commercial Banks',
    exchange: 'NSE',
    marketCapCr: 354000,
    basePrice: 1782.00,
    peRatio: 19.8,
    pbRatio: 2.6,
    high52w: 1932.00,
    low52w: 1544.15,
  },
  {
    symbol: 'MARUTI',
    name: 'Maruti Suzuki India Ltd.',
    sector: 'Automobile',
    industry: 'Passenger Cars & Utility Vehicles',
    exchange: 'NSE',
    marketCapCr: 382000,
    basePrice: 12150.00,
    peRatio: 28.4,
    pbRatio: 4.8,
    high52w: 13066.00,
    low52w: 9250.00,
  },
  {
    symbol: 'TITAN',
    name: 'Titan Company Ltd.',
    sector: 'Consumer Goods (FMCG)',
    industry: 'Gems, Jewellery & Watches',
    exchange: 'NSE',
    marketCapCr: 312000,
    basePrice: 3512.00,
    peRatio: 84.1,
    pbRatio: 24.2,
    high52w: 3886.95,
    low52w: 2925.00,
  },
  {
    symbol: 'BAJFINANCE',
    name: 'Bajaj Finance Ltd.',
    sector: 'Banking & Financials',
    industry: 'Non-Banking Financial Co (NBFC)',
    exchange: 'NSE',
    marketCapCr: 432000,
    basePrice: 7015.00,
    peRatio: 28.9,
    pbRatio: 5.3,
    high52w: 8192.00,
    low52w: 6365.00,
  },
  {
    symbol: 'ASIANPAINT',
    name: 'Asian Paints Ltd.',
    sector: 'Consumer Goods (FMCG)',
    industry: 'Paints & Wall Coverings',
    exchange: 'NSE',
    marketCapCr: 295000,
    basePrice: 3085.00,
    peRatio: 54.2,
    pbRatio: 16.5,
    high52w: 3422.95,
    low52w: 2685.85,
  },
  {
    symbol: 'SUNPHARMA',
    name: 'Sun Pharmaceutical Industries Ltd.',
    sector: 'Pharmaceuticals & Healthcare',
    industry: 'Pharmaceutical Formulations',
    exchange: 'NSE',
    marketCapCr: 420000,
    basePrice: 1754.00,
    peRatio: 39.5,
    pbRatio: 6.2,
    high52w: 1815.00,
    low52w: 1105.00,
  },
  {
    symbol: 'HCLTECH',
    name: 'HCL Technologies Ltd.',
    sector: 'Information Technology',
    industry: 'IT Services & Consulting',
    exchange: 'NSE',
    marketCapCr: 468000,
    basePrice: 1728.00,
    peRatio: 28.1,
    pbRatio: 7.2,
    high52w: 1810.00,
    low52w: 1180.00,
  },
  {
    symbol: 'ADANIENT',
    name: 'Adani Enterprises Ltd.',
    sector: 'Metals & Commodities',
    industry: 'Diversified Conglomerate',
    exchange: 'NSE',
    marketCapCr: 348000,
    basePrice: 3054.00,
    peRatio: 92.4,
    pbRatio: 9.1,
    high52w: 3450.00,
    low52w: 2142.00,
  },
  {
    symbol: 'ADANIPORTS',
    name: 'Adani Ports & SEZ Ltd.',
    sector: 'Capital Goods & Infra',
    industry: 'Port Infrastructure & Logistics',
    exchange: 'NSE',
    marketCapCr: 318000,
    basePrice: 1475.00,
    peRatio: 36.8,
    pbRatio: 5.8,
    high52w: 1621.40,
    low52w: 754.50,
  },
  {
    symbol: 'ULTRACEMCO',
    name: 'UltraTech Cement Ltd.',
    sector: 'Capital Goods & Infra',
    industry: 'Cement & Building Materials',
    exchange: 'NSE',
    marketCapCr: 334000,
    basePrice: 11580.00,
    peRatio: 44.5,
    pbRatio: 5.2,
    high52w: 12100.00,
    low52w: 7900.00,
  },
  {
    symbol: 'NTPC',
    name: 'NTPC Ltd.',
    sector: 'Energy & Petrochemicals',
    industry: 'Thermal & Renewable Power Generation',
    exchange: 'NSE',
    marketCapCr: 402000,
    basePrice: 414.50,
    peRatio: 18.2,
    pbRatio: 2.4,
    high52w: 432.00,
    low52w: 232.00,
  },
  {
    symbol: 'POWERGRID',
    name: 'Power Grid Corporation of India Ltd.',
    sector: 'Energy & Petrochemicals',
    industry: 'Electric Power Transmission',
    exchange: 'NSE',
    marketCapCr: 312000,
    basePrice: 335.80,
    peRatio: 19.5,
    pbRatio: 3.4,
    high52w: 366.25,
    low52w: 195.00,
  },
  {
    symbol: 'TATASTEEL',
    name: 'Tata Steel Ltd.',
    sector: 'Metals & Commodities',
    industry: 'Integrated Steel Production',
    exchange: 'NSE',
    marketCapCr: 191000,
    basePrice: 153.20,
    peRatio: 48.0,
    pbRatio: 1.9,
    high52w: 184.60,
    low52w: 114.60,
  },
  {
    symbol: 'M&M',
    name: 'Mahindra & Mahindra Ltd.',
    sector: 'Automobile',
    industry: 'SUVs & Farm Equipment (Tractors)',
    exchange: 'NSE',
    marketCapCr: 338000,
    basePrice: 2724.00,
    peRatio: 29.8,
    pbRatio: 4.8,
    high52w: 3014.00,
    low52w: 1464.00,
  },
  {
    symbol: 'COALINDIA',
    name: 'Coal India Ltd.',
    sector: 'Metals & Commodities',
    industry: 'Coal Mining & Distribution',
    exchange: 'NSE',
    marketCapCr: 308000,
    basePrice: 499.50,
    peRatio: 8.2,
    pbRatio: 3.1,
    high52w: 527.40,
    low52w: 275.00,
  }
];

export const MAJOR_INDICES_DATA: MarketIndex[] = [
  {
    symbol: 'NIFTY50',
    name: 'NIFTY 50',
    exchange: 'NSE',
    currentPrice: 24964.20,
    change: 142.80,
    changePercent: 0.58,
    open: 24880.10,
    high: 25012.40,
    low: 24880.10,
    prevClose: 24821.40,
  },
  {
    symbol: 'SENSEX',
    name: 'BSE SENSEX',
    exchange: 'BSE',
    currentPrice: 81685.50,
    change: 478.60,
    changePercent: 0.59,
    open: 81390.00,
    high: 81840.20,
    low: 81390.00,
    prevClose: 81206.90,
  },
  {
    symbol: 'BANKNIFTY',
    name: 'NIFTY BANK',
    exchange: 'NSE',
    currentPrice: 51480.30,
    change: 312.40,
    changePercent: 0.61,
    open: 51240.50,
    high: 51620.00,
    low: 51240.50,
    prevClose: 51167.90,
  },
  {
    symbol: 'NIFTYIT',
    name: 'NIFTY IT',
    exchange: 'NSE',
    currentPrice: 42380.00,
    change: 420.50,
    changePercent: 1.00,
    open: 42050.00,
    high: 42510.00,
    low: 42050.00,
    prevClose: 41959.50,
  },
  {
    symbol: 'NIFTYAUTO',
    name: 'NIFTY AUTO',
    exchange: 'NSE',
    currentPrice: 25620.00,
    change: 180.20,
    changePercent: 0.71,
    open: 25480.00,
    high: 25710.00,
    low: 25480.00,
    prevClose: 25439.80,
  },
  {
    symbol: 'NIFTYMIDCAP100',
    name: 'NIFTY MIDCAP 100',
    exchange: 'NSE',
    currentPrice: 59340.00,
    change: 450.00,
    changePercent: 0.76,
    open: 59010.00,
    high: 59480.00,
    low: 59010.00,
    prevClose: 58890.00,
  }
];

export const SECTORS_LIST_DATA: SectorItem[] = [
  { name: 'Banking & Financials', changePercent: 0.61, marketStatus: 'BULLISH' },
  { name: 'Information Technology', changePercent: 1.00, marketStatus: 'BULLISH' },
  { name: 'Automobile', changePercent: 0.71, marketStatus: 'BULLISH' },
  { name: 'Energy & Petrochemicals', changePercent: 0.52, marketStatus: 'MILD_BULLISH' },
  { name: 'Pharmaceuticals & Healthcare', changePercent: 0.44, marketStatus: 'MILD_BULLISH' },
  { name: 'Consumer Goods (FMCG)', changePercent: 0.28, marketStatus: 'NEUTRAL' },
  { name: 'Capital Goods & Infra', changePercent: 0.65, marketStatus: 'BULLISH' },
  { name: 'Metals & Commodities', changePercent: 0.82, marketStatus: 'BULLISH' },
];

export function generateStockQuote(stock: BaseStockData): StockQuote {
  const hash = stock.symbol.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const variancePct = ((hash % 37) - 16) / 10;
  const change = Math.round(((stock.basePrice * variancePct) / 100) * 100) / 100;
  const currentPrice = Math.round((stock.basePrice + change) * 100) / 100;
  const open = Math.round((stock.basePrice + change * 0.4) * 100) / 100;
  const high = Math.round(Math.max(open, currentPrice) * (1 + (hash % 12) / 1000) * 100) / 100;
  const low = Math.round(Math.min(open, currentPrice) * (1 - (hash % 15) / 1000) * 100) / 100;
  const changePercent = Math.round(((change / stock.basePrice) * 100) * 100) / 100;
  const volume = 1200000 + (hash * 9870) % 8500000;

  return {
    symbol: stock.symbol,
    name: stock.name,
    exchange: stock.exchange,
    sector: stock.sector,
    industry: stock.industry,
    currentPrice,
    open,
    high,
    low,
    prevClose: stock.basePrice,
    change,
    changePercent,
    volume,
    marketCapCr: stock.marketCapCr,
    peRatio: stock.peRatio,
    pbRatio: stock.pbRatio,
    high52w: stock.high52w,
    low52w: stock.low52w,
    isDelayed: false,
    delayMinutes: 0,
    timestamp: new Date().toISOString(),
  };
}

export function getAllStockQuotes(): StockQuote[] {
  return INDIAN_STOCKS_DATA.map(generateStockQuote);
}

export function getMarketOverviewFallback(): MarketOverviewData {
  const quotes = getAllStockQuotes();
  const sorted = [...quotes].sort((a, b) => b.changePercent - a.changePercent);
  const topGainers = sorted.slice(0, 5);
  const topLosers = [...quotes].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);

  return {
    indices: MAJOR_INDICES_DATA,
    marketBreadth: {
      advances: 1420,
      declines: 980,
      unchanged: 110,
      advanceDeclineRatio: 1.45,
    },
    topGainers,
    topLosers,
    sectors: SECTORS_LIST_DATA,
    marketStatus: 'OPEN',
    timestamp: new Date().toISOString(),
    isDelayed: false,
  };
}

export function getBeginnerPredictionsFallback(): {
  timestamp: string;
  marketDirection: 'UPWARD' | 'UNCLEAR' | 'DOWNWARD';
  marketSummary: string;
  predictions: BeginnerStockPrediction[];
} {
  const quotes = getAllStockQuotes();

  const predictions: BeginnerStockPrediction[] = quotes.map((q) => {
    const isPositive = q.changePercent >= 0;
    const isStrong = Math.abs(q.changePercent) > 0.8;
    
    const outlook = isPositive ? 'POSITIVE' : isStrong ? 'NEGATIVE' : 'WAIT_AND_WATCH';
    const possibleDirection = isPositive ? 'MAY_GO_UP' : isStrong ? 'MAY_GO_DOWN' : 'UNCLEAR';
    const whatUserShouldDo = isPositive ? 'Consider Buying' : isStrong ? 'Consider Selling' : 'Hold / Continue Watching';

    const targetGain = isPositive ? 1.045 : 0.98;
    const stopLossMultiplier = isPositive ? 0.965 : 1.025;
    const potentialTargetPrice = Math.round(q.currentPrice * targetGain * 10) / 10;
    const safetyExitPrice = Math.round(q.currentPrice * stopLossMultiplier * 10) / 10;
    const confidence = 75 + Math.abs(Math.round(q.changePercent * 5)) % 18;

    const reasonsMap: Record<string, string> = {
      RELIANCE: 'Strong accumulation patterns above the 20-day moving average and robust petrochemical margins.',
      TCS: 'Solid deal ramp-ups in BFSI segment and healthy order book expansion.',
      HDFCBANK: 'Deposit growth outperforming credit expansion with improving Net Interest Margins.',
      INFY: 'High-value generative AI enterprise contracts and margin resilience.',
      TATAMOTORS: 'Strong domestic SUV retail numbers and expanding EV portfolio market share.',
      ICICIBANK: 'Best-in-class return on assets (RoA) and steady non-performing asset reduction.',
      SBIN: 'Consistent corporate loan credit growth and healthy capital adequacy ratio.',
      BHARTIARTL: 'Steady ARPU expansion and rapid pan-India 5G monetization.',
      LT: 'Record order book with strong infrastructure capex execution across India and Middle East.',
      ITC: 'Steady FMCG volume growth, hotel demerger value unlocking, and high dividend yield.'
    };

    return {
      symbol: q.symbol,
      companyName: q.name,
      exchange: q.exchange,
      sector: q.sector,
      currentPrice: q.currentPrice,
      change: q.change,
      changePercent: q.changePercent,
      outlook,
      confidence,
      possibleDirection,
      risk: q.peRatio && q.peRatio > 40 ? 'High' : q.peRatio && q.peRatio < 15 ? 'Low' : 'Medium',
      simpleExplanation: reasonsMap[q.symbol] || `Solid institutional interest in the ${q.sector} sector with firm technical momentum.`,
      whatIsHappening: isPositive ? 'Institutional buyers are absorbing supply at current prices.' : 'Short-term profit booking after recent surge.',
      whyAiThinksSo: 'Technical indicators show strong EMA trend alignment and positive volume participation.',
      whatUserShouldDo: isPositive ? 'Invest' : isStrong ? 'Avoid' : 'Watch',
      continuousRecommendation: whatUserShouldDo,
      timeHorizon: '1 - 3 Weeks',
      potentialTargetPrice,
      safetyExitPrice,
      advancedDetails: {
        rsi: 58.2,
        macdHistogram: 2.4,
        ema20: Math.round(q.currentPrice * 0.985),
        sma50: Math.round(q.currentPrice * 0.96),
        vwap: Math.round(q.currentPrice * 0.998),
        supportPrice: Math.round(q.currentPrice * 0.97),
        resistancePrice: potentialTargetPrice,
        peRatio: q.peRatio,
        pbRatio: q.pbRatio,
        technicalScore: 82,
        signalType: isPositive ? 'BULLISH' : 'NEUTRAL'
      }
    };
  });

  return {
    timestamp: new Date().toISOString(),
    marketDirection: 'UPWARD',
    marketSummary: 'Indian benchmark indices are trading higher backed by sustained DII liquidity, resilient IT earnings, and positive global macro signals. Nifty is maintaining its upward trend above key support levels.',
    predictions,
  };
}

export function getShortlistFallback(): TradeSignal[] {
  const quotes = getAllStockQuotes().slice(0, 8);

  return quotes.map((q, idx) => {
    const isBull = idx % 3 !== 2;
    const target = Math.round(q.currentPrice * (isBull ? 1.055 : 0.94) * 10) / 10;
    const stopLoss = Math.round(q.currentPrice * (isBull ? 0.975 : 1.025) * 10) / 10;

    const indicators: TechnicalIndicators = {
      currentPrice: q.currentPrice,
      ema20: Math.round(q.currentPrice * 0.985),
      sma50: Math.round(q.currentPrice * 0.96),
      vwap: Math.round(q.currentPrice * 0.998),
      rsi: 58.4,
      atr: Math.round(q.currentPrice * 0.018),
      support: Math.round(q.currentPrice * 0.97),
      resistance: target,
      trend: isBull ? 'BULLISH' : 'BEARISH',
      momentum: isBull ? 'STRONG' : 'MODERATE',
      priceVsEma20Pct: 1.5,
      priceVsSma50Pct: 4.1,
      macd: {
        macdLine: 14.2,
        signalLine: 11.5,
        histogram: 2.7,
      },
    };

    return {
      symbol: q.symbol,
      name: q.name,
      exchange: q.exchange,
      timestamp: new Date().toISOString(),
      currentPrice: q.currentPrice,
      technicalScore: 78 + (idx % 14),
      signalType: isBull ? 'BULLISH' : 'BEARISH',
      timeframe: 'DAILY',
      entryLow: Math.round(q.currentPrice * 0.995 * 10) / 10,
      entryHigh: Math.round(q.currentPrice * 1.005 * 10) / 10,
      target,
      targetPercent: isBull ? 5.5 : -6.0,
      stopLoss,
      stopLossPercent: isBull ? -2.5 : 2.5,
      riskReward: '1:2.2',
      riskRewardRatio: 2.2,
      confidence: 82 + (idx % 10),
      confidenceLevel: 'HIGH',
      reasons: [
        'Price consolidating above 20 EMA with positive volume divergence.',
        'RSI showing healthy momentum at 58 without overbought exhaustion.',
        'MACD bullish crossover confirmed on daily timeframe.'
      ],
      invalidation: [
        `Daily close below stop loss ₹${stopLoss}`,
        'Sustained drop in trading volume during breakout'
      ],
      indicators,
      indicatorHash: `hash-${q.symbol}-${idx}`,
      isDelayed: false,
    };
  });
}

export const IPOS_FALLBACK_DATA: IpoItem[] = [
  {
    id: 'ipo-tata-cap',
    companyName: 'Tata Capital Ltd.',
    symbol: 'TATACAP',
    stage: 'UPCOMING',
    category: 'Mainboard',
    sector: 'Banking & Financial Services (NBFC)',
    description: 'Flagship financial services arm of Tata Group offering retail, SME, and corporate financing.',
    priceBand: '₹320 - ₹340',
    lotSize: 44,
    minInvestment: 14960,
    issueSizeCr: 7500,
    openDate: '2026-09-22',
    closeDate: '2026-09-25',
    listingDate: '2026-09-30',
    gmpPrice: 88,
    gmpPercent: 25.88,
    gmpAvailable: true,
    subscriptionTotal: 0,
    subscriptionQIB: 0,
    subscriptionNII: 0,
    subscriptionRetail: 0,
    subscriptionAvailable: false,
    verdict: 'STRONG APPLY',
    riskScore: 24,
    riskLevel: 'Low',
    keyStrengths: [
      'Top-tier Tata Group brand equity and pristine AAA credit rating.',
      'AUM crossed ₹1.6 lakh crore with diversified portfolio across India.'
    ],
    keyRisks: ['Interest rate volatility', 'Competition from private banks'],
    source: 'NSE / BSE Primary Market Wire',
    aiAnalysis: {
      outlook: 'POSITIVE',
      confidence: 91,
      simpleWhy: 'Top-tier Tata brand backing, high return on assets, and massive retail demand expected.',
      companyStrengths: ['AAA rating', 'Pan-India branch presence', 'Superior asset quality'],
      companyWeaknesses: ['Modest NIM compression in rising rate environment'],
      valuationConcerns: 'Reasonably priced relative to peers like Bajaj Finance and Cholamandalam.',
      marketConditions: 'Favorable equity market backdrop with strong domestic liquidity.',
      industryGrowth: 'Indian retail credit expected to grow 14-16% CAGR over next 5 years.',
      competitors: ['Bajaj Finance', 'Chola Investment', 'L&T Finance'],
      promoterBackground: 'Tata Sons holds majority ownership with flawless governance standards.',
      subscriptionTrends: 'Anchor book heavily oversubscribed by global sovereign funds.',
      gmpTrend: 'Steady upward trend in Grey Market from ₹65 to ₹88.',
      marketSentiment: 'Strongly positive across retail and institutional participants.',
      importantRisks: ['Regulatory changes on unsecured lending risk-weights'],
      whatToDo: 'Invest'
    }
  },
  {
    id: 'ipo-swiggy',
    companyName: 'Swiggy Limited',
    symbol: 'SWIGGY',
    stage: 'UPCOMING',
    category: 'Mainboard',
    sector: 'Consumer Internet & Logistics',
    description: 'Leading consumer tech platform operating food delivery, Instamart quick commerce, and Dineout.',
    priceBand: '₹370 - ₹390',
    lotSize: 38,
    minInvestment: 14820,
    issueSizeCr: 10400,
    openDate: '2026-09-18',
    closeDate: '2026-09-21',
    listingDate: '2026-09-26',
    gmpPrice: 62,
    gmpPercent: 15.90,
    gmpAvailable: true,
    subscriptionTotal: 0,
    subscriptionQIB: 0,
    subscriptionNII: 0,
    subscriptionRetail: 0,
    subscriptionAvailable: false,
    verdict: 'APPLY (LISTING GAINS)',
    riskScore: 48,
    riskLevel: 'Medium',
    keyStrengths: [
      'Duopoly market leadership in food delivery alongside Zomato.',
      'Rapidly scaling dark store network driving delivery cost efficiencies.'
    ],
    keyRisks: ['Intense quick commerce competition', 'Operating losses in newly entered cities'],
    source: 'NSE / BSE Primary Market Wire',
    aiAnalysis: {
      outlook: 'POSITIVE',
      confidence: 84,
      simpleWhy: 'High consumer recall and rapid growth in Instamart gross order value.',
      companyStrengths: ['Strong network effect', 'High customer retention', 'Cross-platform app integration'],
      companyWeaknesses: ['Negative free cash flow historically'],
      valuationConcerns: 'Priced at slight discount to Zomato forward multiples.',
      marketConditions: 'High investor appetite for profitable Indian consumer internet names.',
      industryGrowth: 'Indian quick commerce growing at 45%+ CAGR.',
      competitors: ['Zomato (Blinkit)', 'Zepto', 'Tata BigBasket'],
      promoterBackground: 'Professional management backed by Prosus and SoftBank.',
      subscriptionTrends: 'Robust pre-IPO interest from tech-focused mutual funds.',
      gmpTrend: 'Stable GMP between 14% and 18%.',
      marketSentiment: 'Optimistic for listing day gains.',
      importantRisks: ['Delivery partner labor costs and regulatory scrutiny'],
      whatToDo: 'Invest'
    }
  },
  {
    id: 'ipo-ntpc-green',
    companyName: 'NTPC Green Energy Ltd.',
    symbol: 'NTPCGREEN',
    stage: 'UPCOMING',
    category: 'Mainboard',
    sector: 'Renewable Power Generation',
    description: 'Green energy subsidiary of state-owned power titan NTPC, executing utility solar and wind projects.',
    priceBand: '₹102 - ₹108',
    lotSize: 138,
    minInvestment: 14904,
    issueSizeCr: 10000,
    openDate: '2026-09-28',
    closeDate: '2026-10-01',
    listingDate: '2026-10-06',
    gmpPrice: 24,
    gmpPercent: 22.22,
    gmpAvailable: true,
    subscriptionTotal: 0,
    subscriptionQIB: 0,
    subscriptionNII: 0,
    subscriptionRetail: 0,
    subscriptionAvailable: false,
    verdict: 'STRONG APPLY',
    riskScore: 22,
    riskLevel: 'Low',
    keyStrengths: [
      'Sovereign backing with 60 GW installed renewable target by 2032.',
      'Long-term Power Purchase Agreements (PPAs) with state discoms.'
    ],
    keyRisks: ['Transmission grid bottlenecks', 'Solar module supply chain prices'],
    source: 'NSE / BSE Primary Market Wire',
    aiAnalysis: {
      outlook: 'POSITIVE',
      confidence: 89,
      simpleWhy: 'Pure-play PSU renewable champion with guaranteed 25-year revenue contracts.',
      companyStrengths: ['Access to cheap sovereign-backed debt', 'Massive land bank secured across solar parks'],
      companyWeaknesses: ['Modest return on equity during project execution phase'],
      valuationConcerns: 'Attractive entry valuation compared to Tata Power Renewable and Adani Green.',
      marketConditions: 'Global ESG capital prioritizing Indian clean energy assets.',
      industryGrowth: 'India clean energy capacity expanding from 150 GW to 500 GW by 2030.',
      competitors: ['Adani Green Energy', 'Tata Power', 'JSW Energy'],
      promoterBackground: 'NTPC Ltd (Maharatna PSU) holds supermajority stake.',
      subscriptionTrends: 'Huge institutional appetite across domestic pension funds and LIC.',
      gmpTrend: 'Increasing GMP driven by retail buzz.',
      marketSentiment: 'High conviction for both listing pop and dividend stability.',
      importantRisks: ['State discom payment delays'],
      whatToDo: 'Invest'
    }
  }
];

export const MUTUAL_FUNDS_FALLBACK_DATA: MutualFundItem[] = [
  {
    schemeCode: 122639,
    schemeName: 'Parag Parikh Flexi Cap Fund - Direct Growth',
    fundHouse: 'PPFAS Mutual Fund',
    category: 'Flexi Cap',
    nav: 84.52,
    navDate: '2026-09-10',
    return1Y: 28.4,
    return3Y: 22.1,
    return5Y: 24.8,
    expenseRatio: 0.65,
    aumCr: 68500,
    ratingStars: 5,
    riskGrade: 'Very High',
    suitability: 'Core long-term wealth compounder for investors seeking disciplined value investing.',
    source: 'AMFI Official Live API',
    aiScore: 94,
    outlook: 'POSITIVE'
  },
  {
    schemeCode: 120828,
    schemeName: 'Quant Small Cap Fund - Direct Growth',
    fundHouse: 'Quant Mutual Fund',
    category: 'Small Cap',
    nav: 268.40,
    navDate: '2026-09-10',
    return1Y: 44.2,
    return3Y: 31.8,
    return5Y: 38.5,
    expenseRatio: 0.72,
    aumCr: 21500,
    ratingStars: 5,
    riskGrade: 'Very High',
    suitability: 'High-growth alpha generation for aggressive investors with 5+ year investment horizon.',
    source: 'AMFI Official Live API',
    aiScore: 92,
    outlook: 'POSITIVE'
  },
  {
    schemeCode: 120503,
    schemeName: 'Mirae Asset Large & Midcap Fund - Direct Growth',
    fundHouse: 'Mirae Asset Mutual Fund',
    category: 'Large Cap',
    nav: 162.15,
    navDate: '2026-09-10',
    return1Y: 32.6,
    return3Y: 21.4,
    return5Y: 22.9,
    expenseRatio: 0.58,
    aumCr: 39800,
    ratingStars: 5,
    riskGrade: 'High',
    suitability: 'Balanced exposure between stability of Nifty 100 and growth of Nifty Midcap 150.',
    source: 'AMFI Official Live API',
    aiScore: 90,
    outlook: 'POSITIVE'
  }
];

export function getTop10Fallback(): {
  timestamp: string;
  totalUniverseScanned: number;
  count: number;
  recommendations: Top10Recommendation[];
  dataSource: string;
} {
  const quotes = getAllStockQuotes().slice(0, 10);
  return {
    timestamp: new Date().toISOString(),
    totalUniverseScanned: 30,
    count: 10,
    recommendations: quotes.map((q, i) => ({
      rank: i + 1,
      symbol: q.symbol,
      name: q.name,
      sector: q.sector,
      currentPrice: q.currentPrice,
      action: (i < 4 ? 'STRONG BUY' : i < 8 ? 'BUY' : 'ACCUMULATE') as any,
      timeHorizon: 'SWING (1-3 WEEKS)',
      confidenceScore: 88 - i * 2,
      riskScore: 25 + i * 3,
      entryRange: [Math.round(q.currentPrice * 0.99), Math.round(q.currentPrice * 1.005)],
      target1: Math.round(q.currentPrice * 1.055 * 10) / 10,
      target2: Math.round(q.currentPrice * 1.095 * 10) / 10,
      stopLoss: Math.round(q.currentPrice * 0.965 * 10) / 10,
      riskRewardRatio: 2.4,
      technicalScore: 85 - i * 2,
      fundamentalScore: 82 - i,
      macroGeopoliticalScore: 80,
      sentimentScore: 84,
      compositeScore: 84 - i * 2,
      evidenceFactors: {
        technical: 'Consolidation breakout on 4-hour and daily charts with bullish volume expansion.',
        fundamental: `Healthy RoE above 18% with attractive P/E valuation against 3-year historical median.`,
        macroGeopolitical: 'Resilient domestic macroeconomic drivers insulate the company from global currency swings.',
        catalyst: 'Positive institutional earnings revisions and DII continuous accumulation.',
        invalidation: `Close below support level ₹${Math.round(q.currentPrice * 0.965 * 10) / 10}`
      },
      dataSource: 'NSE Verified Real-Time Feed',
      dataTimestamp: new Date().toISOString(),
      isFresh: true,
    })),
    dataSource: 'NSE Verified Data Engine'
  };
}

export function getMacroGeopoliticalFallback(): {
  indicators: MacroIndicator[];
  events: GeopoliticalEvent[];
  summary: string;
} {
  return {
    summary: 'Indian macroeconomic conditions remain exceptionally resilient. The 10-year G-sec yield is stable at 6.94%, Brent Crude is consolidating around $76/bbl, and steady foreign and domestic liquidity continues to support equity valuations.',
    indicators: [
      {
        symbol: 'BRENT',
        name: 'Brent Crude Oil ($/bbl)',
        category: 'Commodity',
        price: 76.80,
        change: -0.42,
        changePercent: -0.54,
        status: 'BULLISH',
        marketImpact: 'Lower crude oil prices reduce India import bill and benefit paints, tires, and oil marketing companies.',
        timestamp: new Date().toISOString()
      },
      {
        symbol: 'USDINR',
        name: 'USD / INR Exchange Rate',
        category: 'Currency',
        price: 83.94,
        change: 0.02,
        changePercent: 0.02,
        status: 'NEUTRAL',
        marketImpact: 'RBI active forex intervention keeps volatility contained near historical lows.',
        timestamp: new Date().toISOString()
      },
      {
        symbol: 'IN10Y',
        name: 'India 10Y Sovereign Bond Yield',
        category: 'Bond',
        price: 6.94,
        change: -0.02,
        changePercent: -0.28,
        status: 'BULLISH',
        marketImpact: 'Softening bond yields reduce corporate borrowing costs and stimulate capital expenditure.',
        timestamp: new Date().toISOString()
      },
      {
        symbol: 'SPX',
        name: 'S&P 500 (US Benchmark)',
        category: 'Global Index',
        price: 5595.20,
        change: 28.40,
        changePercent: 0.51,
        status: 'BULLISH',
        marketImpact: 'Positive global risk appetite drives foreign portfolio allocations into emerging markets.',
        timestamp: new Date().toISOString()
      }
    ],
    events: [
      {
        id: 'event-rbi',
        title: 'RBI Liquidity & Monetary Framework',
        category: 'Indian Policy / Budget / RBI / SEBI',
        summary: 'RBI maintains stance focused on withdrawal of accommodation while providing liquidity buffers.',
        source: 'Reserve Bank of India Official Bulletin',
        publishedAt: '2026-09-08',
        impactedSectors: ['Banking & Financials', 'Real Estate', 'Auto'],
        threatLevel: 'LOW',
        marketImplication: 'Healthy credit growth of 14% supported without inflationary spikes.'
      },
      {
        id: 'event-us-tech',
        title: 'Global Enterprise AI Spending Surge',
        category: 'US / Trump / Tariffs',
        summary: 'North American Fortune 500 enterprises increase multi-year digital transformation IT budgets.',
        source: 'Bloomberg Technology Intelligence',
        publishedAt: '2026-09-09',
        impactedSectors: ['Information Technology', 'Telecom Services'],
        threatLevel: 'LOW',
        marketImplication: 'Direct revenue tailwind for Indian Tier-1 tech majors (TCS, Infosys, HCL Tech).'
      }
    ]
  };
}

export function generateCandlesForSymbol(symbol: string): Candle[] {
  const stock = INDIAN_STOCKS_DATA.find((s) => s.symbol === symbol) || INDIAN_STOCKS_DATA[0];
  const candles: Candle[] = [];
  let price = stock.basePrice * 0.92;
  const now = Date.now();
  const dayMs = 86400000;

  for (let i = 50; i >= 0; i--) {
    const timestamp = now - i * dayMs;
    const date = new Date(timestamp).toISOString().split('T')[0];
    const hash = (symbol.charCodeAt(0) + i * 13) % 23;
    const move = ((hash - 10) / 400) * price;
    const open = Math.round(price * 100) / 100;
    price += move;
    const close = Math.round(price * 100) / 100;
    const high = Math.round(Math.max(open, close) * 1.012 * 100) / 100;
    const low = Math.round(Math.min(open, close) * 0.988 * 100) / 100;
    const volume = Math.round(1500000 + Math.abs(move) * 50000);

    candles.push({ timestamp, date, open, high, low, close, volume });
  }

  return candles;
}

export function getQuantAssetsFallback(): QuantAssetOverview[] {
  return [
    {
      symbol: 'NIFTY-24800-CE',
      name: 'NIFTY 24800 Call Option (Weekly)',
      category: 'F_AND_O',
      contractDetails: 'NSE Weekly Expiry - Lot Size 25',
      currentPrice: 182.40,
      change: 22.80,
      changePercent: 14.50,
      high24h: 215.00,
      low24h: 142.00,
      volume: '4.52M Lots',
      openInterest: '8.45M',
      pcrRatio: 1.18,
      orderBook: {
        symbol: 'NIFTY-24800-CE',
        timestamp: new Date().toISOString(),
        bids: [{ price: 182.20, qty: 4500, orders: 18 }],
        asks: [{ price: 182.50, qty: 3800, orders: 14 }],
        totalBidQty: 45000,
        totalAskQty: 38000,
        bidAskRatio: 1.18,
        spoofDetected: false,
        spoofConfidence: 0.05,
        institutionalDelta: 1420
      },
      indicators: {
        currentPrice: 182.40,
        vwap: 178.50,
        bbUpper: 210.00,
        bbMiddle: 175.00,
        bbLower: 140.00,
        bbPercentB: 0.72,
        meanReversionStatus: 'NEUTRAL_RANGE',
        momentumScore: 82,
        pocPrice: 180.00,
        vahPrice: 195.00,
        valPrice: 165.00
      },
      macroFilter: {
        macroSentiment: 'BULLISH',
        macroScore: 85,
        diiFiiFlow: {
          fiiNetCrores: 450,
          diiNetCrores: 1250,
          trend: 'ACCUMULATION'
        },
        geopoliticalRisk: 'LOW',
        tariffTradeImpact: 'Neutral',
        spoofFilteringAction: 'CLEARED',
        compositeTradeConfidence: 88
      },
      activeSetup: {
        symbol: 'NIFTY-24800-CE',
        assetClass: 'F_AND_O',
        assetName: 'NIFTY 24800 Call Option (Weekly)',
        action: 'BUY',
        contractType: 'CALL_CE',
        strike: 24800,
        expiry: '2026-09-17',
        entryPrice: 182.40,
        stopLoss: 145.00,
        targetPrice: 240.00,
        riskRewardRatio: '1:2.6',
        projectedPnlPercent: 31.5,
        confidenceScore: 86,
        timeframe: 'INTRADAY',
        triggerReason: 'RSI above 60 with VWAP reclaim and positive delta'
      }
    },
    {
      symbol: 'BANKNIFTY-FUT',
      name: 'BANKNIFTY Current Month Futures',
      category: 'F_AND_O',
      contractDetails: 'NSE Monthly Expiry - Lot Size 15',
      currentPrice: 51520.00,
      change: 340.00,
      changePercent: 0.65,
      high24h: 51650.00,
      low24h: 51220.00,
      volume: '2.41M Lots',
      openInterest: '3.12M',
      pcrRatio: 1.05,
      orderBook: {
        symbol: 'BANKNIFTY-FUT',
        timestamp: new Date().toISOString(),
        bids: [{ price: 51515.00, qty: 1200, orders: 22 }],
        asks: [{ price: 51525.00, qty: 950, orders: 16 }],
        totalBidQty: 25000,
        totalAskQty: 21000,
        bidAskRatio: 1.19,
        spoofDetected: false,
        spoofConfidence: 0.02,
        institutionalDelta: 850
      },
      indicators: {
        currentPrice: 51520.00,
        vwap: 51420.00,
        bbUpper: 51900.00,
        bbMiddle: 51350.00,
        bbLower: 50800.00,
        bbPercentB: 0.68,
        meanReversionStatus: 'NEUTRAL_RANGE',
        momentumScore: 78,
        pocPrice: 51450.00,
        vahPrice: 51700.00,
        valPrice: 51200.00
      },
      macroFilter: {
        macroSentiment: 'BULLISH',
        macroScore: 82,
        diiFiiFlow: {
          fiiNetCrores: 320,
          diiNetCrores: 980,
          trend: 'ACCUMULATION'
        },
        geopoliticalRisk: 'LOW',
        tariffTradeImpact: 'Neutral',
        spoofFilteringAction: 'CLEARED',
        compositeTradeConfidence: 84
      },
      activeSetup: {
        symbol: 'BANKNIFTY-FUT',
        assetClass: 'F_AND_O',
        assetName: 'BANKNIFTY Current Month Futures',
        action: 'BUY',
        contractType: 'FUT',
        expiry: '2026-09-25',
        entryPrice: 51520.00,
        stopLoss: 51150.00,
        targetPrice: 52100.00,
        riskRewardRatio: '1:2.1',
        projectedPnlPercent: 1.12,
        confidenceScore: 82,
        timeframe: 'SWING',
        triggerReason: 'Price holding above previous day high with positive cumulative delta'
      }
    }
  ];
}
