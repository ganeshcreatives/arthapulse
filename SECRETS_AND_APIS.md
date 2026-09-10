# ArthaPulse — Secrets, Environment Variables & APIs Reference

> **Document Version**: 1.0.0  
> **Security Level**: Confidential / Production Reference  
> **Purpose**: Complete inventory of all secret keys, environment variables, external data feeds, and internal backend REST APIs used in ArthaPulse.

---

## Table of Contents
1. [Environment Variables & Secrets](#1-environment-variables--secrets)
2. [External Third-Party APIs & Data Feeds](#2-external-third-party-apis--data-feeds)
3. [Internal Backend REST APIs (`/api/*`)](#3-internal-backend-rest-apis-api)
4. [Security & Isolation Rules](#4-security--isolation-rules)

---

## 1. Environment Variables & Secrets

| Variable Name | Required? | Default / Example Value | Description | Where It Is Used | Security Risk |
| :--- | :---: | :--- | :--- | :--- | :---: |
| **`GEMINI_API_KEY`** | **Yes** *(for AI Features)* | `AIzaSy...` | Google Gemini API key used for institutional news sentiment extraction, summarization, and AI commentary. | `server/services/geminiAi.ts`, `server.ts` | **Critical** (Server-side ONLY. Never expose to client). |
| **`TELEGRAM_BOT_TOKEN`** | **Yes** *(for Bot Alerts)* | `8845014909:AAG7vwI-cQHcxEttsr2yFrdiY6CsF0M5zwE` | Official Telegram Bot Token issued by [@BotFather](https://t.me/botfather) for `@arthapulseAi_bot`. Controls live alert broadcasts. | `server/services/telegramService.ts`, `server.ts` | **High** (Server-side ONLY. Allows sending messages via bot). |
| **`APP_URL`** | Optional | `https://ais-pre-zrnhehxm2jd57apowgvxl3-233901165083.asia-east1.run.app` | Canonical public URL where the web app is hosted. Used for webhooks, self-referential links, and OAuth callbacks. | `server.ts`, `.env.example` | Low |
| **`PORT`** | Optional | `3000` | Ingress port for the Express web server and Vite middleware. | `server.ts` | Low |
| **`NODE_ENV`** | Optional | `production` / `development` | Dictates whether Vite runs in dev middleware mode or serves pre-bundled production static assets. | `server.ts`, `package.json` | Low |

---

## 2. External Third-Party APIs & Data Feeds

| Service / Provider | Purpose | Authentication | Rate Limits / Quotas | Fallback Mechanism |
| :--- | :--- | :--- | :--- | :--- |
| **Google Gemini API** (`@google/genai`) | Analyzes financial headlines, detects tone (Bullish/Bearish), and generates natural language market commentary. | API Key (`GEMINI_API_KEY`) | 15–60 RPM (depending on tier) | If exhausted or key omitted, system uses deterministic algorithmic scoring engine. |
| **Telegram Bot API** (`api.telegram.org`) | Sends instant alert notifications for high-conviction breakout setups (Score ≥ 90) and IPO GMP changes to `@arthapulseAi_bot`. | Bot Token (`TELEGRAM_BOT_TOKEN`) | 30 messages/sec broadcast limit | In-app alerts modal and browser notification preview. |
| **Yahoo Finance Query API** | Fetches live market quotes, historical closing prices, 20 EMA, RSI, and MACD technical indicators. | None (Public HTTP) | Dynamic throttling (~2000 req/hour) | Uses pre-cached closing prices and rolling EMA calculations. |
| **Google News RSS Feed** | Ingests real-time Indian financial news headlines for NSE/BSE tickers. | None (Public RSS/XML) | Standard HTTP caching | Static baseline news cache. |
| **NSE Delivery & Chittorgarh Scraper** | Fetches institutional delivery volumes and Mainboard/SME Grey Market Premium (GMP) data. | None (HTML/JSON scrapers) | Cached for 15 minutes | In-memory IPO database with daily manual refresh defaults. |

---

## 3. Internal Backend REST APIs (`/api/*`)

All internal endpoints are hosted under port 3000 by `server.ts`:

### 3.1 Market Data & Predictions

| Endpoint | HTTP Method | Parameters | Description |
| :--- | :---: | :--- | :--- |
| `/api/health` | `GET` | None | Healthcheck endpoint returning uptime, active cache status, and server timestamp. |
| `/api/market-data` | `GET` | None | Returns real-time quotes for Nifty 50, Bank Nifty, Brent Crude, Gold, and USD/INR. |
| `/api/stocks` | `GET` | `sector`, `filter` | Returns full list of analyzed NSE/BSE stocks with current 4-factor scores and outlooks. |
| `/api/stock-prediction/:symbol` | `GET` | `:symbol` (e.g. `TATAMOTORS`) | Computes real-time 4-factor quantitative score (0–100), targets, and safety exits. |
| `/api/backtest` | `GET` | `symbol`, `period` | Runs a 12-month backtest simulation returning win rate %, profit factor, and trade logs. |

### 3.2 IPO & Mutual Funds

| Endpoint | HTTP Method | Parameters | Description |
| :--- | :---: | :--- | :--- |
| `/api/ipos` | `GET` | `type=mainboard\|sme` | Returns active and upcoming IPOs, live GMP (₹ and %), dates, and subscription status. |
| `/api/mutual-funds` | `GET` | `category` | Curated defensive index and flexi-cap mutual funds for systematic monthly allocation. |

### 3.3 Telegram Alert Engine

| Endpoint | HTTP Method | Payload / Parameters | Description |
| :--- | :---: | :--- | :--- |
| `/api/telegram/status` | `GET` | None | Checks if `TELEGRAM_BOT_TOKEN` is configured and verifies bot connectivity. |
| `/api/telegram/test-alert` | `POST` | `{ "chatId": "...", "stockSymbol": "HAL" }` | Dispatches a formatted test alert message to the user's Telegram chat. |
| `/api/telegram/webhook` | `POST` | Telegram update object | Receives incoming bot commands (`/start`, `/stocks`, `/ipo`, `/alerts`). |

---

## 4. Security & Isolation Rules

1. **Zero Secret Leakage**:
   - `GEMINI_API_KEY` and `TELEGRAM_BOT_TOKEN` are accessed strictly in backend Node.js (`server.ts`).
   - The React client bundle (`/src`) contains zero API keys or secrets.
2. **Environment File Guard**:
   - `.gitignore` explicitly prevents `.env`, `.env.local`, and any secret files from being committed to Git.
   - Only `.env.example` (with dummy placeholders) is committed.
3. **Input Sanitization**:
   - Stock symbols in API paths are validated against regex `/^[A-Z0-9_.-]+$/i` to prevent path traversal or injection attacks.
