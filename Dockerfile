# Dockerfile

FROM node:20-alpine

# Create app directory

WORKDIR /usr/src/app

# Install app dependencies

COPY package*.json ./

COPY nx.json ./

COPY tsconfig.base.json ./

# Install only the workspace dependencies

RUN npm install

# Copy source code

COPY . .

# Build only the current service

ARG SERVICE

RUN npm run build:$SERVICE

# Start the service

CMD ["node", "dist/apps/$SERVICE/main.js"]

