# ===== EuroKredit frontend (React + craco → static build served by nginx) =====

# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Same-origin API in production: nginx proxies /api → backend, so the app
# calls a relative "/api". Keep this empty unless the API is on another host.
ARG REACT_APP_BACKEND_URL=""
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

COPY package.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
