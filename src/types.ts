export interface StockQuote {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  sector: string;
  industry: string;
  currentPrice: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCapCr: number;
  peRatio?: number;
  pbRatio?: number;
  high52w?: number;
  low52w?: number;
  isDelayed: boolean;
  delayMinutes: number;
  timestamp: string;
}

export interface Candle {
  timestamp: number;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicators {
  rsi: number;
  macd: {
    macdLine: number;
    signalLine: number;
    histogram: number;
  };
  ema20: number;
  sma50: number;
  vwap: number;
  atr: number;
  support: number;
  resistance: number;
  trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  momentum: 'STRONG' | 'MODERATE' | 'WEAK' | 'NEGATIVE';
  currentPrice: number;
  priceVsEma20Pct: number;
  priceVsSma50Pct: number;
}

export type SignalType = 'BULLISH' | 'BEARISH' | 'NEUTRAL';

// Beginner-first outlook & terminology types
export type AiOutlook = 'POSITIVE' | 'WAIT_AND_WATCH' | 'NEGATIVE';
export type RiskLevel = 'Low' | 'Medium' | 'High';
export type PossibleDirection = 'MAY_GO_UP' | 'UNCLEAR' | 'MAY_GO_DOWN';
export type UserActionRecommendation = 'Invest' | 'Watch' | 'Wait' | 'Avoid';
export type IpoStage = 'UPCOMING' | 'OPEN' | 'AWAITING_LISTING' | 'RECENTLY_LISTED';

export interface IpoAiAnalysis {
  outlook: AiOutlook;
  confidence: number;
  simpleWhy: string;
  companyStrengths: string[];
  companyWeaknesses: string[];
  valuationConcerns: string;
  marketConditions: string;
  industryGrowth: string;
  competitors: string[];
  promoterBackground: string;
  subscriptionTrends: string;
  gmpTrend: string;
  marketSentiment: string;
  importantRisks: string[];
  whatToDo: UserActionRecommendation;
}

export type ContinuousAction = 'Consider Buying' | 'Hold / Continue Watching' | 'Wait' | 'Consider Selling';

export interface MultiFactorBreakdown {
  technicalScore: number;
  fundamentalScore: number;
  macroScore: number;
  sentimentScore: number;
  compositeScore: number;
  crudeImpact?: {
    price: number;
    changePct: number;
    impact: 'BENEFICIARY' | 'ADVERSE' | 'NEUTRAL';
    reason: string;
  };
  goldImpact?: {
    price: number;
    changePct: number;
    impact: 'BENEFICIARY' | 'ADVERSE' | 'NEUTRAL';
    reason: string;
  };
  fxImpact?: {
    usdInr: number;
    impact: 'BENEFICIARY' | 'ADVERSE' | 'NEUTRAL';
    reason: string;
  };
  newsSentiment?: 'POSITIVE' | 'NEGATIVE' | 'MIXED';
  newsHeadlines?: {
    headline: string;
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'MIXED';
    source: string;
    relevance: string;
  }[];
  reasoningTimeline?: {
    timestamp: string;
    previousScore?: number;
    currentScore: number;
    reason: string;
  }[];
  verificationStatus?: 'VERIFIED_REAL_TIME' | 'VERIFIED_15M_DELAY';
  dataSources?: string[];
}

export interface BeginnerStockPrediction {
  symbol: string;
  companyName: string;
  exchange: 'NSE' | 'BSE';
  sector: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  outlook: AiOutlook;
  confidence: number;
  possibleDirection: PossibleDirection;
  risk: RiskLevel;
  simpleExplanation: string;
  whatIsHappening: string;
  whyAiThinksSo: string;
  whatUserShouldDo: UserActionRecommendation;
  continuousRecommendation?: ContinuousAction;
  timeHorizon: string;
  potentialTargetPrice: number;
  safetyExitPrice: number;
  multiFactor?: MultiFactorBreakdown;
  advancedDetails?: {
    rsi: number;
    macdHistogram: number;
    ema20: number;
    sma50: number;
    vwap: number;
    supportPrice: number;
    resistancePrice: number;
    peRatio?: number;
    pbRatio?: number;
    technicalScore: number;
    signalType: SignalType;
  };
}

export interface TradeSignal {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  timestamp: string;
  currentPrice: number;
  technicalScore: number;
  signalType: SignalType;
  timeframe: string;
  entryLow: number;
  entryHigh: number;
  target: number;
  targetPercent: number;
  target2?: number;
  target2Percent?: number;
  stopLoss: number;
  stopLossPercent: number;
  riskReward: string;
  riskRewardRatio: number;
  confidence: number;
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  reasons: string[];
  invalidation: string[];
  indicators: TechnicalIndicators;
  indicatorHash: string;
  isDelayed: boolean;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  exchange: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
}

export interface SectorItem {
  name: string;
  changePercent: number;
  marketStatus: string;
}

export interface MarketOverviewData {
  indices: MarketIndex[];
  marketBreadth: {
    advances: number;
    declines: number;
    unchanged: number;
    advanceDeclineRatio: number;
  };
  topGainers: StockQuote[];
  topLosers: StockQuote[];
  sectors: SectorItem[];
  marketStatus: 'OPEN' | 'CLOSED' | 'PRE-OPEN';
  timestamp: string;
  isDelayed: boolean;
}

export interface AiExplanation {
  symbol: string;
  generatedAt: string;
  isCached: boolean;
  modelUsed: string;
  executiveThesis: string;
  technicalConfluence: string[];
  keyRisks: string[];
  invalidationTriggers: string[];
  macroSectorContext: string;
  suitabilityNote: string;
  disclaimer: string;
}

export interface TelegramAlertLog {
  id: string;
  symbol: string;
  signalType: string;
  sentAt: string;
  chatId?: string;
  status: 'SENT' | 'SIMULATED' | 'FAILED';
  errorMessage?: string;
  formattedMessage: string;
}

export interface TelegramBotInfo {
  id?: number;
  username: string;
  firstName: string;
  link: string;
  tokenMasked?: string;
  isOfficial?: boolean;
  activeSubscribers?: number;
  subscriberList?: string[];
}

export interface TelegramDetectedChat {
  id: string;
  name: string;
  username?: string;
  lastMessage?: string;
  date?: string;
}

export interface WatchlistItem {
  quote: StockQuote;
  signal: TradeSignal;
}

export interface SectorTrendItem {
  name: string;
  changePercent: number;
  marketStatus: 'Strong Bullish' | 'Bullish' | 'Neutral' | 'Slight Bearish' | 'Bearish';
  stockCount: number;
  topStock?: string;
}

export interface MarketTrendData {
  regime: 'BULLISH' | 'BEARISH' | 'CONSOLIDATION' | 'CORRECTION';
  regimeTitle: string;
  regimeDescription: string;
  nifty: {
    symbol: string;
    name: string;
    currentPrice: number;
    change: number;
    changePercent: number;
    high: number;
    low: number;
    open: number;
    prevClose: number;
    trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  };
  sensex: {
    symbol: string;
    name: string;
    currentPrice: number;
    change: number;
    changePercent: number;
    high: number;
    low: number;
  };
  bankNifty: {
    symbol: string;
    name: string;
    currentPrice: number;
    change: number;
    changePercent: number;
    high: number;
    low: number;
  };
  itIndex: {
    symbol: string;
    name: string;
    currentPrice: number;
    change: number;
    changePercent: number;
  };
  vix: {
    symbol: string;
    value: number;
    change: number;
    changePercent: number;
    status: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH';
    description: string;
  };
  marketBreadth: {
    advances: number;
    declines: number;
    unchanged: number;
    advanceDeclineRatio: number;
  };
  sectorRankings: SectorTrendItem[];
  marketStatus: 'OPEN' | 'CLOSED' | 'PRE-OPEN';
  marketStatusMessage: string;
  istTime: string;
  lastUpdated: string;
  isRealFeed: boolean;
  activeFeedCount: number;
}

export interface MacroIndicator {
  symbol: string;
  name: string;
  category: 'Commodity' | 'Currency' | 'Bond' | 'Global Index' | 'Volatility';
  price: number;
  change: number;
  changePercent: number;
  status: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  marketImpact: string;
  timestamp: string;
}

export interface GeopoliticalEvent {
  id: string;
  title: string;
  category: 'War / Geopolitics' | 'US / Trump / Tariffs' | 'Indian Policy / Budget / RBI / SEBI' | 'Disaster / Weather / Supply Chain';
  summary: string;
  source: string;
  publishedAt: string;
  impactedSectors: string[];
  threatLevel: 'HIGH' | 'ELEVATED' | 'MODERATE' | 'LOW';
  marketImplication: string;
}

export interface MutualFundItem {
  schemeCode: number;
  schemeName: string;
  fundHouse: string;
  category: 'Flexi Cap' | 'Large Cap' | 'Mid Cap' | 'Small Cap' | 'Hybrid / Dynamic' | 'ELSS Tax Saver';
  nav: number;
  navDate: string;
  return1Y: number;
  return3Y: number;
  return5Y: number;
  expenseRatio: number;
  aumCr: number;
  ratingStars: number;
  riskGrade: 'Low' | 'Moderate' | 'High' | 'Very High';
  suitability: string;
  source: string;
  aiScore?: number;
  outlook?: AiOutlook;
}

export interface IpoItem {
  id: string;
  companyName: string;
  symbol?: string;
  stage: IpoStage; // 'UPCOMING' | 'OPEN' | 'AWAITING_LISTING' | 'RECENTLY_LISTED'
  category: 'Mainboard' | 'SME';
  sector: string;
  description: string;
  priceBand: string;
  lotSize: number;
  minInvestment: number;
  issueSizeCr: number;
  openDate: string;
  closeDate: string;
  listingDate: string;
  allotmentDate?: string;
  gmpPrice: number;
  gmpPercent: number;
  gmpAvailable?: boolean;
  subscriptionTotal: number;
  subscriptionQIB: number;
  subscriptionNII: number;
  subscriptionRetail: number;
  subscriptionAvailable?: boolean;
  verdict: 'STRONG APPLY' | 'APPLY (LISTING GAINS)' | 'APPLY (LONG TERM)' | 'NEUTRAL' | 'AVOID';
  riskScore: number;
  riskLevel: RiskLevel;
  keyStrengths: string[];
  keyRisks: string[];
  source: string;
  aiAnalysis: IpoAiAnalysis;
  valuationPe?: string;
  issueStructure?: string;
  listingPrice?: number;
  listingGainPercent?: number;
  currentTradingPrice?: number;
}

export interface Top10Recommendation {
  rank: number;
  symbol: string;
  name: string;
  sector: string;
  currentPrice: number;
  action: 'STRONG BUY' | 'BUY' | 'ACCUMULATE' | 'HOLD' | 'AVOID' | 'SELL';
  timeHorizon: 'INTRADAY (1D)' | 'SWING (1-3 WEEKS)' | 'MEDIUM-TERM (1-3 MONTHS)' | 'LONG-TERM (6-12M)';
  confidenceScore: number;
  riskScore: number;
  entryRange: [number, number];
  target1: number;
  target2: number;
  stopLoss: number;
  riskRewardRatio: number;
  technicalScore: number;
  fundamentalScore: number;
  macroGeopoliticalScore: number;
  sentimentScore: number;
  compositeScore: number;
  evidenceFactors: {
    technical: string;
    fundamental: string;
    macroGeopolitical: string;
    catalyst: string;
    invalidation: string;
  };
  dataSource: string;
  dataTimestamp: string;
  isFresh: boolean;
}

export interface BacktestResult {
  totalTrades: number;
  winRatePct: number;
  profitFactor: number;
  avgGainPct: number;
  avgLossPct: number;
  maxDrawdownPct: number;
  sharpeRatio: number;
  samplePeriod: string;
  strategyRules: string[];
}

// ==========================================
// QUANTITATIVE HIGH-FREQUENCY ENGINE TYPES
// Multi-Asset: F&O, Commodities, Intraday
// ==========================================
export type QuantAssetCategory = 'F_AND_O' | 'COMMODITIES' | 'INTRADAY_EQUITY';

export interface QuantOrderBookLevel {
  price: number;
  qty: number;
  orders: number;
  isSpoofed?: boolean;
}

export interface QuantLevel2OrderBook {
  symbol: string;
  timestamp: string;
  bids: QuantOrderBookLevel[];
  asks: QuantOrderBookLevel[];
  totalBidQty: number;
  totalAskQty: number;
  bidAskRatio: number;
  spoofDetected: boolean;
  spoofConfidence: number;
  institutionalDelta: number;
}

export interface QuantIndicatorMetrics {
  currentPrice: number;
  vwap: number;
  bbUpper: number;
  bbMiddle: number;
  bbLower: number;
  bbPercentB: number;
  meanReversionStatus: 'OVERSOLD_BOUNCE' | 'OVERBOUGHT_REJECTION' | 'NEUTRAL_RANGE';
  momentumScore: number;
  pocPrice: number;
  vahPrice: number;
  valPrice: number;
}

export interface QuantAiMacroFilterOverlay {
  macroSentiment: 'BULLISH' | 'BEARISH' | 'VOLATILE_CAUTION';
  macroScore: number;
  diiFiiFlow: {
    fiiNetCrores: number;
    diiNetCrores: number;
    trend: 'ACCUMULATION' | 'DISTRIBUTION' | 'BALANCED';
  };
  geopoliticalRisk: 'LOW' | 'MODERATE' | 'HIGH';
  tariffTradeImpact: string;
  spoofFilteringAction: 'CLEARED' | 'FILTERED_FAKE_WALL' | 'HIGH_SPOOF_RISK';
  compositeTradeConfidence: number;
}

export interface QuantTradeSetup {
  symbol: string;
  assetClass: QuantAssetCategory;
  assetName: string;
  action: 'BUY' | 'SELL';
  contractType?: 'FUT' | 'CALL_CE' | 'PUT_PE' | 'SPOT';
  strike?: number;
  expiry?: string;
  entryPrice: number;
  stopLoss: number;
  targetPrice: number;
  riskRewardRatio: string;
  projectedPnlPercent: number;
  confidenceScore: number;
  timeframe: string;
  triggerReason: string;
}

export interface QuantHistorical10DayBacktestResult {
  symbol: string;
  testPeriodDays: number;
  totalTicksAnalyzed: number;
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  netReturnPercent: number;
  averageTradeGainPercent: number;
  dailyReturns: { day: string; pnlPercent: number; tradesCount: number }[];
}

export interface QuantAssetOverview {
  symbol: string;
  name: string;
  category: QuantAssetCategory;
  contractDetails?: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: string;
  openInterest?: string;
  pcrRatio?: number;
  orderBook: QuantLevel2OrderBook;
  indicators: QuantIndicatorMetrics;
  macroFilter: QuantAiMacroFilterOverlay;
  activeSetup: QuantTradeSetup;
}

