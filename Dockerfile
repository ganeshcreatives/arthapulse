# Production Dockerfile for ArthaPulse
FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm ci || npm install

# Copy source code
COPY . .

# Compile frontend and backend bundles
RUN npm run build

# Production runtime
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# Copy compiled assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
