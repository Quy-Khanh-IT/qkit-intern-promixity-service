# # Build stage
# FROM node:18-alpine as build

# WORKDIR /app

# COPY package*.json ./
# RUN npm ci -f

# COPY . .
# RUN npm run build

# RUN npm ci -f --only=production && npm cache clean --force

# # Final stage
# FROM node:18-alpine as final

# WORKDIR /app

# ENV NODE_ENV production

# COPY --from=build /app/dist ./dist
# COPY --from=build /app/node_modules ./node_modules
# COPY --from=build /app/package.json ./package.json

# EXPOSE 8080

# CMD ["npm", "run", "start:prod"]

# Use a lighter version of Node as a base
FROM node:20.11.1-alpine3.19 AS base
EXPOSE 8080
# Build
FROM node:20.11.1-alpine3.19 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci -f
COPY . .
RUN npm run build
RUN npm ci -f --only=production && npm cache clean --force
# Final stage from base
FROM base AS final
WORKDIR /app
ENV NODE_ENV production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
# COPY --from=build /app/.env .env
CMD ["npm", "run", "start:prod"]