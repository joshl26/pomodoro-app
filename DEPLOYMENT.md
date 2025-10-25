# PomoBreak Deployment Guide

Complete guide for deploying PomoBreak to various hosting platforms.

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Build Optimization](#build-optimization)
3. [Deployment Platforms](#deployment-platforms)
   - [GitHub Pages](#github-pages)
   - [Netlify](#netlify)
   - [Vercel](#vercel)
   - [AWS S3 + CloudFront](#aws-s3--cloudfront)
   - [Docker](#docker)
4. [Environment Configuration](#environment-configuration)
5. [Post-Deployment](#post-deployment)
6. [Rollback Procedures](#rollback-procedures)
7. [Monitoring & Analytics](#monitoring--analytics)

---

## Pre-Deployment Checklist

Before deploying, ensure:

- [ ] All tests pass: `npm test -- --watchAll=false --coverage`
- [ ] No linting errors: `npm run lint`
- [ ] Code formatted: `npm run format`
- [ ] Build succeeds: `npm run build`
- [ ] Bundle size checked: `< 250KB gzipped` (current: ~87KB)
- [ ] No console errors/warnings in production build
- [ ] Environment variables configured
- [ ] `.env.production` file created (if needed)
- [ ] Audio files optimized
- [ ] Images optimized
- [ ] Favicon configured
- [ ] Meta tags updated (SEO)
- [ ] Analytics configured (optional)
- [ ] Error tracking configured (optional)

---

## Build Optimization

### 1. Production Build

```bash
# Create optimized production build
npm run build

# Output directory: build/
```

### 2. Analyze Bundle

```bash
# Install analyzer
npm install --save-dev webpack-bundle-analyzer

# Add to package.json scripts:
"analyze": "source-map-explorer 'build/static/js/*.js'"

# Run analysis
npm run analyze
```

### 3. Optimize Build

**Check build size:**
```bash
ls -lh build/static/js/*.js
ls -lh build/static/css/*.css

# Verify gzipped size
gzip -c build/static/js/main.*.js | wc -c
```

**Expected output:**
```
main.[hash].js:      ~250KB (uncompressed)
main.[hash].js.gz:   ~87KB (gzipped) ✅
```

### 4. Environment Variables for Production

Create `.env.production`:

```bash
# Public URL (adjust for your domain/path)
PUBLIC_URL=https://yourdomain.com/pomodor

# Disable source maps (security)
GENERATE_SOURCEMAP=false

# API endpoints
REACT_APP_API_URL=https://api.yourdomain.com

# Analytics (optional)
REACT_APP_GA_ID=G-XXXXXXXXXX
```

---

## Deployment Platforms

### GitHub Pages

**Current deployment:** https://joshlehman.ca/pomodor

#### Method 1: Using gh-pages Package (Automated)

**Setup:**

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# Add homepage to package.json:
"homepage": "https://yourusername.github.io/pomodoro-app"
```

**Deploy:**

```bash
npm run deploy
```

**Configure GitHub:**
1. Go to repository Settings → Pages
2. Source: `gh-pages` branch
3. Folder: `/ (root)`
4. Save

#### Method 2: Manual Deployment

```bash
# Build project
npm run build

# Initialize gh-pages branch (first time only)
git checkout --orphan gh-pages
git rm -rf .
cp -r build/* .
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# Return to main branch
git checkout main
```

#### Method 3: GitHub Actions (CI/CD)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --watchAll=false --coverage

      - name: Build
        run: npm run build
        env:
          PUBLIC_URL: /pomodoro-app

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
          cname: yourdomain.com  # Optional: custom domain
```

**Enable GitHub Actions:**
1. Commit `.github/workflows/deploy.yml`
2. Push to GitHub
3. Go to Actions tab to monitor deployment
4. Configure Pages source to `gh-pages` branch

---

### Netlify

**Deployment URL:** https://pomobreak.netlify.app (example)

#### Method 1: Drag & Drop (Quick)

1. Build project locally: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Sign in with GitHub
4. Drag `build/` folder to deploy area
5. Site is live!

#### Method 2: GitHub Integration (Recommended)

**Setup:**

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "New site from Git"
3. Choose GitHub → Select repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
   - **Base directory:** (leave empty)

5. Add environment variables (if needed):
   - `PUBLIC_URL`: `/`
   - `GENERATE_SOURCEMAP`: `false`

6. Click "Deploy site"

**Configure netlify.toml:**

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "build"

[build.environment]
  NODE_VERSION = "20"
  NPM_VERSION = "9"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Content-Type = "application/javascript; charset=utf-8"

[[headers]]
  for = "/*.css"
  [headers.values]
    Content-Type = "text/css; charset=utf-8"
```

**Custom Domain:**
1. Go to Site settings → Domain management
2. Add custom domain
3. Configure DNS with your provider:
   ```
   Type: CNAME
   Name: www
   Value: yoursite.netlify.app
   ```

#### Method 3: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize site
netlify init

# Deploy manually
netlify deploy --prod

# Or with build
netlify build && netlify deploy --prod
```

---

### Vercel

**Deployment URL:** https://pomobreak.vercel.app (example)

#### Method 1: Vercel CLI (Quick)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (follow prompts)
vercel

# Deploy to production
vercel --prod
```

#### Method 2: GitHub Integration (Recommended)

**Setup:**

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import repository
5. Configure:
   - **Framework Preset:** Create React App
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

6. Add environment variables (if needed)
7. Click "Deploy"

**Configure vercel.json:**

Create `vercel.json` in project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      },
      "dest": "/static/$1"
    },
    {
      "src": "/asset-manifest.json",
      "headers": {
        "cache-control": "public, max-age=0, must-revalidate"
      },
      "dest": "/asset-manifest.json"
    },
    {
      "src": "/(.*)",
      "headers": {
        "cache-control": "public, max-age=0, must-revalidate"
      },
      "dest": "/index.html"
    }
  ],
  "env": {
    "PUBLIC_URL": "/"
  }
}
```

**Custom Domain:**
1. Go to Project → Settings → Domains
2. Add custom domain
3. Configure DNS as instructed

---

### AWS S3 + CloudFront

Professional production deployment with CDN.

#### Step 1: Build Project

```bash
npm run build
```

#### Step 2: Create S3 Bucket

```bash
# Install AWS CLI
brew install awscli  # macOS
# or download from: https://aws.amazon.com/cli/

# Configure AWS CLI
aws configure
# Enter: Access Key ID, Secret Access Key, Region

# Create bucket
aws s3 mb s3://pomobreak-app --region us-east-1

# Enable static website hosting
aws s3 website s3://pomobreak-app \
  --index-document index.html \
  --error-document index.html
```

#### Step 3: Upload Build

```bash
# Upload build to S3
aws s3 sync build/ s3://pomobreak-app \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html" \
  --exclude "asset-manifest.json"

# Upload index.html without caching
aws s3 cp build/index.html s3://pomobreak-app/index.html \
  --cache-control "public, max-age=0, must-revalidate"
```

#### Step 4: Configure Bucket Policy

Create `bucket-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::pomobreak-app/*"
    }
  ]
}
```

Apply policy:
```bash
aws s3api put-bucket-policy \
  --bucket pomobreak-app \
  --policy file://bucket-policy.json
```

#### Step 5: Create CloudFront Distribution

```bash
# Create distribution (via AWS Console or CLI)
aws cloudfront create-distribution \
  --origin-domain-name pomobreak-app.s3.amazonaws.com \
  --default-root-object index.html
```

**CloudFront Settings:**
- **Origin Domain:** `pomobreak-app.s3.amazonaws.com`
- **Viewer Protocol Policy:** Redirect HTTP to HTTPS
- **Compress Objects:** Yes
- **Price Class:** Use All Edge Locations
- **Alternate Domain Names:** `app.yourdomain.com` (optional)
- **SSL Certificate:** Request via ACM (optional)

#### Step 6: Configure Error Pages

In CloudFront distribution settings:
- **404 Error:** `/index.html` (status: 200)
- **403 Error:** `/index.html` (status: 200)

This enables React Router to handle all routes.

#### Step 7: Invalidate Cache on Deploy

```bash
# Create invalidation (after each deploy)
aws cloudfront create-invalidation \
  --distribution-id E1234EXAMPLE \
  --paths "/*"
```

**Automated Deploy Script (`deploy.sh`):**

```bash
#!/bin/bash

# Build project
echo "Building project..."
npm run build

# Upload to S3
echo "Uploading to S3..."
aws s3 sync build/ s3://pomobreak-app --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html"

aws s3 cp build/index.html s3://pomobreak-app/index.html \
  --cache-control "public, max-age=0, must-revalidate"

# Invalidate CloudFront
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id E1234EXAMPLE \
  --paths "/*"

echo "Deployment complete!"
```

Make executable:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

### Docker

Deploy as containerized application.

#### Dockerfile

Create `Dockerfile`:

```dockerfile
# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # React Router support
    location / {
        try_files $uri /index.html;
    }

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

#### Build and Run

```bash
# Build image
docker build -t pomobreak:latest .

# Run container
docker run -d -p 8080:80 pomobreak:latest

# Access at: http://localhost:8080
```

#### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  pomobreak:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

Run:
```bash
docker-compose up -d
```

#### Push to Docker Hub

```bash
# Tag image
docker tag pomobreak:latest yourusername/pomobreak:latest

# Login to Docker Hub
docker login

# Push image
docker push yourusername/pomobreak:latest
```

---

## Environment Configuration

### Development

`.env.development`:
```bash
PORT=3000
BROWSER=chrome
GENERATE_SOURCEMAP=true
REACT_APP_ENV=development
```

### Production

`.env.production`:
```bash
PUBLIC_URL=/pomodor
GENERATE_SOURCEMAP=false
REACT_APP_ENV=production
REACT_APP_API_URL=https://api.example.com
```

### Access in Code

```javascript
// Check environment
if (process.env.NODE_ENV === 'production') {
  // Production-only code
}

// Access custom variables
const apiUrl = process.env.REACT_APP_API_URL;
```

---

## Post-Deployment

### 1. Smoke Tests

```bash
# Test critical paths
- [ ] Homepage loads
- [ ] Timer starts and counts down
- [ ] Settings page works
- [ ] Audio plays correctly
- [ ] Navigation works
- [ ] No console errors
```

### 2. Performance Audit

```bash
# Run Lighthouse
npm install -g lighthouse

lighthouse https://yourdomain.com --view
```

**Target Scores:**
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

### 3. Browser Testing

Test on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

### 4. Monitoring Setup

```javascript
// Add error tracking (Sentry example)
import * as Sentry from "@sentry/react";

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.REACT_APP_ENV
  });
}
```

---

## Rollback Procedures

### GitHub Pages

```bash
# Revert to previous version
git checkout gh-pages
git reset --hard HEAD~1
git push -f origin gh-pages
```

### Netlify/Vercel

1. Go to Deployments
2. Find previous successful deploy
3. Click "Publish deploy"

### AWS S3

```bash
# Enable versioning (first time)
aws s3api put-bucket-versioning \
  --bucket pomobreak-app \
  --versioning-configuration Status=Enabled

# List versions
aws s3api list-object-versions --bucket pomobreak-app

# Restore previous version
aws s3api copy-object \
  --bucket pomobreak-app \
  --copy-source pomobreak-app/index.html?versionId=VERSION_ID \
  --key index.html
```

---

## Monitoring & Analytics

### Google Analytics

```javascript
// src/index.js
import ReactGA from 'react-ga4';

if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize(process.env.REACT_APP_GA_ID);
  ReactGA.send("pageview");
}
```

### Performance Monitoring

```javascript
// src/reportWebVitals.js
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
```

---

**Deployment Complete!** 🚀

Your PomoBreak app is now live and accessible to users.

---

**Maintained by:** Joshua Lehman
**Last Updated:** 2025-10-25