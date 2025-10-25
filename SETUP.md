# PomoBreak Setup Guide

Complete installation and setup instructions for developers.

---

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Installation Methods](#installation-methods)
3. [Environment Setup](#environment-setup)
4. [Development Setup](#development-setup)
5. [IDE Configuration](#ide-configuration)
6. [Common Setup Issues](#common-setup-issues)
7. [Verification Steps](#verification-steps)

---

## System Requirements

### Required

- **Node.js**: >= 17.0.0 (Recommended: 18.x or 20.x LTS)
- **npm**: >= 8.0.0 (comes with Node.js)
- **Git**: Latest version
- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)

### Recommended

- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: 500MB for dependencies
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Optional

- **pnpm**: Alternative package manager (see package manager section)
- **VS Code**: Recommended IDE with extensions

---

## Installation Methods

### Method 1: Clone from GitHub (Recommended)

```bash
# Clone the repository
git clone https://github.com/joshl26/pomodoro-app.git

# Navigate to project directory
cd pomodoro-app

# Install dependencies
npm install

# Start development server
npm start
```

### Method 2: Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork:

```bash
git clone https://github.com/YOUR_USERNAME/pomodoro-app.git
cd pomodoro-app
```

3. Add upstream remote:

```bash
git remote add upstream https://github.com/joshl26/pomodoro-app.git
```

4. Install and run:

```bash
npm install
npm start
```

### Method 3: Download ZIP

1. Download ZIP from GitHub
2. Extract to your desired location
3. Open terminal in extracted folder
4. Run:

```bash
npm install
npm start
```

---

## Environment Setup

### Node.js Installation

#### Windows

### Option A: Official Installer

1. Download from [nodejs.org](https://nodejs.org/)
2. Run installer (choose LTS version)
3. Verify installation:

```bash
node --version  # Should show v18.x.x or v20.x.x
npm --version   # Should show 8.x.x or higher
```

### Option B: Using nvm-windows

```bash
# Install nvm-windows from: https://github.com/coreybutler/nvm-windows/releases

# Install Node.js
nvm install 20
nvm use 20

# Verify
node --version
```

#### macOS

### Option A: Official Installer

- Download from [nodejs.org](https://nodejs.org/)

### Option B: Using Homebrew

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node@20

# Verify
node --version
npm --version
```

### Option C: Using nvm

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal, then:
nvm install 20
nvm use 20
nvm alias default 20
```

#### Linux (Ubuntu/Debian)

### Option A: Using NodeSource

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
```

### Option B: Using nvm

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell configuration
source ~/.bashrc  # or ~/.zshrc

# Install Node.js
nvm install 20
nvm use 20
nvm alias default 20
```

### Package Manager Setup

#### Using npm (Default)

```bash
# Update npm to latest version
npm install -g npm@latest

# Verify
npm --version
```

#### Using pnpm (Optional)

The project has `packageManager` field set to pnpm in some configurations.

### Option A: Install via npm

```bash
npm install -g pnpm

# Verify
pnpm --version
```

### Option B: Using Corepack (Node.js 16.10+)

```bash
# Enable Corepack
corepack enable

# Prepare specific pnpm version
corepack prepare pnpm@latest --activate

# Verify
pnpm --version
```

**If you prefer npm:**
Remove or update the `packageManager` field in `package.json`:

```json
{
  "packageManager": "npm@9.0.0"  // or remove this line entirely
}
```

---

## Development Setup

### 1. Clone and Install

```bash
# Clone repository
git clone https://github.com/joshl26/pomodoro-app.git
cd pomodoro-app

# Install dependencies (choose one)
npm install
# or
pnpm install
```

### 2. Verify Installation

```bash
# Check for node_modules directory
ls node_modules

# Verify package.json scripts
npm run  # Shows available scripts
```

### 3. Start Development Server

```bash
# Start dev server (opens browser automatically)
npm start

# Server runs on: http://localhost:3000
```

**Expected output:**

```
Compiled successfully!

You can now view pomodoro-app in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

### 4. Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage --watchAll=false

# Run in watch mode
npm run test:watch
```

### 5. Build for Production

```bash
# Create optimized build
npm run build

# Output will be in 'build/' directory
# Verify build size
ls -lh build/static/js/*.js
```

---

## IDE Configuration

### VS Code Setup (Recommended)

#### Required Extensions

Install from VS Code Extensions marketplace:

1. **ESLint** (`dbaeumer.vscode-eslint`)
   - Syntax: `ext install dbaeumer.vscode-eslint`

2. **Prettier** (`esbenp.prettier-vscode`)
   - Syntax: `ext install esbenp.prettier-vscode`

3. **ES7+ React/Redux/React-Native snippets** (`dsznajder.es7-react-js-snippets`)

#### Recommended Extensions

1. **GitLens** (`eamodio.gitlens`)
2. **Auto Rename Tag** (`formulahendry.auto-rename-tag`)
3. **Path Intellisense** (`christian-kohler.path-intellisense`)
4. **npm Intellisense** (`christian-kohler.npm-intellisense`)

#### VS Code Settings

Create `.vscode/settings.json` in project root:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact"
  ],
  "files.eol": "\n",
  "files.insertFinalNewline": true,
  "files.trimTrailingWhitespace": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

#### VS Code Snippets

Create `.vscode/react-snippets.code-snippets`:

```json
{
  "React Functional Component": {
    "prefix": "rfc",
    "body": [
      "import React from 'react';",
      "",
      "const ${1:ComponentName} = () => {",
      "  return (",
      "    <div>",
      "      ${2}",
      "    </div>",
      "  );",
      "};",
      "",
      "export default ${1:ComponentName};"
    ]
  },
  "useState Hook": {
    "prefix": "us",
    "body": [
      "const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initialValue});"
    ]
  },
  "useEffect Hook": {
    "prefix": "ue",
    "body": [
      "useEffect(() => {",
      "  ${1}",
      "}, [${2}]);"
    ]
  }
}
```

### WebStorm / IntelliJ IDEA

1. Enable ESLint: `Settings > Languages & Frameworks > JavaScript > Code Quality Tools > ESLint`
2. Enable Prettier: `Settings > Languages & Frameworks > JavaScript > Prettier`
3. Configure: Set Prettier as default formatter
4. Auto-format: Enable "On Save" actions

### Sublime Text

1. Install Package Control
2. Install packages:
   - SublimeLinter
   - SublimeLinter-eslint
   - JsPrettier

---

## Common Setup Issues

### Issue 1: `npm install` fails with permission errors (Linux/macOS)

**Symptom:**

```
EACCES: permission denied, mkdir '/usr/local/lib/node_modules'
```

**Solutions:**

**Option A: Fix npm permissions (Recommended)**

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'

# Add to ~/.bashrc or ~/.zshrc:
export PATH=~/.npm-global/bin:$PATH

# Reload shell
source ~/.bashrc
```

**Option B: Use nvm (Better)**

```bash
# Uninstall system Node.js
sudo apt remove nodejs npm  # Linux
brew uninstall node         # macOS

# Install via nvm (see Node.js Installation section)
```

**Option C: Use sudo (NOT recommended)**

```bash
sudo npm install  # Avoid this if possible
```

---

### Issue 2: Port 3000 already in use

**Symptom:**

```
Something is already running on port 3000.
```

**Solutions:**

**Option A: Kill existing process**

```bash
# Find process using port 3000
lsof -ti:3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process
kill -9 $(lsof -ti:3000)  # macOS/Linux
# On Windows: use Task Manager or taskkill /PID <PID> /F
```

**Option B: Use different port**

```bash
# Set PORT environment variable
PORT=3001 npm start

# Or add to .env file:
PORT=3001
```

---

### Issue 3: React version conflicts

**Symptom:**

```
Error: Invalid hook call. Hooks can only be called inside of the body of a function component.
```

**Solution:**

```bash
# Check for duplicate React versions
npm ls react

# If duplicates found, remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Ensure single React version in package.json
npm list react react-dom
```

---

### Issue 4: pnpm version mismatch

**Symptom:**

```
ERR_PNPM_UNSUPPORTED_ENGINE Unsupported environment
```

**Solutions:**

**Option A: Update pnpm**

```bash
corepack prepare pnpm@latest --activate
```

**Option B: Switch to npm**

```bash
# Remove pnpm-lock.yaml
rm pnpm-lock.yaml

# Install with npm
npm install
```

**Option C: Remove packageManager field**
Edit `package.json` and remove:

```json
"packageManager": "pnpm@x.x.x"
```

---

### Issue 5: ESLint errors on first run

**Symptom:**

```
Failed to compile.
ESLint: 'React' is not defined
```

**Solutions:**

**Option A: Add React import (if using JSX)**

```javascript
import React from 'react';
```

**Option B: Configure ESLint for React 17+ (JSX Transform)**
In `.eslintrc.json`:

```json
{
  "extends": ["react-app"],
  "rules": {
    "react/react-in-jsx-scope": "off"
  }
}
```

---

### Issue 6: Audio files not loading

**Symptom:**

```
GET http://localhost:3000/sounds/alarm.mp3 404 (Not Found)
```

**Solution:**

```bash
# Verify audio files exist
ls src/assets/sounds/

# Check file paths in code match actual files
# Audio files should be in src/assets/sounds/
# Import them correctly:
import alarmSound from './assets/sounds/alarm.mp3';
```

---

### Issue 7: Tests fail with "Cannot find module 'react'"

**Symptom:**

```
Cannot find module 'react' from 'src/components/Timer.jsx'
```

**Solution:**

```bash
# Clear Jest cache
npm test -- --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Verify test setup
npm test
```

---

## Verification Steps

After completing setup, verify everything works:

### 1. Check Node.js and npm

```bash
node --version
# Expected: v18.x.x or v20.x.x

npm --version
# Expected: 8.x.x or higher
```

### 2. Check Dependencies

```bash
npm list --depth=0
# Should show all dependencies without errors

# Verify key packages
npm list react react-dom react-redux redux
```

### 3. Check Development Server

```bash
npm start
# Should open browser to http://localhost:3000
# App should load without console errors
```

### 4. Check Tests

```bash
npm test -- --watchAll=false
# All tests should pass

npm test -- --coverage --watchAll=false
# Coverage should be >80%
```

### 5. Check Build

```bash
npm run build
# Should complete without errors

# Check build output
ls -lh build/static/js/main.*.js
# Main bundle should be ~87KB gzipped
```

### 6. Check Linting

```bash
npm run lint
# Should show no errors
# (Warnings are acceptable during development)
```

### 7. Verify Audio

1. Start dev server: `npm start`
2. Navigate to Settings
3. Select an alarm sound
4. Click "Preview" button
5. Verify sound plays

### 8. Verify Timer Functionality

1. Start dev server: `npm start`
2. Click "Start" button
3. Verify timer counts down
4. Click "Pause" and "Resume"
5. Test forward/backward buttons
6. Test mode transitions (Pomodoro → Break)

---

## Next Steps

After successful setup:

1. **Read Documentation**
   - `ARCHITECTURE.md` - System design
   - `API.md` - API reference
   - `CONTRIBUTING.md` - Contribution guidelines

2. **Explore Codebase**

   ```bash
   # Project structure
   tree -L 2 src/

   # Key files to review:
   # - src/components/Timer.jsx
   # - src/store/settingsSlice.js
   # - src/hooks/useAudioManager.js
   ```

3. **Run Examples**
   - Try modifying timer durations in Settings
   - Change alarm sounds
   - Experiment with auto-start options

4. **Development Workflow**

   ```bash
   # Create feature branch
   git checkout -b feature/my-feature

   # Make changes
   # Test changes: npm test
   # Lint: npm run lint
   # Format: npm run format

   # Commit and push
   git add .
   git commit -m "feat: add my feature"
   git push origin feature/my-feature
   ```

5. **Join Community**
   - Open an issue for questions
   - Check existing issues for contribution opportunities
   - Read ROADMAP.md for project priorities

---

## Troubleshooting Resources

### Official Documentation

- **React**: <https://react.dev/>
- **Redux Toolkit**: <https://redux-toolkit.js.org/>
- **React Router**: <https://reactrouter.com/>
- **Create React App**: <https://create-react-app.dev/>
- **Jest**: <https://jestjs.io/>
- **React Testing Library**: <https://testing-library.com/react>

### Community Help

- **GitHub Issues**: <https://github.com/joshl26/pomodoro-app/issues>
- **Stack Overflow**: Tag questions with `react`, `redux`, `pomodoro-timer`

### Common Commands Reference

```bash
# Development
npm start              # Start dev server
npm test               # Run tests in watch mode
npm run build          # Production build

# Testing
npm test -- --coverage                    # Run with coverage
npm test -- --watchAll=false             # Run once (CI mode)
npm test -- --testPathPattern=Timer      # Run specific test file

# Linting & Formatting
npm run lint                             # Run ESLint
npm run lint -- --fix                    # Auto-fix issues
npm run format                           # Run Prettier

# Dependencies
npm install                              # Install all dependencies
npm install <package>                    # Add new dependency
npm install -D <package>                 # Add dev dependency
npm update                               # Update dependencies
npm outdated                             # Check outdated packages

# Cleanup
rm -rf node_modules package-lock.json    # Remove dependencies
npm cache clean --force                  # Clear npm cache
```

---

## Advanced Setup

### Environment Variables

Create `.env` file in project root:

```bash
# Development server port
PORT=3000

# Enable source maps in production (debugging)
GENERATE_SOURCEMAP=false

# Disable automatic browser opening
BROWSER=none

# Custom public URL (for deployment)
PUBLIC_URL=/pomodor

# API endpoints (future use)
REACT_APP_API_URL=https://api.example.com
```

**Note:** Variables must start with `REACT_APP_` to be accessible in code:

```javascript
// Access in code
const apiUrl = process.env.REACT_APP_API_URL;
```

### Git Hooks with Husky

Setup pre-commit hooks to enforce code quality:

```bash
# Install Husky
npm install -D husky lint-staged

# Initialize Husky
npx husky-init

# Configure lint-staged in package.json
```

Add to `package.json`:

```json
{
  "lint-staged": {
    "src/**/*.{js,jsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ]
  }
}
```

Create `.husky/pre-commit`:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
npm test -- --watchAll=false --bail
```

### Docker Setup (Optional)

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npx", "serve", "-s", "build", "-l", "3000"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  pomobreak:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
```

Run with Docker:

```bash
# Build image
docker build -t pomobreak .

# Run container
docker run -p 3000:3000 pomobreak

# Or use docker-compose
docker-compose up
```

---

## Getting Help

If you encounter issues not covered in this guide:

1. **Check existing documentation**
   - README.md
   - ARCHITECTURE.md
   - TROUBLESHOOTING.md

2. **Search GitHub Issues**
   - Closed issues might have solutions
   - Open issues for known problems

3. **Create a new issue**
   - Use issue template
   - Include error messages
   - Provide system info (OS, Node version, npm version)
   - Share relevant code snippets

4. **Join discussions**
   - GitHub Discussions (if enabled)
   - Community forums

---

**Setup Complete!** 🎉

You're now ready to start developing with PomoBreak. Happy coding!

---

**Maintained by:** Joshua Lehman
**Last Updated:** 2025-10-25
**For issues:** <https://github.com/joshl26/pomodoro-app/issues>
