FROM node:20-alpine AS build

WORKDIR /app

COPY package.json .
RUN npm install

COPY index.html .
COPY src ./src

# Accept EC2 IP (or any API URL) at build time
ARG VITE_API_URL
RUN echo "VITE_API_URL=${VITE_API_URL}" > .env

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
