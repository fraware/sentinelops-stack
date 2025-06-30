# ----- build stage ---------
FROM node:18-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci

#  copy sources
COPY frontend .

#  inject API url (defaults to same-host /graphql if not set)
ARG VITE_API_URL=/graphql
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build
