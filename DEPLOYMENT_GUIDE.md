# ArthaPulse — Complete Deployment Guide

> **Platform Version**: 1.0.0 Production  
> **Supported Environments**: Google Cloud Run, Docker, Vercel, Render, AWS App Runner / ECS, and Self-Hosted Linux (Ubuntu/Debian)

---

## Table of Contents
1. [Overview & Prerequisites](#1-overview--prerequisites)
2. [Deployment Method 1: Google Cloud Run (Active / Recommended)](#2-deployment-method-1-google-cloud-run-active--recommended)
3. [Deployment Method 2: Docker Container (Universal)](#3-deployment-method-2-docker-container-universal)
4. [Deployment Method 3: GitHub Push & Export](#4-deployment-method-3-github-push--export)
5. [Deployment Method 4: Render / Railway](#5-deployment-method-4-render--railway)
6. [Deployment Method 5: Self-Hosted VPS (Ubuntu/Nginx/PM2)](#6-deployment-method-5-self-hosted-vps-ubuntunginxpm2)
7. [Post-Deployment Verification & Health Checks](#7-post-deployment-verification--health-checks)

---

## 1. Overview & Prerequisites

ArthaPulse is a full-stack Node.js + React application. The production build combines:
1. **Frontend**: Vite compiles React TypeScript code into high-performance static files in `/dist`.
2. **Backend**: `esbuild` bundles `server.ts` into a single standalone CommonJS file: `dist/server.cjs`.
3. **Ingress**: Express serves static assets and `/api/*` endpoints on `PORT 3000` (`0.0.0.0:3000`).

### Required Runtime Secrets
- `GEMINI_API_KEY`: Google Gemini API key for AI sentiment analysis.
- `TELEGRAM_BOT_TOKEN`: Telegram bot token from [@BotFather](https://t.me/botfather) for `@arthapulseAi_bot`.
- `PORT`: Set to `3000`.

---

## 2. Deployment Method 1: Google Cloud Run (Active / Recommended)

Your app is **already deployed and live** on Google Cloud Run:
- 🚀 **Live Production URL**: `https://ais-pre-zrnhehxm2jd57apowgvxl3-233901165083.asia-east1.run.app`

### Steps to Deploy Revisions from Google AI Studio:
1. Whenever you modify your code, the build runs automatically.
2. Click the **Share / Deploy** button in the top navigation bar of Google AI Studio.
3. Choose **"Deploy to Cloud Run"**. Cloud Run will package the container and deploy a zero-downtime revision with automatic scale-to-zero enabled.

### Steps to Deploy via `gcloud` CLI:
```bash
# 1. Authenticate with Google Cloud
gcloud auth login
gcloud config set project YOUR_GCP_PROJECT_ID

# 2. Build and deploy directly to Cloud Run
gcloud run deploy arthapulse \
  --source . \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars GEMINI_API_KEY="YOUR_GEMINI_KEY",TELEGRAM_BOT_TOKEN="YOUR_BOT_TOKEN"
```

---

## 3. Deployment Method 2: Docker Container (Universal)

Use this method to run ArthaPulse anywhere (AWS, DigitalOcean, Hetzner, GCP).

### Multi-Stage Dockerfile:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
EXPOSE 3000
USER node
CMD ["node", "dist/server.cjs"]
```

### Build & Run Commands:
```bash
# 1. Build the Docker image
docker build -t arthapulse:latest .

# 2. Run the container locally or on a server
docker run -d \
  -p 3000:3000 \
  -e GEMINI_API_KEY="your_api_key" \
  -e TELEGRAM_BOT_TOKEN="your_telegram_token" \
  --name arthapulse-app \
  arthapulse:latest
```

---

## 4. Deployment Method 3: GitHub Push & Export

### Option A: 1-Click Export from Google AI Studio (Fastest)
1. In the top-right header of Google AI Studio, click the **Settings / Menu** icon.
2. Click **Export to GitHub**.
3. Select your repository: `ganeshcreatives/arthapulse`. All source files, assets, and documentation will be pushed directly.

### Option B: Push via Git Terminal using GitHub Classic Token
1. Go to **[github.com/settings/tokens/new](https://github.com/settings/tokens/new)**.
2. Select **Tokens (classic)**, check **`repo`**, and click **Generate token**.
3. Run the following command in terminal:
```bash
git remote set-url origin https://<YOUR_CLASSIC_TOKEN>@github.com/ganeshcreatives/arthapulse.git
git push -u origin main
```

---

## 5. Deployment Method 4: Render / Railway

### Deploying on Render:
1. Connect your GitHub repository (`ganeshcreatives/arthapulse`).
2. Select **Web Service**.
3. Configure settings:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Free / Starter
4. Add Environment Variables:
   - `GEMINI_API_KEY`
   - `TELEGRAM_BOT_TOKEN`
   - `PORT`: `3000`
5. Click **Deploy Web Service**.

---

## 6. Deployment Method 5: Self-Hosted VPS (Ubuntu / PM2 / Nginx)

```bash
# 1. Clone repository
git clone https://github.com/ganeshcreatives/arthapulse.git /var/www/arthapulse
cd /var/www/arthapulse

# 2. Install dependencies & build
npm install
npm run build

# 3. Create .env file with secrets
cat <<EOF > .env
GEMINI_API_KEY=your_key_here
TELEGRAM_BOT_TOKEN=your_token_here
PORT=3000
NODE_ENV=production
EOF

# 4. Start with PM2 Process Manager
npm install -g pm2
pm2 start dist/server.cjs --name "arthapulse"
pm2 save
pm2 startup

# 5. Configure Nginx Reverse Proxy (/etc/nginx/sites-available/arthapulse)
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 7. Post-Deployment Verification & Health Checks

Once deployed to any environment, run these checks:

1. **Server Health Probe**:
   ```bash
   curl -I https://YOUR_APP_URL/api/health
   # Expected response: HTTP/1.1 200 OK
   ```

2. **Market Data Feed**:
   ```bash
   curl https://YOUR_APP_URL/api/market-data
   # Expected: JSON object with NIFTY, SENSEX, CRUDE, GOLD quotes
   ```

3. **Telegram Bot Connectivity**:
   - Open Telegram and search for `@arthapulseAi_bot`.
   - Send `/start` to verify interactive responses.
   - Use the web app's **Telegram Bot Hub** to trigger a test dispatch.
