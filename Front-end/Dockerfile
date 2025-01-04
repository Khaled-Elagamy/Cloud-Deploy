# Use a Node.js base image
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy `pnpm-lock.yaml` and `package.json` first for efficient caching
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of the app's code
COPY . .

# Build the React app
RUN pnpm run build

# Use a lightweight web server for the final build
FROM nginx:alpine

# Copy the built React app from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
