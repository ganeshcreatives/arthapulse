import React, { useState, useEffect } from 'react';
import { Navbar, NavTabType } from './components/Navbar.js';
import { ComplianceDisclaimer } from './components/ComplianceDisclaimer.js';
import { HomeSimpleDashboard } from './components/HomeSimpleDashboard.js';
import { StockPredictionDashboard } from './components/StockPredictionDashboard.js';
import { BeginnerGlossaryModal } from './components/BeginnerGlossaryModal.js';
import { Top10Picks } from './components/Top10Picks.js';
import { MarketOverview } from './components/MarketOverview.js';
import { MarketTrends } from './components/MarketTrends.js';
import { SignalShortlist } from './components/SignalShortlist.js';
import { StockDetail } from './components/StockDetail.js';
import { Watchlist } from './components/Watchlist.js';
import { MutualFundsExplorer } from './components/MutualFundsExplorer.js';
import { IpoTracker } from './components/IpoTracker.js';
import { MacroGeopoliticsMonitor } from './components/MacroGeopoliticsMonitor.js';
import { BacktestDashboard } from './components/BacktestDashboard.js';
import { TelegramAlertModal } from './components/TelegramAlertModal.js';
import { TelegramBotHub } from './components/TelegramBotHub.js';
import { ArthaPulseLogo } from './components/ArthaPulseLogo.js';
import { MarketOverviewData, TradeSignal, BeginnerStockPrediction, IpoItem, MutualFundItem } from './types.js';
import { RefreshCw, TrendingUp, ShieldAlert, Cpu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabType>('home');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('RELIANCE');
  const [marketOverview, setMarketOverview] = useState<MarketOverviewData | null>(null);
  const [shortlist, setShortlist] = useState<TradeSignal[]>([]);
  const [beginnerPredictions, setBeginnerPredictions] = useState<BeginnerStockPrediction[]>([]);
  const [ipos, setIpos] = useState<IpoItem[]>([]);
  const [mutualFunds, setMutualFunds] = useState<MutualFundItem[]>([]);
  const [marketDirection, setMarketDirection] = useState<'UPWARD' | 'UNCLEAR' | 'DOWNWARD'>('UPWARD');
  const [marketSummary, setMarketSummary] = useState<string>('');
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>(['RELIANCE', 'TCS', 'HDFCBANK', 'TATAMOTORS', 'SBIN']);
  const [isLoading, setIsLoading] = useState(true);

  // Glossary modal
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);

  // Telegram modal state
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [telegramSignal, setTelegramSignal] = useState<TradeSignal | null>(null);

  // Initial data loading
  useEffect(() => {
    async function initData() {
      setIsLoading(true);
      try {
        const [overviewRes, shortlistRes, beginnerRes, ipoRes, mfRes] = await Promise.all([
          fetch('/api/market/overview'),
          fetch('/api/market/shortlist'),
          fetch('/api/predictions/beginner'),
          fetch('/api/ipos'),
          fetch('/api/mutual-funds'),
        ]);

        if (overviewRes.ok) {
          const oData = await overviewRes.json();
          setMarketOverview(oData);
        }

        if (shortlistRes.ok) {
          const sData = await shortlistRes.json();
          setShortlist(sData);
        }

        if (beginnerRes.ok) {
          const bData = await beginnerRes.json();
          setBeginnerPredictions(bData.predictions || []);
          if (bData.marketDirection) setMarketDirection(bData.marketDirection);
          if (bData.marketSummary) setMarketSummary(bData.marketSummary);
        }

        if (ipoRes.ok) {
          const iData = await ipoRes.json();
          setIpos(iData.ipos || []);
        }

        if (mfRes.ok) {
          const mData = await mfRes.json();
          setMutualFunds(Array.isArray(mData) ? mData : mData.funds || []);
        }
      } catch (err) {
        console.error('Failed to initialize ArthaPulse data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    initData();
  }, []);

  const handleSelectStock = (symbol: string) => {
    setSelectedSymbol(symbol);
    setActiveTab('stock');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTelegramModal = (signal: TradeSignal) => {
    setTelegramSignal(signal);
    setIsTelegramModalOpen(true);
  };

  const handleToggleWatchlist = (symbol: string) => {
    setWatchlistSymbols((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  const handleAddToWatchlist = (symbol: string) => {
    if (!watchlistSymbols.includes(symbol)) {
      setWatchlistSymbols((prev) => [...prev, symbol]);
    }
  };

  const handleRemoveFromWatchlist = (symbol: string) => {
    setWatchlistSymbols((prev) => prev.filter((s) => s !== symbol));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Compliance Notice Banner */}
      <ComplianceDisclaimer />

      {/* Navigation & Market Ticker Bar */}
      <Navbar
        indices={marketOverview?.indices || []}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectStock={handleSelectStock}
        watchlistCount={watchlistSymbols.length}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isLoading && !marketOverview ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center shadow-xl">
            <RefreshCw className="w-10 h-10 text-indigo-400 animate-spin mx-auto mb-4" />
            <h2 className="text-lg font-bold text-white">Initializing ArthaPulse AI...</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1.5">
              Analyzing real-time market movements, Indian IPO lifecycles, and translating technical indicators into simple everyday words.
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeSimpleDashboard
                predictions={beginnerPredictions}
                ipos={ipos}
                mutualFunds={mutualFunds}
                marketOverview={marketOverview}
                marketDirection={marketDirection}
                marketSummary={marketSummary}
                onSelectStock={handleSelectStock}
                onNavigateTab={(tab) => setActiveTab(tab as NavTabType)}
                onNavigate={(tab) => setActiveTab(tab as NavTabType)}
                onOpenGlossary={() => setIsGlossaryOpen(true)}
              />
            )}

            {activeTab === 'predictions' && (
              <StockPredictionDashboard
                predictions={beginnerPredictions}
                onSelectStock={handleSelectStock}
                onOpenGlossary={() => setIsGlossaryOpen(true)}
              />
            )}

            {activeTab === 'ipos' && (
              <IpoTracker />
            )}

            {activeTab === 'top10' && (
              <Top10Picks
                onSelectStock={handleSelectStock}
                onOpenTelegramModal={handleOpenTelegramModal}
              />
            )}

            {activeTab === 'macro' && (
              <MacroGeopoliticsMonitor />
            )}

            {activeTab === 'mutualfunds' && (
              <MutualFundsExplorer />
            )}

            {activeTab === 'backtest' && (
              <BacktestDashboard />
            )}

            {activeTab === 'overview' && marketOverview && (
              <MarketOverview
                data={marketOverview}
                shortlist={shortlist}
                onSelectStock={handleSelectStock}
                onViewAllSignals={() => setActiveTab('shortlist')}
                onViewTrends={() => setActiveTab('trends')}
              />
            )}

            {activeTab === 'trends' && (
              <MarketTrends
                onSelectStock={handleSelectStock}
                onViewSignals={() => setActiveTab('shortlist')}
              />
            )}

            {activeTab === 'shortlist' && (
              <SignalShortlist
                signals={shortlist}
                onSelectStock={handleSelectStock}
                onOpenTelegramModal={handleOpenTelegramModal}
                watchlistSymbols={watchlistSymbols}
                onToggleWatchlist={handleToggleWatchlist}
              />
            )}

            {activeTab === 'stock' && (
              <StockDetail
                symbol={selectedSymbol}
                onBack={() => setActiveTab('predictions')}
                onOpenTelegramModal={handleOpenTelegramModal}
                watchlistSymbols={watchlistSymbols}
                onToggleWatchlist={handleToggleWatchlist}
              />
            )}

            {activeTab === 'watchlist' && (
              <Watchlist
                onSelectStock={handleSelectStock}
                onOpenTelegramModal={handleOpenTelegramModal}
                onRemoveFromWatchlist={handleRemoveFromWatchlist}
                onAddToWatchlist={handleAddToWatchlist}
                allStockSymbols={marketOverview?.topGainers.map((g) => g.symbol) || []}
              />
            )}

            {activeTab === 'telegram' && (
              <TelegramBotHub
                shortlist={shortlist}
                predictions={beginnerPredictions}
                onSelectStock={handleSelectStock}
                onOpenTelegramModal={handleOpenTelegramModal}
                watchlistSymbols={watchlistSymbols}
                onToggleWatchlist={handleToggleWatchlist}
              />
            )}
          </>
        )}
      </main>

      {/* Beginner Glossary Modal */}
      <BeginnerGlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

      {/* Telegram Alert Modal */}
      <TelegramAlertModal
        signal={telegramSignal}
        isOpen={isTelegramModalOpen}
        onClose={() => setIsTelegramModalOpen(false)}
      />

      {/* Global Footer */}
      <footer className="bg-slate-900/80 border-t border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ArthaPulseLogo variant="compact" showSlogan={true} />
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono">
            <span>Delayed 15m (NSE/BSE)</span>
            <span>•</span>
            <span>Educational &amp; Research Use Only</span>
            <span>•</span>
            <span>Probabilities, Not Guarantees</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
