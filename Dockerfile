FROM node:18-alpine

WORKDIR /pomodoro-app

# Copy package files for caching
COPY package.json package-lock.json* ./

# Copy CRACO config file (adjust if named differently)
COPY craco.config.js ./

# Install dependencies
RUN npm ci

# Copy source and public folders
COPY public ./public
COPY src ./src

# Build the React app
RUN npm run build

# Expose port 3051 (or your app's port)
EXPOSE 3051

# Start the app (assuming craco start or your start script)
CMD ["npm", "start"]