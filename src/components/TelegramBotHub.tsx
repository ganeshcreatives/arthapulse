import React, { useState, useEffect } from 'react';
import {
  Send,
  Bot,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Zap,
  TrendingUp,
  ShieldCheck,
  Terminal,
  History,
  Copy,
  Check,
  UserCheck,
} from 'lucide-react';
import { TradeSignal, BeginnerStockPrediction, TelegramAlertLog } from '../types.js';
import { SignalShortlist } from './SignalShortlist.js';
import { ArthaPulseLogo } from './ArthaPulseLogo.js';

interface TelegramBotHubProps {
  shortlist: TradeSignal[];
  predictions: BeginnerStockPrediction[];
  onSelectStock: (symbol: string) => void;
  onOpenTelegramModal: (signal: TradeSignal) => void;
  watchlistSymbols?: string[];
  onToggleWatchlist?: (symbol: string) => void;
}

export const TelegramBotHub: React.FC<TelegramBotHubProps> = ({
  shortlist,
  predictions,
  onSelectStock,
  onOpenTelegramModal,
  watchlistSymbols = [],
  onToggleWatchlist,
}) => {
  const [botInfo, setBotInfo] = useState<{
    username: string;
    firstName: string;
    link: string;
    activeSubscribers?: number;
    tokenMasked?: string;
  }>({
    username: 'arthapulseAi_bot',
    firstName: 'arthaPulse',
    link: 'https://t.me/arthapulseAi_bot',
    activeSubscribers: 1,
    tokenMasked: '89250631...EISE1k',
  });

  const [chatId, setChatId] = useState(() => localStorage.getItem('mp_tg_chat_id') || '7756782040');
  const [logs, setLogs] = useState<TelegramAlertLog[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [isSendingPred, setIsSendingPred] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    fetchBotInfo();
    fetchLogs();
  }, []);

  const fetchBotInfo = async () => {
    try {
      const res = await fetch('/api/alerts/telegram/bot-info');
      const data = await res.json();
      if (data.success && data.bot) {
        setBotInfo(data.bot);
      }
    } catch (e) {
      console.error('Failed to fetch bot info', e);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/alerts/telegram/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (e) {
      console.error('Failed to fetch logs', e);
    }
  };

  const handleSendTestPing = async () => {
    setIsTesting(true);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/alerts/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: chatId.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({
          type: 'success',
          text: `Test message successfully delivered to Telegram chat (${chatId}) via @${botInfo.username}!`,
        });
        fetchLogs();
      } else {
        setStatusMsg({
          type: 'error',
          text: data.message || 'Failed to dispatch test message. Verify bot has been started in Telegram.',
        });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Network error' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleDispatchPrediction = async (stock: BeginnerStockPrediction) => {
    setIsSendingPred(stock.symbol);
    setStatusMsg(null);
    try {
      const res = await fetch('/api/alerts/telegram/send-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: stock.symbol,
          prediction: stock,
          chatId: chatId.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg({
          type: 'success',
          text: `Continuous prediction for ${stock.symbol} dispatched to @${botInfo.username}!`,
        });
        fetchLogs();
      } else {
        setStatusMsg({
          type: 'error',
          text: data.message || 'Failed to send prediction alert',
        });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Network error' });
    } finally {
      setIsSendingPred(null);
    }
  };

  const copyBotLink = () => {
    navigator.clipboard.writeText('https://t.me/arthapulseAi_bot');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Bot Master Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-500 p-0.5 shadow-lg shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Bot className="w-7 h-7 text-sky-400" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-white tracking-tight">ArthaPulse AI Telegram Bot</h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-700/60 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE & VERIFIED
                </span>
                <span className="text-[11px] font-mono text-[#00D2FF] bg-sky-950/70 border border-sky-800/60 px-2.5 py-0.5 rounded-full font-bold">
                  @{botInfo.username}
                </span>
              </div>
              <p className="text-xs text-[#00D2FF] font-semibold mb-1">
                Feel the market. See the future.
              </p>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Direct automated broadcast channel for Indian equities (NSE/BSE). Stocks with AI composite score <strong className="text-emerald-400">&gt; 90/100</strong> trigger instant Positive Outlook alerts with 3-month price targets and disciplined safety exits.
              </p>

              {/* Bot Key Stats */}
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span>Linked User: <strong className="text-white">Ganesh Katla</strong> (<code className="text-sky-300 font-mono">{chatId}</code>)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Token: <code className="text-slate-300 font-mono">{botInfo.tokenMasked || '89250631...'}</code></span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap lg:flex-col sm:flex-row items-stretch gap-2.5 shrink-0">
            <a
              href="https://t.me/arthapulseAi_bot"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-sky-500/20 transition-all"
            >
              <span>Open in Telegram</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleSendTestPing}
              disabled={isTesting}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-colors disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-sky-400" />
              <span>{isTesting ? 'Sending Test...' : 'Send Live Test Ping'}</span>
            </button>

            <button
              onClick={copyBotLink}
              className="px-3 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-800 transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy t.me Link'}</span>
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {statusMsg && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2.5 animate-in slide-in-from-top-1 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-200'
                : 'bg-rose-950/80 border border-rose-800 text-rose-200'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="flex-1">{statusMsg.text}</span>
          </div>
        )}
      </div>

      {/* Two-Column Utility: Telegram Interactive Commands & 1-Click Prediction Dispatch */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1-col: Interactive Telegram Bot Commands */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Bot In-Chat Commands</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Message <span className="text-sky-400 font-mono">@arthapulseAi_bot</span> directly in Telegram using any of these commands for instant responses:
          </p>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-indigo-400 font-bold">
                <span>/start</span>
                <span className="text-[10px] text-slate-500 font-sans">Initialize</span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                Displays welcome guide and verifies your registered Telegram Chat ID.
              </p>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span>/signals</span>
                <span className="text-[10px] text-slate-500 font-sans">Quant Breakouts</span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                Sends latest high-probability swing and breakout setups with entries, targets, and stop losses.
              </p>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-sky-400 font-bold">
                <span>/predictions</span>
                <span className="text-[10px] text-slate-500 font-sans">Multi-Factor AI</span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                Replies with top continuous multi-factor stock scores, recommendations, and target horizons.
              </p>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-amber-400 font-bold">
                <span>/status</span>
                <span className="text-[10px] text-slate-500 font-sans">Health Check</span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                Returns live NSE data latency, macro indicators (Crude, Gold, USD/INR), and bot uptime.
              </p>
            </div>
          </div>

          <div className="p-3 bg-indigo-950/30 border border-indigo-900/50 rounded-xl text-[11px] text-indigo-300/90 leading-relaxed">
            💡 <strong>Pro Tip:</strong> You can add <code className="text-white font-mono">@arthapulseAi_bot</code> as an admin to your private investment Telegram channels or groups to broadcast alerts automatically.
          </div>
        </div>

        {/* Right 2-col: 1-Click Continuous AI Prediction Dispatch */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white">Continuous AI Stock Predictions • Instant Dispatch</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Receiver: <strong className="text-emerald-400">{chatId}</strong>
            </span>
          </div>

          <p className="text-xs text-slate-400">
            1-Click to push a comprehensive 4-factor breakdown (Technical, Fundamental, Macro, Sentiment) to <strong className="text-white">@arthapulseAi_bot</strong>:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {predictions.slice(0, 4).map((stock) => {
              const isSending = isSendingPred === stock.symbol;
              const composite = stock.multiFactor?.compositeScore || stock.accuracyConfidence || 75;
              const isBullish = stock.outlook === 'POSITIVE';

              return (
                <div
                  key={stock.symbol}
                  className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <span className="font-bold text-white font-mono text-sm">{stock.symbol}</span>
                        <span className="text-xs text-slate-400 ml-1.5">({stock.name})</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isBullish
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {composite}/100 • {stock.outlook}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 flex items-center justify-between py-1 border-y border-slate-800/60 my-2">
                      <span>CMP: ₹{stock.currentPrice.toLocaleString('en-IN')}</span>
                      <span className="text-emerald-400 font-semibold">
                        Target: ₹{stock.expectedTargetPrice.toLocaleString('en-IN')} (+{stock.expectedReturnPct.toFixed(1)}%)
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                      {stock.simpleExplanation}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDispatchPrediction(stock)}
                    disabled={isSending}
                    className="w-full py-2 bg-indigo-950 hover:bg-indigo-900 border border-indigo-700 text-indigo-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3 h-3 text-sky-400" />
                    <span>{isSending ? 'Sending to Telegram...' : 'Send Prediction to @arthapulseAi_bot'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Signal Shortlist for Trade Setup Dispatching */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Active Breakout Candidates • Telegram Trade Setup Alerts
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Click "Telegram" on any card to preview & dispatch complete parameters
          </span>
        </div>

        <SignalShortlist
          signals={shortlist}
          onSelectStock={onSelectStock}
          onOpenTelegramModal={onOpenTelegramModal}
          watchlistSymbols={watchlistSymbols}
          onToggleWatchlist={onToggleWatchlist}
        />
      </div>

      {/* Recent Alert Dispatch Logs Stream */}
      {logs.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Recent Telegram Dispatch Stream</h3>
            </div>
            <button
              onClick={fetchLogs}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 uppercase border-b border-slate-800 bg-slate-950/40">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Symbol</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Destination</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {logs.slice(0, 8).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30">
                    <td className="py-2 px-3 text-slate-400">
                      {new Date(log.sentAt).toLocaleTimeString()}
                    </td>
                    <td className="py-2 px-3 font-bold text-white">
                      {log.symbol}
                    </td>
                    <td className="py-2 px-3 text-slate-300">
                      {log.signalType}
                    </td>
                    <td className="py-2 px-3 text-sky-400">
                      {log.chatId || '@arthapulseAi_bot'}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          log.status === 'SENT'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : log.status === 'SIMULATED'
                            ? 'bg-sky-950 text-sky-400 border border-sky-800'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
