# ArthaPulse — Feel the Market. See the Future.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Runtime](https://img.shields.io/badge/node-v20%2B-green.svg)](https://nodejs.org/)
[![Frontend](https://img.shields.io/badge/react-18-blue.svg)](https://react.dev/)
[![Styling](https://img.shields.io/badge/tailwind-v4-cyan.svg)](https://tailwindcss.com/)
[![Telegram](https://img.shields.io/badge/telegram-%40arthapulseAi__bot-blue.svg)](https://t.me/arthapulseAi_bot)
[![Cloud Run](https://img.shields.io/badge/deployed-Google%20Cloud%20Run-brightgreen.svg)](https://ais-pre-zrnhehxm2jd57apowgvxl3-233901165083.asia-east1.run.app)

> **ArthaPulse** is a full-stack Indian stock market intelligence, quantitative prediction engine, and IPO tracking platform. Built with a continuous 4-factor scoring model, automated Telegram bot alerts, and real-time market feeds.

---

## 🌐 Live Web Application URLs (Access from Anywhere)

You can open and use ArthaPulse right now from any computer, phone, or tablet anywhere in the world:

- 🚀 **Live Production / Public Web App**:  
  **[https://ais-pre-zrnhehxm2jd57apowgvxl3-233901165083.asia-east1.run.app](https://ais-pre-zrnhehxm2jd57apowgvxl3-233901165083.asia-east1.run.app)**

- 🛠️ **Live Development App**:  
  **[https://ais-dev-zrnhehxm2jd57apowgvxl3-233901165083.asia-east1.run.app](https://ais-dev-zrnhehxm2jd57apowgvxl3-233901165083.asia-east1.run.app)**

- 📱 **Official Telegram Alert Bot**:  
  **[@arthapulseAi_bot](https://t.me/arthapulseAi_bot)**

---

## 📚 Complete Project Documentation

This repository contains four dedicated, in-depth documentation guides:

1. **[ARCHITECTURE_AND_DEVOPS_SPEC.md](./ARCHITECTURE_AND_DEVOPS_SPEC.md)**  
   *For Architects, Engineers, DevOps, Security Officers, and Cost Analysts*:
   - System Topology & Component Interactions
   - 4-Factor Mathematical Prediction Formula & Scoring Mechanics
   - Directory Structure & TypeScript Schemas
   - Cloud Run Deployment & Docker Container Specifications
   - Secrets Management & Zero-Trust Security Policies
   - Detailed Cloud Cost Analysis ($1.50/mo to $145/mo TCO projections)

2. **[ARTHAPULSE_USER_GUIDE.md](./ARTHAPULSE_USER_GUIDE.md)**  
   *For Clients, Beginners, and Retail Investors*:
   - What is ArthaPulse & The Core Vision
   - The Rule: Why Score ≥ 90 = 🟢 Positive Outlook ("Invest / Accumulate")
   - Feature Walkthrough: Home Dashboard, Stock Predictions, Charts, Backtests, IPOs
   - 4 Practical Step-by-Step Workflows (5-min morning check, buying a stock, IPO evaluation, Telegram alerts)
   - Risk Management, Targets, and Safety Exit Rules
   - FAQ

3. **[SECRETS_AND_APIS.md](./SECRETS_AND_APIS.md)**  
   *Comprehensive Inventory of All Secrets, Environment Variables & APIs*:
   - `GEMINI_API_KEY`, `TELEGRAM_BOT_TOKEN`, `APP_URL`
   - External Data Feeds (Yahoo Finance, RSS, Chittorgarh GMP, NSE delivery)
   - Complete Internal REST API table (`/api/market-data`, `/api/stock-prediction`, `/api/ipos`, etc.)
   - Zero-trust client isolation rules

4. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**  
   *Step-by-Step Deployment Instructions Across All Environments*:
   - Google Cloud Run (Active live deployment)
   - Docker Container multi-stage build & run commands
   - GitHub Export & Push methods
   - Render & Railway deployment configurations
   - Self-hosted Ubuntu / Nginx / PM2 setup guide

---

## ⚡ Core Features

- **Continuous 4-Factor Quant Engine**: 25% Technicals (20 EMA, RSI, MACD, Volume) + 25% Fundamentals (PE, PB, Market Cap) + 25% Macro/Geopolitics (Crude, Gold, USD/INR, Capex) + 25% Institutional Sentiment (NSE Delivery, News Wire).
- **Rule-Based Conviction Tiers**:
  - `Score ≥ 90`: 🟢 **Positive Outlook** (High Conviction / Invest)
  - `Score 50 – 89`: 🟡 **Wait & Watch** (Consolidation)
  - `Score < 50`: 🔴 **Negative Outlook** (Avoid / Trim)
- **Live IPO & GMP Tracker**: Real-time Grey Market Premium in ₹ and %, subscription multiples (QIB, HNI, Retail), and allotment probability.
- **Interactive Technical Analysis**: 20 EMA, RSI, MACD histograms, interactive "what-if" parameter sliders.
- **Historical Backtesting**: 12-month backtested win-rates, profit factors, and trade logs.
- **Telegram Bot Integration**: Live automated alerts sent directly to Telegram via `@arthapulseAi_bot`.

---

## 🛠️ Quick Local Setup

```bash
# 1. Clone the repository
git clone <your-github-repo-url>
cd arthapulse

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Start local development server (Express + Vite on Port 3000)
npm run dev

# 5. Build for production
npm run build

# 6. Run production server
npm run start
```

---

## 🚀 GitHub Repository & Deployment Instructions

### Push to your GitHub Repository

```bash
# If not already initialized:
git init
git add .
git commit -m "feat: complete ArthaPulse 1.0 production release with multi-factor AI engine and Telegram bot"

# Connect your GitHub remote repository:
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git

# Push your code:
git push -u origin main
```

---

*Feel the market. See the future. — ArthaPulse*
