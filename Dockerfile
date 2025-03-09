# multi-stage build

# use LTS latest version
FROM node:lts AS build

WORKDIR /app
COPY package.json package-lock.json ./

# install only dependencies
RUN npm ci

COPY . .

RUN npx prisma generate
# マイグレーションをビルド時には実行しない
# RUN npx prisma migrate deploy

RUN npm run build

FROM node:lts AS production

WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY .env .env

# Cloud Run用の環境変数設定
ENV PORT=8080
EXPOSE 8080

WORKDIR /app/dist
CMD ["node", "main.js"]