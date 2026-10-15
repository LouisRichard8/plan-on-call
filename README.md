# Plan On Call

## Set Up

### Create Vue project

```bash
docker run --rm -it -v ${PWD}/app:/app -w /app node:24.22.0-alpine npm create vue@latest .
```

### Install dependencies

```bash
docker run --rm -it -v ${PWD}/app:/app -w /app node:24.22.0-alpine npm install .
```

### Install new package

```bash
docker run --rm -it -v ${PWD}/app:/app -w /app node:24.22.0-alpine npm install {package}
```

### Create Docker files

Add at the root `compose.yaml`

```yaml
services:
  vuejs-prod:
    build:
      context: .
      dockerfile: app/Dockerfile
    ports:
      - "8080:8080"

  vuejs-dev:
    build:
      context: .
      dockerfile: app/Dockerfile.dev
    ports:
      - "5173:5173"
    develop:
      watch:
        - path: ./app/src
          target: /app/src
          action: sync
        - path: ./app/package.json
          target: /app/package.json
          action: restart
        - path: ./app/vite.config.js
          target: /app/vite.config.js
          action: restart
```

And `.dockerignore`

```dockerignore
# -------------------------------
# Dependency directories
# -------------------------------
**/node_modules/

# -------------------------------
# Production and build outputs
# -------------------------------
**/dist/
**/out/
**/build/
**/public/build/

# -------------------------------
# Vite, VuePress, and cache dirs
# -------------------------------
**/.vite/
**/.vitepress/
**/.cache/
**/.tmp/

# -------------------------------
# Test output and coverage
# -------------------------------
**/coverage/
**/reports/
**/jest/
**/cypress/
**/cypress/screenshots/
**/cypress/videos/

# -------------------------------
# Environment and config files
# -------------------------------
**/*.env*
**/!.env.production    # Keep production env if needed
**/*.local
**/*.log

# -------------------------------
# TypeScript artifacts
# -------------------------------
**/*.tsbuildinfo

# -------------------------------
# Editor and IDE config
# -------------------------------
**/.vscode/

# -------------------------------
# System files
# -------------------------------
**/.DS_Store
**/Thumbs.db

# -------------------------------
# Git files
# -------------------------------
**/.git/
**/.gitignore
**/.gitattributes

# -------------------------------
# Docker-related files
# -------------------------------
**/Dockerfile
**/.dockerignore
**/docker-compose.yml
**/docker-compose.override.yml
```

Add in `app/` those 3 files (from docker documentation) :

* `Dockerfile`

```dockerfile
# =========================================
# Stage 1: Build the Vue.js Application
# =========================================
ARG NODE_VERSION=24.22.0-alpine
ARG NGINX_VERSION=alpine3.22

# Use a lightweight Node.js image for building (customizable via ARG)
FROM node:${NODE_VERSION} AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY app/package.json app/package-lock.json* ./

# Install project dependencies using npm ci (ensures a clean, reproducible install)
RUN --mount=type=cache,target=/root/.npm npm ci

# Copy the rest of the application source code into the container
COPY /app .

# Build the Vue.js application
RUN npm run build

# =========================================
# Stage 2: Prepare Nginx to Serve Static Files
# =========================================

FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS runner

# Copy custom Nginx config
COPY app/nginx.conf /etc/nginx/nginx.conf

# Copy the static build output from the build stage to Nginx's default HTML serving directory
COPY --chown=nginx:nginx --from=builder /app/dist /usr/share/nginx/html

# Use a built-in non-root user for security best practices
USER nginx

# Expose port 8080 to allow HTTP traffic
# Note: The default Nginx container now listens on port 8080 instead of 80
EXPOSE 8080

# Start Nginx directly with custom config
ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
CMD ["-g", "daemon off;"]
```

* `Dockerfile.dev`

```dockerfile
# =========================================
# Stage 1: Develop the Vue.js Application
# =========================================
ARG NODE_VERSION=24.22.0-alpine

# Use a lightweight Node.js image for development
FROM node:${NODE_VERSION} AS dev

# Set environment variable to indicate development mode
ENV NODE_ENV=development

# Set the working directory inside the container
WORKDIR /app

# Copy package-related files first to leverage Docker's caching mechanism
COPY app/package.json app/package-lock.json* ./

# Install project dependencies
RUN --mount=type=cache,target=/root/.npm npm install

# Copy the rest of the application source code into the container
COPY /app .

# Change ownership of the application directory to the node user
RUN chown -R node:node /app

# Switch to the node user
USER node

# Expose the port used by the Vite development server
EXPOSE 5173

# Use a default command, can be overridden in Docker compose.yml file
CMD [ "npm", "run", "dev", "--", "--host" ]
```

* `nginx.conf`

```conf
worker_processes auto;
pid /tmp/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    charset       utf-8;

    access_log    off;
    error_log     /dev/stderr warn;

    sendfile        on;
    tcp_nopush      on;
    tcp_nodelay     on;
    keepalive_timeout  65;
    keepalive_requests 1000;

    gzip on;
    gzip_comp_level 6;
    gzip_proxied any;
    gzip_min_length 256;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;

    server {
        listen       8080;
        server_name  localhost;

        root   /usr/share/nginx/html;
        index  index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|eot|ttf|svg|map)$ {
            expires 1y;
            access_log off;
            add_header Cache-Control "public, immutable";
            add_header X-Content-Type-Options nosniff;
        }

        location /assets/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            add_header X-Content-Type-Options nosniff;
        }

        error_page 404 /index.html;
    }
}
```

## Run app

### Run container

#### **Prod mode**

```bash
docker compose up -d --build vuejs-prod
```

#### **Dev mode**

```bash
docker compose watch vuejs-dev
```

### Stop

```bash
docker compose down
```
