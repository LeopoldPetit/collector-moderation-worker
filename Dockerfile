FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN apk upgrade --no-cache
COPY package*.json ./
RUN npm ci --omit=dev \
 && npm cache clean --force \
 && rm -rf /root/.npm /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack \
    /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack
COPY --from=build /app/dist ./dist
USER node
CMD ["node", "dist/main.js"]
