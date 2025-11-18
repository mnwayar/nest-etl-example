# Dockerfile
FROM gcr.io/distroless/nodejs20-debian12

WORKDIR /app

COPY dist ./dist
COPY node_modules ./node_modules
COPY package*.json ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["dist/apps/api/main.js"]
