
FROM node:20.19-alpine as builder

WORKDIR /app
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --network-timeout 600000

# Copy source
COPY . .

FROM node:20.19-alpine
WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port
EXPOSE 8080

# Start the application
CMD ["node", "body.js"]
