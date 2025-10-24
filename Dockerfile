# Use official Node.js 18 Alpine image for smaller size
FROM node:18-alpine

# Set working directory
WORKDIR /pomodoro-app

# Copy package files first for better caching
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy rest of the source code
COPY public ./public
COPY src ./src

# Build the React app for production
RUN npm run build

# Use a lightweight web server to serve the build output
FROM nginx:alpine

# Copy built files from previous stage
COPY --from=0 /pomodoro-app/build /usr/share/nginx/html

# Copy custom nginx config if needed (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 (default nginx port)
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]