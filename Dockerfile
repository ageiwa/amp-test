FROM node:24-slim
WORKDIR /app
COPY . .
RUN npm install && npm run build
ENTRYPOINT [ "node", "/app/dist/main.js" ]