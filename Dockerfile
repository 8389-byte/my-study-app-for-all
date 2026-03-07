FROM node:20-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY ./public ./public
COPY ./index.js ./index.js

USER node
EXPOSE 8080
CMD ["node", "index.js"]
