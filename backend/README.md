version: "3.9"

services:
backend:
build: ./backend # path to sentinelops repo
container_name: sentinel_backend
environment: - CORS_ORIGIN=http://localhost:5173
ports: - "8080:8080" # hostPort:containerPort

frontend:
build: ./frontend # path to sentinelops-console-umbra repo
container_name: sentinel_frontend
depends_on: - backend
environment: - VITE_API_URL=http://backend:8080/graphql - VITE_EXPORT_URL=http://backend:8080/export
ports: - "5173:80" # React served by nginx
