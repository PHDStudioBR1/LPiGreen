# Dockerfile para LPiGreen (Next.js 15)
# Build standalone e servido via Node no cluster, roteado pelo Traefik Ingress

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Garante que public exista (Next.js não cria se o projeto não tiver a pasta)
RUN mkdir -p /app/public
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_PHDCRM_ENV=dev
ENV NEXT_PUBLIC_PHDCRM_ENV=$NEXT_PUBLIC_PHDCRM_ENV
RUN npm run build

# Estágio de produção - standalone
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Fallback: o file tracer do standalone às vezes omite o nodemailer.
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/nodemailer ./node_modules/nodemailer

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
