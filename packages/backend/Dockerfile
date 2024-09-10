# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci -f

COPY . .
RUN npm run build

RUN npm ci -f --only=production && npm cache clean --force

# Final stage
FROM node:18-alpine as final

WORKDIR /app

ENV NODE_ENV production

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
