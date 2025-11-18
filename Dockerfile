# =========================
# Stage 1: Build
# =========================
FROM node:20-bookworm-slim AS build

WORKDIR /app

# Sólo deps primero para cachear bien
COPY package*.json ./
RUN npm ci

# Copiamos el resto del código
COPY . .

# Build del monorepo (api + etl-runner)
# Asegurate que este script en package.json construya ambas apps
# ejemplo:
# "build": "nest build api && nest build etl-runner"
RUN npm run build

# =========================
# Stage 2: Runtime
# =========================
FROM gcr.io/distroless/nodejs20-debian12

WORKDIR /app

# Copiamos sólo lo necesario desde el stage de build
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Por defecto, esta imagen arranca la API
# Para el etl-runner vamos a sobreescribir el comando desde docker-compose
CMD ["dist/apps/api/main.js"]
