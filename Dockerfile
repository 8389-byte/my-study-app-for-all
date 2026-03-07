FROM node:20-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
# This copies everything in public, including the /portal/ folder
COPY ./public ./public 
COPY ./index.js ./index.js
USER node
EXPOSE 8080
CMD ["node", "index.js"]
