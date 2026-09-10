import { GoogleGenAI, Type } from '@google/genai';
import { TradeSignal } from './signalEngine.js';
import { StockQuote } from './marketData.js';

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

// In-memory cache by (stock_id + indicator_hash)
const aiCache = new Map<string, AiExplanation>();

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

/**
 * Generates an AI-powered technical explanation for a shortlisted stock
 */
export async function generateAiExplanation(
  signal: TradeSignal,
  quote: StockQuote
): Promise<AiExplanation> {
  const cacheKey = `${signal.symbol}_${signal.indicatorHash}`;
  if (aiCache.has(cacheKey)) {
    const cached = aiCache.get(cacheKey)!;
    return { ...cached, isCached: true };
  }

  const ai = getGenAI();

  // If Gemini API Key is missing or invalid, generate high-quality rule-grounded fallback
  if (!ai) {
    const fallback: AiExplanation = createRuleGroundedExplanation(signal, quote, 'Deterministic Engine (API Key not configured)');
    aiCache.set(cacheKey, fallback);
    return fallback;
  }

  try {
    const prompt = `You are ArthaPulse's chief quantitative and technical market analyst specializing in the Indian Stock Market (NSE/BSE).
Provide a rigorous, educational, rule-grounded technical analysis and thesis for this Indian equity setup:

Stock: ${quote.name} (${quote.symbol}.NS)
Sector: ${quote.sector} | Industry: ${quote.industry}
Current Price: ₹${quote.currentPrice} (Delayed 15m)
Signal Type: ${signal.signalType}
Technical Score: ${signal.technicalScore}/100
Confidence: ${signal.confidence}% (${signal.confidenceLevel})
Proposed Entry Range: ₹${signal.entryLow} - ₹${signal.entryHigh}
Target: ₹${signal.target} (${signal.targetPercent > 0 ? '+' : ''}${signal.targetPercent}%)
Stop Loss: ₹${signal.stopLoss} (${signal.stopLossPercent}%)
Risk/Reward: ${signal.riskReward}

Technical Indicators:
- RSI (14): ${signal.indicators.rsi}
- MACD Line: ${signal.indicators.macd.macdLine} | Signal Line: ${signal.indicators.macd.signalLine} | Histogram: ${signal.indicators.macd.histogram}
- 20 EMA: ₹${signal.indicators.ema20} | 50 SMA: ₹${signal.indicators.sma50}
- VWAP: ₹${signal.indicators.vwap}
- ATR (14): ₹${signal.indicators.atr}
- Swing Support: ₹${signal.indicators.support} | Swing Resistance: ₹${signal.indicators.resistance}
- Identified Trend: ${signal.indicators.trend} | Momentum: ${signal.indicators.momentum}

Rule-engine Triggers:
${signal.reasons.map((r) => `- ${r}`).join('\n')}

Invalidation Conditions:
${signal.invalidation.map((i) => `- ${i}`).join('\n')}

Analyze this setup strictly following the guidelines:
1. Ground your thesis purely in the provided indicator values and structural price action.
2. Explain the confluence of indicators (why this level matters).
3. Emphasize strict risk management, exact invalidation conditions, and volatility risks.
4. Keep the tone analytical, disciplined, objective, and educational.
5. Remind the trader that this is an educational analysis and not a guaranteed financial prediction.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            executiveThesis: {
              type: Type.STRING,
              description: 'Clear, concise 2-3 sentence overview of the trade thesis and structural setup.',
            },
            technicalConfluence: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-4 key technical factors showing confluence (moving averages, momentum, RSI, VWAP, support/resistance).',
            },
            keyRisks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2-3 key risks or market events that could jeopardize this trade setup.',
            },
            invalidationTriggers: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Specific price and indicator levels that immediately invalidate this setup.',
            },
            macroSectorContext: {
              type: Type.STRING,
              description: 'Brief sector perspective (e.g. Banking, IT, Auto tailwinds or headwinds).',
            },
            suitabilityNote: {
              type: Type.STRING,
              description: 'Style suitability (e.g., Short-term swing 3-10 days, momentum continuation, or defensive positioning).',
            },
          },
          required: [
            'executiveThesis',
            'technicalConfluence',
            'keyRisks',
            'invalidationTriggers',
            'macroSectorContext',
            'suitabilityNote',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');

    const result: AiExplanation = {
      symbol: signal.symbol,
      generatedAt: new Date().toISOString(),
      isCached: false,
      modelUsed: 'gemini-3.8-flash',
      executiveThesis: parsed.executiveThesis || `Technical setup indicates ${signal.signalType.toLowerCase()} continuation based on moving average and momentum confluence.`,
      technicalConfluence: parsed.technicalConfluence || signal.reasons,
      keyRisks: parsed.keyRisks || ['Market-wide index volatility', 'Earnings announcement surprises', 'Sector rotation'],
      invalidationTriggers: parsed.invalidationTriggers || signal.invalidation,
      macroSectorContext: parsed.macroSectorContext || `Tracking developments in the ${quote.sector} sector relative to broader Nifty sentiment.`,
      suitabilityNote: parsed.suitabilityNote || 'Suitable for disciplined swing traders observing strict stop losses.',
      disclaimer: '⚠️ Educational analysis — not guaranteed prediction. Not SEBI registered investment advice.',
    };

    aiCache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.error('Gemini API call failed, falling back to rule-grounded explanation:', err);
    const fallback = createRuleGroundedExplanation(signal, quote, 'Deterministic Engine (Fallback)');
    aiCache.set(cacheKey, fallback);
    return fallback;
  }
}

/**
 * Creates deterministic rule-grounded explanation when AI is unavailable or as baseline
 */
function createRuleGroundedExplanation(
  signal: TradeSignal,
  quote: StockQuote,
  source: string
): AiExplanation {
  const isBull = signal.signalType === 'BULLISH';
  const isBear = signal.signalType === 'BEARISH';

  return {
    symbol: signal.symbol,
    generatedAt: new Date().toISOString(),
    isCached: false,
    modelUsed: source,
    executiveThesis: isBull
      ? `${quote.name} is consolidating above key moving averages with RSI at ${signal.indicators.rsi}, indicating sustained buyer accumulation and positive trend structure towards ₹${signal.target}.`
      : isBear
      ? `${quote.name} exhibits downward price pressure below its 20 EMA with negative momentum, pointing to potential distribution towards the support level near ₹${signal.target}.`
      : `${quote.name} is trading inside a range between ₹${signal.indicators.support} and ₹${signal.indicators.resistance} with neutral indicators. Awaiting structural volume breakout.`,
    technicalConfluence: signal.reasons,
    keyRisks: [
      'Broader Nifty/BankNifty index correlation and macro volatility',
      `Unexpected break below critical stop loss at ₹${signal.stopLoss}`,
      'Volume dry-up during key session breakouts',
    ],
    invalidationTriggers: signal.invalidation,
    macroSectorContext: `Sector: ${quote.sector}. Relative strength should be confirmed against benchmark indices before entering position.`,
    suitabilityNote: 'Targeted for 3 to 10 trading session swing horizon with predefined risk parameters.',
    disclaimer: '⚠️ Educational analysis — not guaranteed prediction. Not SEBI registered investment advice.',
  };
}
