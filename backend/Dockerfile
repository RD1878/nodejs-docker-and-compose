# ---------- Stage 1: build ----------
FROM node:16-alpine AS builder
WORKDIR /app

# тулчейны для bcrypt и т. п.
RUN apk add --no-cache python3 make g++

# ставим все зависимости, включая dev
COPY package*.json ./
RUN npm ci

# билдим
COPY . .
RUN npm run build

# убираем dev-зависимости
RUN npm prune --production

# ---------- Stage 2: runtime ----------
FROM node:16-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN npm i -g pm2@5

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./
COPY ecosystem.config.js ./

EXPOSE 4000
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
