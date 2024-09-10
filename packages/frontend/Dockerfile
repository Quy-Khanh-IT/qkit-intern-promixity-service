# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Prepare Production Artifacts
FROM node:18-alpine AS production

WORKDIR /app

COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/package*.json /app/

# Install only production dependencies
RUN npm install --only=production

# Stage 3: Run
FROM gcr.io/distroless/nodejs18

WORKDIR /app

COPY --from=production /app/.next /app/.next
COPY --from=production /app/public /app/public
COPY --from=production /app/node_modules /app/node_modules
COPY --from=production /app/package*.json /app/

EXPOSE 3000

CMD ["node_modules/.bin/next", "start"]
