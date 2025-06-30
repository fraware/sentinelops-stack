# ---------- build stage ----------
FROM node:22-bookworm AS build
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable && pnpm i --frozen-lockfile

COPY . .
RUN pnpm build          # produces /app/dist

# ---------- runtime stage ----------
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]
