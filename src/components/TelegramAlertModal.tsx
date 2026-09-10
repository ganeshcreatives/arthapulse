import React, { useState, useEffect } from 'react';
import {
  Send,
  X,
  Copy,
  Check,
  Bot,
  Settings2,
  ShieldAlert,
  AlertCircle,
  History,
  CheckCircle2,
  ExternalLink,
  Radio,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { TradeSignal, TelegramAlertLog } from '../types.js';
import { formatTelegramSignalMessage } from '../utils/telegramFormatter.js';

interface TelegramAlertModalProps {
  signal: TradeSignal | null;
  isOpen: boolean;
  onClose: () => void;
}

const BOT_PRESETS = [
  {
    id: 'arthapulse',
    name: 'ArthaPulse AI (Official)',
    handle: '@arthapulseAi_bot',
    link: 'https://t.me/arthapulseAi_bot',
    token: '8925063141:AAEros-jd0ukLRJr0wKE8e419ogKMEISE1k',
    isDefault: true,
  },
  {
    id: 'mugdha',
    name: 'Mugdha Finance (Secondary)',
    handle: '@mugdha_fin_bot',
    link: 'https://t.me/mugdha_fin_bot',
    token: '8845014909:AAG7vwI-cQHcxEttsr2yFrdiY6CsF0M5zwE',
    isDefault: false,
  },
  {
    id: 'custom',
    name: 'Custom Bot (Your Own BotFather Token)',
    handle: 'Custom Bot Token',
    link: 'https://t.me/BotFather',
    token: '',
    isDefault: false,
  },
];

export const TelegramAlertModal: React.FC<TelegramAlertModalProps> = ({
  signal,
  isOpen,
  onClose,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<'arthapulse' | 'mugdha' | 'custom'>(() => {
    const saved = localStorage.getItem('mp_tg_preset');
    return (saved === 'mugdha' || saved === 'custom' || saved === 'arthapulse') ? saved : 'arthapulse';
  });

  const [botToken, setBotToken] = useState(() => {
    const saved = localStorage.getItem('mp_tg_token');
    return saved || '8925063141:AAEros-jd0ukLRJr0wKE8e419ogKMEISE1k';
  });

  const [chatId, setChatId] = useState(() => localStorage.getItem('mp_tg_chat_id') || '7756782040');
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedChats, setDetectedChats] = useState<Array<{ id: string; name: string }>>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [logs, setLogs] = useState<TelegramAlertLog[]>([]);
  const [activeTab, setActiveTab] = useState<'preview' | 'config' | 'logs'>('preview');

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen]);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/alerts/telegram/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  if (!isOpen || !signal) return null;

  const previewMessage = formatTelegramSignalMessage(signal);

  const handlePresetSelect = (presetId: 'arthapulse' | 'mugdha' | 'custom') => {
    setSelectedPreset(presetId);
    localStorage.setItem('mp_tg_preset', presetId);
    const preset = BOT_PRESETS.find((p) => p.id === presetId);
    if (preset && presetId !== 'custom') {
      setBotToken(preset.token);
      localStorage.setItem('mp_tg_token', preset.token);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(previewMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveConfig = () => {
    localStorage.setItem('mp_tg_preset', selectedPreset);
    localStorage.setItem('mp_tg_token', botToken.trim());
    localStorage.setItem('mp_tg_chat_id', chatId.trim());
    setStatusMessage({ type: 'success', text: 'Telegram bot credentials saved securely in browser storage.' });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleAutoDetectChatId = async () => {
    setIsDetecting(true);
    setStatusMessage(null);
    try {
      const res = await fetch(`/api/alerts/telegram/updates?token=${encodeURIComponent(botToken)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.chats) && data.chats.length > 0) {
        setDetectedChats(data.chats);
        const first = data.chats[0];
        setChatId(first.id);
        localStorage.setItem('mp_tg_chat_id', first.id);
        setStatusMessage({
          type: 'success',
          text: `Detected active chat: ${first.name} (Chat ID: ${first.id})`,
        });
      } else {
        setStatusMessage({
          type: 'info',
          text: 'No new messages detected yet. Open t.me/arthapulseAi_bot, press Start (/start), then click Auto-Detect again.',
        });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to query Telegram updates API.' });
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSendTestMessage = async () => {
    setIsTesting(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/alerts/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: chatId.trim() || undefined,
          botToken: botToken.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({
          type: 'success',
          text: data.message || 'Test message received in your Telegram app!',
        });
        fetchLogs();
      } else {
        setStatusMessage({
          type: 'error',
          text: data.message || 'Failed to dispatch test message. Verify Chat ID and start the bot first.',
        });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Network error' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSend = async () => {
    setIsSending(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/alerts/telegram/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: signal.symbol,
          botToken: botToken.trim() || undefined,
          chatId: chatId.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({
          type: 'success',
          text: data.status === 'SENT' ? data.message : 'Simulated alert recorded in history.',
        });
        fetchLogs();
      } else {
        setStatusMessage({
          type: 'error',
          text: data.message || 'Failed to dispatch Telegram message',
        });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Network error' });
    } finally {
      setIsSending(false);
    }
  };

  const currentPresetObj = BOT_PRESETS.find((p) => p.id === selectedPreset) || BOT_PRESETS[0];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-sky-500/20 border border-indigo-500/40 flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Telegram Signal Dispatch Center</span>
                <span className="text-[10px] bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 font-mono px-2 py-0.5 rounded-full">
                  {signal.symbol}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Connected to <span className="text-sky-300 font-medium">@arthapulseAi_bot</span> • Automated Multi-Factor Trade Alert
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-800 bg-slate-950/30 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('preview')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Alert Message Preview
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'config'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            Bot Setup & Channels
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Dispatch History ({logs.length})
          </button>
        </div>

        {/* Status Toast Message */}
        {statusMessage && (
          <div
            className={`mx-5 mt-3 p-3 rounded-xl text-xs flex items-center gap-2.5 animate-in slide-in-from-top-1 duration-150 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/80 border border-emerald-800/80 text-emerald-300'
                : statusMessage.type === 'info'
                ? 'bg-sky-950/80 border border-sky-800/80 text-sky-300'
                : 'bg-rose-950/80 border border-rose-800/80 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : statusMessage.type === 'info' ? (
              <Bot className="w-4 h-4 shrink-0 text-sky-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span className="flex-1">{statusMessage.text}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'preview' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-indigo-400" />
                  Telegram Bot Broadcast Format:
                </span>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>
              </div>

              {/* Telegram Preview Terminal */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-indigo-500/30 shadow-inner">
                {previewMessage}
              </div>

              {/* Bot Info Banner */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-slate-300">Target Bot: <strong className="text-sky-400 font-mono">@arthapulseAi_bot</strong></span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">Recipient: <strong className="text-emerald-400 font-mono">{chatId}</strong></span>
                </div>
                <a
                  href="https://t.me/arthapulseAi_bot"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1"
                >
                  <span>Open Bot</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div className="space-y-4 text-xs">
              {/* Bot Selector Cards */}
              <div>
                <label className="block text-slate-300 font-bold mb-2">Select Active Bot:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {BOT_PRESETS.filter((p) => p.id !== 'custom').map((preset) => {
                    const isSelected = selectedPreset === preset.id;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => handlePresetSelect(preset.id as any)}
                        className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-indigo-950/40 border-indigo-500/80 shadow-md ring-1 ring-indigo-500/30'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                            {preset.name}
                          </span>
                          {preset.isDefault && (
                            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-mono font-bold">
                              PRIMARY
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-sky-400 font-mono">{preset.handle}</span>
                          <a
                            href={preset.link}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-indigo-400 hover:underline flex items-center gap-1"
                          >
                            <span>Open</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bot Token Config */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-slate-300 font-bold">Bot Token (HTTP API):</label>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {selectedPreset === 'arthapulse' ? '⚡ @arthapulseAi_bot Active' : 'Active Token'}
                    </span>
                  </div>
                  <input
                    type="password"
                    value={botToken}
                    onChange={(e) => {
                      setBotToken(e.target.value);
                      setSelectedPreset('custom');
                    }}
                    placeholder="e.g., 8925063141:AAEros..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Official Token: <code className="text-slate-300 font-mono">8925063141:AAEros-jd0ukLRJr0wKE8e419ogKMEISE1k</code>
                  </p>
                </div>

                {/* Target Chat ID */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-slate-300 font-bold">Destination Chat / User ID:</label>
                    <button
                      onClick={handleAutoDetectChatId}
                      disabled={isDetecting}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 ${isDetecting ? 'animate-spin' : ''}`} />
                      <span>{isDetecting ? 'Scanning...' : 'Auto-Detect Chat ID'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={chatId}
                    onChange={(e) => setChatId(e.target.value)}
                    placeholder="e.g. 7756782040"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Direct Subscriber ID: <code className="text-sky-400 font-mono">{chatId || '7756782040'}</code>. To link a new chat, tap <a href="https://t.me/arthapulseAi_bot" target="_blank" rel="noreferrer" className="text-indigo-400 underline">t.me/arthapulseAi_bot</a>, send <code className="text-slate-200 font-mono">/start</code>, and click <strong>Auto-Detect</strong>.
                  </p>
                </div>

                {/* Test & Save buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <button
                    onClick={handleSendTestMessage}
                    disabled={isTesting}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3 h-3 text-sky-400" />
                    <span>{isTesting ? 'Sending Test...' : 'Send Test Ping'}</span>
                  </button>

                  <button
                    onClick={handleSaveConfig}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors shadow-sm"
                  >
                    Save Configuration
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-3 text-xs">
              {logs.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <History className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p>No alerts dispatched yet in this session.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white font-mono">{log.symbol}</span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              log.status === 'SENT'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : log.status === 'SIMULATED'
                                ? 'bg-sky-950 text-sky-400 border border-sky-800'
                                : 'bg-rose-950 text-rose-400 border border-rose-800'
                            }`}
                          >
                            {log.status}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {new Date(log.sentAt).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="text-right text-[11px] text-slate-400 font-mono">
                        Target: {log.chatId || '@arthapulseAi_bot'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSend}
              disabled={isSending}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 hover:from-indigo-500 hover:to-sky-400 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md hover:shadow-indigo-500/25"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Dispatching to Telegram...' : 'Dispatch Live Alert to @arthapulseAi_bot'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
