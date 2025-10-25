# PomoBreak Troubleshooting Guide

Solutions to common issues and errors.

---

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Development Server Issues](#development-server-issues)
3. [Build Issues](#build-issues)
4. [Testing Issues](#testing-issues)
5. [Audio Issues](#audio-issues)
6. [Redux/State Issues](#reduxstate-issues)
7. [Routing Issues](#routing-issues)
8. [Performance Issues](#performance-issues)
9. [Deployment Issues](#deployment-issues)
10. [Browser-Specific Issues](#browser-specific-issues)

---

## Installation Issues

### Error: `npm ERR! code EACCES`

**Problem:** Permission denied when installing packages globally

**Solution:**

```bash
# Option 1: Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Option 2: Use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

---

### Error: `npm ERR! peer dep missing`

**Problem:** Peer dependency conflicts

**Solution:**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Or use --legacy-peer-deps
npm install --legacy-peer-deps
```

---

### Error: `gyp ERR! stack Error: Python not found`

**Problem:** Node-gyp requires Python for native modules

**Solution:**

**Windows:**

```bash
# Install build tools
npm install --global --production windows-build-tools

# Or install Python 3.x from python.org
```

**macOS:**

```bash
# Install Xcode Command Line Tools
xcode-select --install
```

**Linux:**

```bash
# Install build essentials
sudo apt-get install build-essential python3
```

---

### Error: `npm WARN deprecated package@version`

**Problem:** Using deprecated packages

**Solution:**

```bash
# Update to latest versions
npm update

# Check for outdated packages
npm outdated

# Update specific package
npm install package@latest
```

---

## Development Server Issues

### Error: `Port 3000 is already in use`

**Problem:** Another process is using port 3000

**Solution:**

**macOS/Linux:**

```bash
# Find process ID
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)

# Or use different port
PORT=3001 npm start
```

**Windows:**

```bash
# Find process
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or use different port
set PORT=3001 && npm start
```

---

### Error: `Cannot find module 'react'`

**Problem:** Dependencies not installed or corrupted

**Solution:**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Verify React installation
npm list react react-dom
```

---

### Error: `Module not found: Can't resolve './Component'`

**Problem:** Incorrect import path or file doesn't exist

**Solution:**

```javascript
// Check file extension
import Timer from './components/Timer';  // ❌
import Timer from './components/Timer.jsx';  // ✅

// Check relative path
import Timer from '../components/Timer';  // Verify ../ vs ./

// Check case sensitivity
import timer from './Timer';  // ❌
import Timer from './Timer';  // ✅
```

---

### Error: `SyntaxError: Unexpected token`

**Problem:** Using modern syntax without proper Babel config

**Solution:**

```bash
# Ensure .babelrc or babel.config.js exists
# CRA handles this automatically

# Clear babel cache
rm -rf node_modules/.cache
npm start
```

---

## Build Issues

### Error: `JavaScript heap out of memory`

**Problem:** Build process runs out of memory

**Solution:**

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Or add to package.json scripts
"build": "NODE_OPTIONS=--max-old-space-size=4096 react-scripts build"
```

---

### Error: `GENERATE_SOURCEMAP=false not working`

**Problem:** Source maps still generated in production

**Solution:**

```bash
# Create .env.production
echo "GENERATE_SOURCEMAP=false" > .env.production

# Or use cross-env
npm install --save-dev cross-env

# Update package.json
"build": "cross-env GENERATE_SOURCEMAP=false react-scripts build"
```

---

### Error: `Module parse failed: Unexpected token`

**Problem:** Importing files without proper loader

**Solution:**

```javascript
// For images
import logo from './logo.png';  // ✅

// For SVG as React component
import { ReactComponent as Logo } from './logo.svg';  // ✅

// For audio files
import alarmSound from './alarm.mp3';  // ✅
```

---

### Warning: `Asset size limit (244 KiB) exceeded`

**Problem:** Bundle size too large

**Solution:**

```bash
# Analyze bundle
npm install --save-dev webpack-bundle-analyzer
npm run build
npx webpack-bundle-analyzer build/static/js/*.js

# Reduce size:
# 1. Use code splitting (lazy loading)
# 2. Remove unused dependencies
# 3. Compress images
# 4. Tree-shake unused code
```

---

## Testing Issues

### Error: `Invalid hook call`

**Problem:** React version conflict or incorrect test setup

**Solution:**

```bash
# Check for duplicate React
npm ls react

# If duplicates found, reinstall
rm -rf node_modules package-lock.json
npm install

# Ensure test uses proper wrapper
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

render(
  <Provider store={store}>
    <Component />
  </Provider>
);
```

---

### Error: `ReferenceError: React is not defined`

**Problem:** Missing React import in test files

**Solution:**

```javascript
// Add to test file
import React from 'react';

// Or configure Jest to auto-import
// jest.config.js
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js']
};

// src/setupTests.js
import React from 'react';
global.React = React;
```

---

### Error: `Cannot find module '@testing-library/react'`

**Problem:** Testing library not installed

**Solution:**

```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Verify installation
npm list @testing-library/react
```

---

### Error: `TypeError: Cannot read property 'dispatch' of undefined`

**Problem:** Mock Redux store not properly configured in tests

**Solution:**

```javascript
import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './store/settingsSlice';

const createMockStore = (initialState) => {
  return configureStore({
    reducer: {
      settings: settingsReducer
    },
    preloadedState: initialState
  });
};

// Use in test
const store = createMockStore({ settings: { pomoDuration: 25 } });

render(
  <Provider store={store}>
    <Timer />
  </Provider>
);
```

---

### Error: `Jest did not exit one second after test run`

**Problem:** Open handles preventing Jest from closing

**Solution:**

```javascript
// Add cleanup in tests
afterEach(() => {
  jest.clearAllTimers();
  jest.clearAllMocks();
  cleanup();
});

// Or run with --forceExit
npm test -- --forceExit
```

---

## Audio Issues

### Error: `Uncaught (in promise) DOMException: play() failed`

**Problem:** Browser autoplay policy blocking audio

**Solution:**

```javascript
// Wrap play() in try-catch
const playAudio = async (audioElement) => {
  try {
    await audioElement.play();
  } catch (error) {
    console.debug('Audio play blocked by browser:', error);
    // Show user message to enable audio
  }
};

// Require user interaction first
const handleUserClick = async () => {
  await audioElement.play();
  // Audio now unlocked for page
};
```

---

### Error: `Audio file not found (404)`

**Problem:** Incorrect audio file path

**Solution:**

```javascript
// Correct import
import alarmSound from '../assets/sounds/alarm.mp3';

// Use imported path
const audioUrl = alarmSound;  // ✅

// Not hardcoded path
const audioUrl = '/sounds/alarm.mp3';  // ❌ (might fail in production)

// Verify file exists
ls src/assets/sounds/alarm.mp3
```

---

### Issue: Audio plays multiple times (overlapping)

**Problem:** Multiple audio instances created

**Solution:**

```javascript
// Use singleton audio service
const audioService = AudioService.getInstance();

// Stop before playing
audioService.stop('alarm');
audioService.play('alarm');

// Or use useAudioManager hook
const { play, stop } = useAudioManager();

const playAlarm = () => {
  stop('alarm');  // Stop any existing playback
  play('alarm');  // Play fresh
};
```

---

### Issue: Audio not playing in tests

**Problem:** jsdom doesn't support Web Audio API

**Solution:**

```javascript
// Mock useAudioManager in tests
jest.mock('../hooks/useAudioManager', () => ({
  useAudioManager: () => ({
    load: jest.fn(),
    play: jest.fn(),
    stop: jest.fn(),
    setVolume: jest.fn()
  })
}));

// Test that audio methods are called
expect(mockPlay).toHaveBeenCalledWith('alarm');
```

---

## Redux/State Issues

### Error: `Cannot read property 'pomoDuration' of undefined`

**Problem:** Accessing state before Redux store is initialized

**Solution:**

```javascript
// Use optional chaining
const pomoDuration = useSelector(state => state.settings?.pomoDuration);

// Or provide default value
const pomoDuration = useSelector(state => state.settings.pomoDuration || 25);

// Ensure Provider wraps app
<Provider store={store}>
  <App />
</Provider>
```

---

### Issue: State not updating in component

**Problem:** Component not subscribed to Redux changes

**Solution:**

```javascript
// Use useSelector hook
import { useSelector } from 'react-redux';
import { selectPomoDuration } from './store/selectors';

const Component = () => {
  const pomoDuration = useSelector(selectPomoDuration);  // ✅ Subscribes to changes

  // Not this:
  const state = store.getState();  // ❌ No subscription
  const pomoDuration = state.settings.pomoDuration;
};
```

---

### Issue: Dispatch not working

**Problem:** Missing useDispatch hook or incorrect usage

**Solution:**

```javascript
import { useDispatch } from 'react-redux';
import { setPomoDuration } from './store/settingsSlice';

const Component = () => {
  const dispatch = useDispatch();

  const handleChange = (value) => {
    dispatch(setPomoDuration(value));  // ✅

    // Not this:
    setPomoDuration(value);  // ❌ Action not dispatched
  };
};
```

---

### Error: `Actions must be plain objects`

**Problem:** Dispatching non-serializable value or missing thunk middleware

**Solution:**

```javascript
// Redux Toolkit includes thunk by default
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    settings: settingsReducer
  }
  // Thunk middleware included automatically
});

// Ensure actions are plain objects
dispatch({ type: 'SET_VALUE', payload: 25 });  // ✅

// Not functions (unless using thunk)
dispatch(() => { /* ... */ });  // ❌ Without thunk
```

---

## Routing Issues

### Error: `Cannot GET /settings`

**Problem:** React Router not handling routes on refresh (server-side issue)

**Solution:**

**Development:** Already handled by CRA dev server

**Production:**

**Netlify:** Add `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Apache:** Add `.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Nginx:** Configure:

```nginx
location / {
  try_files $uri /index.html;
}
```

---

### Error: `useNavigate() may be used only in context of <Router>`

**Problem:** Component using routing hooks outside Router context

**Solution:**

```javascript
// Ensure Router wraps app
import { BrowserRouter } from 'react-router-dom';

<BrowserRouter>
  <App />
</BrowserRouter>

// Not this:
<App />  // ❌ No Router context
```

---

### Issue: Routes not working with basename

**Problem:** Deployed to subdirectory but routes break

**Solution:**

```javascript
// Set PUBLIC_URL in .env.production
PUBLIC_URL=/pomodor

// Use basename in Router
<BrowserRouter basename="/pomodor">
  <Routes>
    <Route path="/" element={<Timer />} />
    <Route path="/settings" element={<Settings />} />
  </Routes>
</BrowserRouter>

// Links will be: /pomodor/, /pomodor/settings
```

---

## Performance Issues

### Issue: Timer lags or skips seconds

**Problem:** Heavy re-renders or blocking operations

**Solution:**

```javascript
// Use useCallback for timer functions
const tick = useCallback(() => {
  setTimeLeft(prev => prev - 1);
}, []);

// Memoize expensive calculations
const formattedTime = useMemo(() => {
  return formatTime(timeLeft);
}, [timeLeft]);

// Avoid inline object/array creation
// ❌ Bad:
<Component style={{ color: 'red' }} />

// ✅ Good:
const style = useMemo(() => ({ color: 'red' }), []);
<Component style={style} />
```

---

### Issue: Slow initial load

**Problem:** Large bundle size or missing code splitting

**Solution:**

```javascript
// Lazy load routes
import { lazy, Suspense } from 'react';

const Settings = lazy(() => import('./components/Settings'));
const Report = lazy(() => import('./components/Report'));

<Suspense fallback={<div>Loading...</div>}>
  <Routes>
    <Route path="/settings" element={<Settings />} />
    <Route path="/report" element={<Report />} />
  </Routes>
</Suspense>

// Analyze bundle
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

---

### Issue: Memory leaks

**Problem:** Not cleaning up subscriptions/timers

**Solution:**

```javascript
useEffect(() => {
  const interval = setInterval(() => {
    // Timer logic
  }, 1000);

  // Cleanup on unmount
  return () => {
    clearInterval(interval);
  };
}, []);

// Audio cleanup
useEffect(() => {
  const { dispose } = audioService;

  return () => {
    dispose('alarm');
    dispose('ticking');
  };
}, []);
```

---

## Deployment Issues

### Error: `ENOENT: no such file or directory`

**Problem:** Build files not found during deployment

**Solution:**

```bash
# Ensure build directory exists
npm run build
ls build/

# Check .gitignore doesn't exclude build/
# (Some platforms build on their servers)

# Verify package.json scripts
"build": "react-scripts build"
```

---

### Error: `Failed to compile` on deployment

**Problem:** Different Node versions or missing env variables

**Solution:**

```bash
# Specify Node version
# netlify.toml
[build.environment]
  NODE_VERSION = "20"

# vercel.json
{
  "build": {
    "env": {
      "NODE_VERSION": "20"
    }
  }
}

# GitHub Actions
- uses: actions/setup-node@v4
  with:
    node-version: '20'
```

---

### Issue: CSS not loading in production

**Problem:** Wrong PUBLIC_URL or missing CSS imports

**Solution:**

```bash
# Set PUBLIC_URL in .env.production
PUBLIC_URL=/

# Ensure CSS imported in components
import './App.css';

# Check build output
ls build/static/css/
```

---

### Issue: Fonts not loading

**Problem:** Incorrect font paths after deployment

**Solution:**

```css
/* Use relative paths in CSS */
@font-face {
  font-family: 'CustomFont';
  src: url('./fonts/custom.woff2') format('woff2');
}

/* Or absolute with PUBLIC_URL */
src: url('%PUBLIC_URL%/fonts/custom.woff2') format('woff2');
```

---

## Browser-Specific Issues

### Issue: Audio doesn't work on iOS

**Problem:** iOS requires user interaction before playing audio

**Solution:**

```javascript
// Initialize audio on first user interaction
let audioUnlocked = false;

const unlockAudio = async () => {
  if (audioUnlocked) return;

  const audio = new Audio();
  audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

  try {
    await audio.play();
    audioUnlocked = true;
  } catch (e) {
    console.log('Audio still locked');
  }
};

// Call on button click
<button onClick={unlockAudio}>Start Timer</button>
```

---

### Issue: Layout breaks in Safari

**Problem:** Safari CSS compatibility

**Solution:**

```css
/* Use -webkit- prefixes */
display: -webkit-flex;
display: flex;

/* Avoid CSS Grid gaps in older Safari */
grid-gap: 1rem;  /* ❌ Old Safari */
gap: 1rem;       /* ✅ Modern browsers */

/* Test in Safari Technology Preview */
```

---

### Issue: localStorage not working in Firefox Private Mode

**Problem:** Private mode disables localStorage

**Solution:**

```javascript
// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

// Fallback to memory storage
const storage = isLocalStorageAvailable()
  ? localStorage
  : new Map();
```

---

## Getting More Help

If your issue isn't covered here:

1. **Check Documentation**
   - [README.md](./README.md)
   - [ARCHITECTURE.md](./ARCHITECTURE.md)
   - [SETUP.md](./SETUP.md)

2. **Search GitHub Issues**
   - [Open Issues](https://github.com/joshl26/pomodoro-app/issues)
   - [Closed Issues](https://github.com/joshl26/pomodoro-app/issues?q=is%3Aissue+is%3Aclosed)

3. **Create New Issue**
   - Use issue template
   - Include error messages
   - Provide system information:

     ```bash
     node --version
     npm --version
     cat package.json
     ```

4. **Community Resources**
   - React Discord
   - Stack Overflow (tag: `reactjs`)
   - Reddit: r/reactjs

---

## Diagnostic Commands

Run these commands to gather system information for bug reports:

```bash
# System info
echo "OS: $(uname -a)"
echo "Node: $(node --version)"
echo "npm: $(npm --version)"

# Package versions
npm list react react-dom react-redux redux

# Check for issues
npm doctor

# Verify package.json integrity
npm audit

# Clear all caches
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

**Still having issues?**

Open an issue with:

- Error message (full stack trace)
- Steps to reproduce
- Expected vs actual behavior
- System information from diagnostic commands
- Screenshots (if UI issue)

---

**Maintained by:** Joshua Lehman
**Last Updated:** 2025-10-25
**For issues:** <https://github.com/joshl26/pomodoro-app/issues>
