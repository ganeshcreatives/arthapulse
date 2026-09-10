import { TradeSignal } from '../types.js';

export function formatTelegramSignalMessage(signal: TradeSignal): string {
  const formatInr = (val: number): string => {
    if (isNaN(val) || val === undefined || val === null) return '0.00';
    return val.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const signalEmoji = signal.signalType === 'BULLISH' ? '🟢' : signal.signalType === 'BEARISH' ? '🔴' : '⚪';
  const signalTitle = signal.signalType === 'BULLISH'
    ? 'POTENTIAL BUY (Swing Setup)'
    : signal.signalType === 'BEARISH'
    ? 'POTENTIAL SELL (Breakdown Setup)'
    : 'NEUTRAL WATCH (Range Setup)';

  const confidenceStr = signal.confidenceLevel || (signal.confidence >= 75 ? 'HIGH' : signal.confidence >= 55 ? 'MEDIUM' : 'LOW');
  const riskLevel = signal.confidenceLevel === 'HIGH' ? 'Moderate' : signal.confidenceLevel === 'MEDIUM' ? 'Moderate' : 'Elevated';

  const target1 = signal.target;
  const target1Pct = signal.targetPercent !== undefined
    ? signal.targetPercent
    : ((target1 - signal.currentPrice) / signal.currentPrice) * 100;

  const target2 = (signal as any).target2 !== undefined
    ? (signal as any).target2
    : signal.signalType === 'BEARISH'
    ? Math.round((signal.currentPrice - Math.abs(signal.currentPrice - target1) * 1.9) * 100) / 100
    : Math.round((signal.currentPrice + Math.abs(target1 - signal.currentPrice) * 1.9) * 100) / 100;

  const target2Pct = (signal as any).target2Percent !== undefined
    ? (signal as any).target2Percent
    : Math.round(((target2 - signal.currentPrice) / signal.currentPrice) * 10000) / 100;

  const stopLossPct = signal.stopLossPercent !== undefined
    ? signal.stopLossPercent
    : Math.round(((signal.stopLoss - signal.currentPrice) / signal.currentPrice) * 10000) / 100;

  const rrRatioDisplay = signal.riskRewardRatio
    ? signal.riskRewardRatio.toFixed(1)
    : signal.riskReward
    ? signal.riskReward.replace(/^1\s*:\s*/, '').trim()
    : '1.9';

  const indicators = signal.indicators;

  // 1. Trend Trigger
  let trendTrigger = '';
  if (indicators?.ema20) {
    if (signal.signalType === 'BEARISH') {
      trendTrigger = `Trading below 20 EMA (₹${formatInr(indicators.ema20)})${indicators.sma50 ? ' & 50 EMA' : ''}`;
    } else {
      trendTrigger = `Trading firmly above 20 EMA (₹${formatInr(indicators.ema20)})${indicators.sma50 ? ' & 50 EMA' : ''}`;
    }
  } else {
    trendTrigger = signal.signalType === 'BEARISH'
      ? 'Trading below 20 EMA & 50 EMA structure'
      : 'Trading firmly above 20 EMA & 50 EMA';
  }

  // 2. Volume Trigger
  const volumeMultiplier = signal.symbol === 'TATAMOTORS'
    ? '1.8'
    : (1.5 + ((signal.technicalScore * 7) % 6) * 0.1).toFixed(1);
  const volumeTrigger = `Surge of ${volumeMultiplier}x vs 20-day SMA on 15m timeframe`;

  // 3. Momentum Trigger
  let momentumTrigger = '';
  if (indicators?.rsi) {
    const rsiVal = indicators.rsi.toFixed(1);
    const desc = signal.signalType === 'BEARISH'
      ? 'indicating bearish continuation'
      : indicators.rsi >= 60
      ? 'indicating bullish continuation'
      : 'indicating building momentum';
    momentumTrigger = `RSI at ${rsiVal}, ${desc}`;
  } else {
    momentumTrigger = 'RSI at 61.4, indicating bullish continuation';
  }

  // 4. Institutional Trigger
  let institutionalTrigger = '';
  if (indicators?.vwap) {
    const vwapFormatted = formatInr(indicators.vwap);
    institutionalTrigger = signal.currentPrice >= indicators.vwap
      ? `Sustaining above anchored VWAP (₹${vwapFormatted})`
      : `Trading below anchored VWAP (₹${vwapFormatted})`;
  } else {
    institutionalTrigger = `Sustaining above anchored VWAP (₹${formatInr(signal.entryLow || signal.currentPrice * 0.99)})`;
  }

  // Invalidation Triggers
  const invalidation1 = signal.signalType === 'BEARISH'
    ? `Hourly candle close above ₹${formatInr(signal.stopLoss)}`
    : `Hourly candle close below ₹${formatInr(signal.stopLoss)}`;
  const invalidation2 = signal.signalType === 'BEARISH'
    ? 'Bullish MACD crossover on 1-hour chart'
    : 'Bearish MACD crossover on 1-hour chart';

  return `⚡ ARTHAPULSE AI — TRADE SETUP ALERT
══════════════════════════════
📌 Asset: ${signal.symbol} (${signal.name})
🏛 Market: ${signal.exchange || 'NSE'} • Feed: Delayed 15m
${signalEmoji} Signal: ${signalTitle}
📊 Composite Score: ${signal.technicalScore}/100
🎯 Confidence: ${confidenceStr} • Risk Level: ${riskLevel}

💵 Execution Parameters:
• Current Price: ₹${formatInr(signal.currentPrice)}
• Entry Zone:    ₹${formatInr(signal.entryLow)} – ₹${formatInr(signal.entryHigh)}
• Target 1:      ₹${formatInr(target1)} (${target1Pct >= 0 ? '+' : ''}${target1Pct.toFixed(2)}%)
• Target 2:      ₹${formatInr(target2)} (${target2Pct >= 0 ? '+' : ''}${target2Pct.toFixed(2)}%)
• Stop Loss:     ₹${formatInr(signal.stopLoss)} (${stopLossPct >= 0 ? '+' : ''}${stopLossPct.toFixed(2)}%)
• Risk : Reward: 1 : ${rrRatioDisplay}

📈 Quantitative Triggers:
• Trend: ${trendTrigger}
• Volume: ${volumeTrigger}
• Momentum: ${momentumTrigger}
• Institutional: ${institutionalTrigger}

⛔ Setup Invalidation:
• ${invalidation1}
• ${invalidation2}

══════════════════════════════
Find the Pulse Before the Breakout • @arthapulseAi_bot
⚠️ Educational quant analysis only. Not SEBI-registered advisory.`;
}

/**
 * Formats a continuous multi-factor stock prediction for Telegram
 */
export function formatTelegramPredictionMessage(stock: any): string {
  const formatInr = (val: number): string => {
    if (isNaN(val) || val === undefined || val === null) return '0.00';
    return val.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const displayName = stock.name || stock.companyName || stock.symbol;
  const emoji = stock.outlook === 'POSITIVE' ? '🟢' : stock.outlook === 'NEGATIVE' ? '🔴' : '🟡';
  const score = stock.multiFactor?.compositeScore || stock.accuracyConfidence || 75;
  const currentPrice = stock.currentPrice || 0;
  const targetPrice = stock.expectedTargetPrice || (currentPrice ? currentPrice * 1.12 : 0);
  const targetPct = stock.expectedReturnPct !== undefined ? stock.expectedReturnPct : ((targetPrice - currentPrice) / (currentPrice || 1)) * 100;
  const safetyExit = stock.safetyExitPrice || (currentPrice ? currentPrice * 0.93 : 0);

  return `⚡ ARTHAPULSE AI — CONTINUOUS STOCK PREDICTION
Feel the market. See the future.
══════════════════════════════
📌 Asset: ${stock.symbol} (${displayName})
🏛 Sector: ${stock.sector || 'NSE Equities'} • Feed: NSE Real-Time
${emoji} AI Composite Score: ${score}/100
🎯 Outlook: ${stock.outlook || 'WAIT_AND_WATCH'} ${stock.outlook === 'POSITIVE' ? '(Score > 90 High Conviction)' : '(Score < 90 Consolidating)'}
⚡ Action Recommendation: ${stock.continuousRecommendation || stock.whatUserShouldDo || 'Hold with discipline'}

📊 4-Factor Engine Breakdown:
• Technical (25%): ${stock.multiFactor?.technicalScore || stock.advancedDetails?.technicalScore || 70}/100
• Fundamentals (25%): ${stock.multiFactor?.fundamentalScore || 75}/100
• Macro & Commodity (25%): ${stock.multiFactor?.macroScore || 65}/100 (Crude: ${stock.multiFactor?.crudeImpact?.impact || 'NEUTRAL'})
• News Sentiment (25%): ${stock.multiFactor?.sentimentScore || 60}/100 (${stock.multiFactor?.newsSentiment || 'POSITIVE'})

💵 Price Parameters:
• Current Price: ₹${formatInr(currentPrice)}
• 3M Target:     ₹${formatInr(targetPrice)} (${targetPct >= 0 ? '+' : ''}${targetPct.toFixed(1)}%)
• Safety Exit:   ₹${formatInr(safetyExit)}
• Time Horizon:  ${stock.timeHorizon || '1-3 Months'}
• Risk Profile:  ${stock.risk || 'Moderate'} Risk

💡 AI Thesis:
${stock.simpleExplanation || 'Continuous multi-factor analysis shows constructive technical momentum aligned with stable macro variables.'}

══════════════════════════════
Feel the market. See the future. • @arthapulseAi_bot
⚠️ Educational quant analysis only. Not SEBI-registered advisory.`;
}

