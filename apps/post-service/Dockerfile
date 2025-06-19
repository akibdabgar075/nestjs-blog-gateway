# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy all necessary files
COPY . .

# Install dependencies
RUN npm install

# Build the api-gateway app

RUN npx nx run build post-service

# Expose the port your app uses (default: 3000)
EXPOSE 3001

# Run the compiled app
CMD ["node", "dist/apps/post-service/main.js"]
