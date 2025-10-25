# PomoBreak FAQ

Frequently asked questions about PomoBreak development and usage.

---

## General Questions

### What is PomoBreak?

PomoBreak is a lightweight, feature-rich Pomodoro timer built with React and Redux. It helps users manage work sessions using the Pomodoro Technique, with customizable timers, audio notifications, and cycle tracking.

### What is the Pomodoro Technique?

The Pomodoro Technique is a time management method that uses a timer to break work into intervals (traditionally 25 minutes) separated by short breaks. Each interval is called a "pomodoro" (Italian for tomato, after the tomato-shaped kitchen timer).

**Standard cycle:**

1. Work for 25 minutes (1 pomodoro)
2. Take a 5-minute break
3. Repeat 4 times
4. Take a longer 15-minute break

### Is PomoBreak free to use?

Yes! PomoBreak is open-source under the MIT License. You can use, modify, and distribute it freely.

### Do I need to create an account?

No. PomoBreak runs entirely in your browser with no backend or authentication required.

### Does PomoBreak work offline?

Currently, no. The app requires an internet connection to load. However, a PWA (Progressive Web App) version with offline support is planned for future releases.

### Which browsers are supported?

PomoBreak works on all modern browsers:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Mobile browsers are also supported.

---

## Features & Usage

### How do I change timer durations?

1. Click the Settings icon (⚙️) in the header
2. Adjust sliders for:
   - Pomodoro duration (work session)
   - Short break duration
   - Long break duration
3. Changes apply to the next timer cycle

### Can I customize alarm sounds?

Yes! In Settings:

1. Select from available alarm sounds
2. Adjust volume with the slider
3. Click "Preview" to test the sound

### What is auto-start?

Auto-start automatically begins the next timer when the current one completes:

- **Auto-start breaks**: Automatically starts breaks after pomodoros
- **Auto-start pomodoros**: Automatically starts work sessions after breaks

Enable in Settings to create uninterrupted cycles.

### How do cycle counts work?

The app tracks how many pomodoros you've completed. After a set number of pomodoros (default: 4), it triggers a long break instead of a short break.

Example cycle:

```
Pomodoro 1 → Short Break
Pomodoro 2 → Short Break
Pomodoro 3 → Short Break
Pomodoro 4 → Long Break
(Repeat)
```

### Can I skip to the next timer?

Yes! Use the forward arrow (→) button below the timer to advance to the next mode. Use the backward arrow (←) to go back.

### What happens if I refresh the page?

Currently, timer state is not persisted. Refreshing will reset the timer. Persistent state (using localStorage) is planned for a future release.

### Can I use keyboard shortcuts?

Keyboard shortcuts are planned but not yet implemented. See the [Roadmap](./ROADMAP.md) Phase 7 for planned features.

---

## Technical Questions

### What technologies does PomoBreak use?

**Core:**

- React 18.x (functional components + hooks)
- Redux Toolkit (state management)
- React Router v6 (navigation)

**Build & Testing:**

- Create React App (build tool)
- Jest + React Testing Library (testing)
- ESLint + Prettier (code quality)

**Audio:**

- Custom audio service (no external audio library)
- Web Audio API

### Why use Redux for a simple timer app?

Redux provides:

- Centralized state management (easier to debug)
- Predictable state updates (pure reducers)
- Time-travel debugging (Redux DevTools)
- Easier testing (isolated state logic)
- Scalability for future features (history, stats, cloud sync)

While overkill for a minimal app, it demonstrates best practices for larger applications.

### Why create a custom audio service instead of using a library?

The custom audio service provides:

- Better memory management (no leaked audio instances)
- Full control over loading and caching
- Easier testing (simple mocks)
- No external dependencies
- Smaller bundle size

### How large is the bundle?

The production build is highly optimized:

- **Main bundle:** ~87KB gzipped
- **Total page load:** < 250KB (including assets)

This is achieved through:

- Code splitting (lazy-loaded routes)
- Tree shaking (removes unused code)
- Minification and compression

### How do you achieve >80% test coverage?

Comprehensive testing strategy:

- **Unit tests:** Reducers, selectors, utilities (95%+ coverage)
- **Hook tests:** Custom hooks with mocked dependencies (80%+ coverage)
- **Component tests:** User interactions and rendering (70%+ coverage)
- **Integration tests:** Multi-component workflows (selected critical paths)

See [ARCHITECTURE.md](./ARCHITECTURE.md) for testing strategy details.

### Why React 18 and not the latest version?

React 18 is the current stable version with excellent ecosystem support. The codebase can be easily upgraded to future versions as they're released.

### Is TypeScript supported?

Not currently. The project uses JavaScript with JSDoc comments for type hints. A TypeScript migration is considered for Phase 8 (Developer Experience) but not prioritized.

---

## Development Questions

### How do I contribute?

