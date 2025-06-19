# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy all necessary files
COPY . .

# Install dependencies
RUN npm install

# Build the api-gateway app
RUN npx nx build api-gateway


# Expose the port your app uses (default: 3000)
EXPOSE 3000

# Run the compiled app
CMD ["node", "dist/apps/api-gateway/main.js"]
