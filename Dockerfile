# Etapa 1: Build
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN apk update && apk add --no-cache build-base
RUN npm install --legacy-peer-deps
RUN npm install -g typescript
COPY . .
RUN make build

# Etapa 2: Produção
FROM node:20-alpine as production
WORKDIR /app
COPY --from=builder /app/package*.json /app/
RUN npm ci --only=production
COPY --from=builder /app/dist /app/dist
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "start"]
