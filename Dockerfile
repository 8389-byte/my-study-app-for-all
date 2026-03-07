# Use Node 20 for the best 2026 performance
FROM node:20-bookworm-slim

# Set the working directory
WORKDIR /app

# Set to production to make it faster
ENV NODE_ENV=production

# Copy package files first (This makes building faster)
COPY package*.json ./

# Install only the necessary tools
RUN npm ci --omit=dev && npm cache clean --force

# Copy your root index.js and the public folder
COPY index.js ./
COPY public/ ./public/

# Fix permissions so the 'node' user can actually run the app
RUN chown -R node:node /app

# Switch to the non-root user for security (Railway prefers this)
USER node

# Port 8080 is the standard "Remote" port, but Railway will override this
EXPOSE 8080

# Start the server
CMD ["node", "index.js"]