1. Read [CONTRIBUTING.md](./CONTRIBUTING.md)
2. Check [ROADMAP.md](./ROADMAP.md) for priorities
3. Open an issue or pick an existing one
4. Fork the repository
5. Create a feature branch
6. Make changes with tests
7. Submit a pull request

### What's the recommended IDE?

VS Code with these extensions:

- ESLint
- Prettier
- ES7+ React/Redux snippets

See [SETUP.md](./SETUP.md) for full IDE configuration.

### How do I run tests?

```bash
# All tests
npm test

# With coverage
npm test -- --coverage --watchAll=false

# Specific file
npm test -- Timer.test.js

# Watch mode
npm run test:watch
```

### How do I debug the app?

**Browser DevTools:**

1. Open Chrome/Firefox DevTools (F12)
2. Go to Sources tab
3. Set breakpoints in source code
4. Trigger breakpoints by interacting with app

**React DevTools:**

1. Install React DevTools extension
2. Open DevTools → React tab
3. Inspect component tree
4. View props and state

**Redux DevTools:**

1. Install Redux DevTools extension
2. Open DevTools → Redux tab
3. View actions and state changes
4. Time-travel through state history

### How do I add a new Redux action?

1. Open `src/store/settingsSlice.js`
2. Add action to `reducers` object:

```javascript
reducers: {
  setNewValue: (state, action) => {
    state.newValue = action.payload;
  }
}
```

3. Export action: `export const { setNewValue } = settingsSlice.actions;`
4. Add selector in `src/store/selectors.js`:

```javascript
export const selectNewValue = (state) => state.settings.newValue;
```

5. Use in component:

```javascript
const newValue = useSelector(selectNewValue);
dispatch(setNewValue(42));
```

### How do I add a new component?

1. Create file in `src/components/`: `NewComponent.jsx`
2. Write component:

```javascript
import React from 'react';

const NewComponent = ({ prop1, prop2 }) => {
  return (
    <div className="new-component">
      {/* Component JSX */}
    </div>
  );
};

export default React.memo(NewComponent);
```

3. Create CSS file: `NewComponent.css`
4. Import in component: `import './NewComponent.css';`
5. Write tests: `NewComponent.test.js`
6. Use in parent component:

```javascript
import NewComponent from './components/NewComponent';
<NewComponent prop1="value" prop2={42} />
```

### How do I add a new custom hook?

1. Create file in `src/hooks/`: `useNewHook.js`
2. Write hook:

```javascript
import { useState, useEffect } from 'react';

export const useNewHook = () => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    // Hook logic
  }, []);

  return { value, setValue };
};
```

3. Write tests: `useNewHook.test.js`
4. Use in component:

```javascript
const { value, setValue } = useNewHook();
```

---

## Deployment Questions

### Where is PomoBreak deployed?

The live demo is deployed to GitHub Pages: <https://joshlehman.ca/pomodor>

### How do I deploy my own instance?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guides for:

- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Docker

### Can I deploy to a subdirectory?

Yes! Set `PUBLIC_URL` in `.env.production`:

```bash
PUBLIC_URL=/my-subdirectory
```

And configure `basename` in Router:

```javascript
<BrowserRouter basename="/my-subdirectory">
```

### How do I set up a custom domain?

Depends on your hosting platform:

**GitHub Pages:**

1. Add `CNAME` file to `public/` folder
2. Configure DNS with your domain provider

**Netlify/Vercel:**

1. Go to domain settings in dashboard
2. Add custom domain
3. Follow DNS configuration instructions

See [DEPLOYMENT.md](./DEPLOYMENT.md) for platform-specific details.

### Why do routes return 404 when I refresh?

This is a common SPA (Single Page Application) issue. The server needs to serve `index.html` for all routes so React Router can handle them.

**Solutions:** See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for server configuration examples (Nginx, Apache, Netlify, etc.).

---

## Performance Questions

### Why is the initial load slow?

Possible reasons:

1. Slow internet connection
2. Large bundle size (check with `npm run build` and analyze)
3. Missing code splitting (routes should be lazy-loaded)
4. Heavy images/assets (optimize with compression)

**Check:** Run Lighthouse audit to identify bottlenecks.

### How can I improve performance?

1. **Use React.memo()** for components that don't need frequent re-renders
2. **Use useCallback()** to memoize functions
3. **Use useMemo()** for expensive calculations
4. **Lazy load** routes and heavy components
5. **Optimize images** (use WebP, compress)
6. **Reduce bundle size** (remove unused dependencies)
7. **Enable gzip** compression on server

See [ARCHITECTURE.md](./ARCHITECTURE.md) Performance Optimizations section.

### How do I measure performance?

```bash
# Lighthouse audit
npm install -g lighthouse
lighthouse http://localhost:3000 --view

# React DevTools Profiler
# 1. Open React DevTools
# 2. Go to Profiler tab
#
