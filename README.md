# PomoBreak - Modern Pomodoro Timer

![Test Status](https://github.com/joshl26/pomodoro-app/actions/workflows/test-coverage.yml/badge.svg)
![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/joshl26/a7072c522479866d730b652f16e1a985/raw/pomodoro-app-coverage.json)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-blue.svg)
![Redux](https://img.shields.io/badge/Redux-Toolkit-purple.svg)
![Bundle Size](https://img.shields.io/badge/bundle-87KB%20gzipped-success.svg)

> A lightweight, feature-rich Pomodoro timer built with modern React patterns, Redux Toolkit, and comprehensive testing. Optimized for performance with a focus on clean architecture and developer experience.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Live Demo](#-live-demo)
- [Quick Start](#-quick-start)
- [Documentation](#-documentation)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Performance](#-performance)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)
- [License](#-license)
- [Author](#-author)
- [Acknowledgments](#-acknowledgments)

---

## 🎯 Overview

PomoBreak is a production-ready Pomodoro timer application that demonstrates modern React development practices. Built as both a functional productivity tool and a learning resource, it showcases:

- **Clean Architecture** - Separation of concerns with custom hooks and services
- **State Management** - Redux Toolkit with memoized selectors
- **Performance** - Code splitting, lazy loading, optimized re-renders (87KB gzipped)
- **Testing** - Comprehensive test coverage (>80%) with Jest and React Testing Library
- **Type Safety** - JSDoc annotations for IntelliSense support
- **Developer Experience** - ESLint, Prettier, pre-commit hooks, CI/CD

Whether you're looking for a productivity tool or a reference implementation of React best practices, PomoBreak has you covered.

---

## ✨ Features

### Core Functionality

- ⏱️ **Customizable Timers** - Set durations for work sessions (25min), short breaks (5min), and long breaks (15min)
- 🔄 **Smart Cycles** - Automatic progression through pomodoro → break cycles with long breaks every N cycles
- ▶️ **Auto-Start** - Optional auto-start for breaks and pomodoros
- ⏭️ **Quick Navigation** - Forward/backward buttons to skip between modes
- 🔔 **Audio Notifications** - Multiple alarm sounds with volume control and preview
- 🎵 **Optional Sounds** - Ticking sound and button click feedback

### Technical Highlights

- 🚀 **Lazy Loading** - Routes split into separate bundles, loaded on-demand
- 🧪 **80%+ Test Coverage** - Unit, integration, and component tests
- 📦 **Tiny Bundle** - Only 87KB gzipped (excellent!)
- ♿ **Accessible** - WCAG AA compliant, keyboard navigation
- 📱 **Responsive** - Mobile-first design, works on all devices
- 🎨 **Theme Support** - Clean, modern UI with customizable colors

### Developer Features

- 🔧 **Custom Hooks** - Reusable logic for timers, audio, and state
- 🗂️ **Centralized State** - Redux Toolkit with organized slices
- 🎵 **Custom Audio Service** - Memory-efficient audio management
- 📝 **Comprehensive Docs** - Architecture, API, setup, and troubleshooting guides
- 🤖 **CI/CD Pipeline** - Automated testing and deployment with GitHub Actions

---

## 🌐 Live Demo

**Try it now:** [https://joshlehman.ca/pomodor](https://joshlehman.ca/pomodor)

### Screenshots

| ![Landing Page](https://raw.githubusercontent.com/joshl26/joshl26/main/assets/pomodor-1.png) | ![Timer](https://raw.githubusercontent.com/joshl26/joshl26/main/assets/pomodor-2.png) |
|:-------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------:|
| **Landing Page**                                                                            | **Active Timer**                                                                    |
| ![Help](https://raw.githubusercontent.com/joshl26/joshl26/main/assets/pomodor-3.png)       | ![Settings](https://raw.githubusercontent.com/joshl26/joshl26/main/assets/pomodor-4.png) |
| **Help Page**                                                                               | **Settings**                                                                        |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 17.0.0 (recommended: 18.x or 20.x LTS)
- **npm** >= 8.0.0
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/joshl26/pomodoro-app.git
cd pomodoro-app

# Install dependencies
npm install

# Start development server
npm start
```

The app will open automatically at [http://localhost:3000](http://localhost:3000)

### Package Manager Options

**Using npm (default):**

```bash
npm install
npm start
```

**Using pnpm:**

```bash
# Enable via Corepack (Node 16.10+)
corepack enable
corepack prepare pnpm@latest --activate

# Install and run
pnpm install
pnpm start
```

> **Note:** If you encounter pnpm version mismatch errors, remove the `packageManager` field from `package.json` or update it to match your installed version.

---

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

| Document | Description |
|----------|-------------|
| **[SETUP.md](./SETUP.md)** | Installation, IDE setup, troubleshooting |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | System design, component hierarchy, data flow |
| **[API.md](./API.md)** | Redux actions, selectors, hooks, utilities |
| **[DEPLOYMENT.md](./DEPLOYMENT.md)** | Deploy to GitHub Pages, Netlify, Vercel, AWS |
| **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** | Common issues and solutions |
| **[FAQ.md](./FAQ.md)** | Frequently asked questions |
| **[CHANGELOG.md](./CHANGELOG.md)** | Version history and release notes |
| **[CONTRIBUTING.md](./CONTRIBUTING.md)** | Contribution guidelines |
| **[ROADMAP.md](./ROADMAP.md)** | Development roadmap and progress |

---

## 🛠️ Technology Stack

### Core Technologies

```json
{
  "React": "18.3.1",
  "Redux Toolkit": "2.3.0",
  "React Router": "6.28.0",
  "React Testing Library": "16.1.0",
  "Jest": "27.5.1"
}
```

### Key Libraries & Tools

- **State Management:** Redux Toolkit with custom hooks
- **Routing:** React Router v6 with lazy loading
- **Testing:** Jest + React Testing Library
- **Styling:** CSS Modules with theme support
- **Audio:** Custom audio service (no external library)
- **Build:** Create React App with optimizations
- **Linting:** ESLint + Prettier
- **CI/CD:** GitHub Actions

### Why These Choices?

**React 18:** Concurrent features, automatic batching, improved performance

**Redux Toolkit:** Reduced boilerplate, built-in best practices, DevTools integration

**Custom Audio Service:** Better memory management than libraries, easier testing, no extra dependencies

**CRA:** Zero-config setup, battle-tested build pipeline, easy ejection if needed

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed design decisions.

---

## 📁 Project Structure

```
pomodoro-app/
├── public/                  # Static assets
│   ├── index.html          # HTML template
│   ├── favicon.ico         # App icon
│   └── sounds/             # Audio files (if not in src)
├── src/
│   ├── assets/             # Images, sounds, fonts
│   │   └── sounds/         # Audio files
│   ├── components/         # React components
│   │   ├── Timer.jsx       # Main timer component
│   │   ├── Settings.jsx    # Settings page
│   │   ├── SecondaryButtons.jsx
│   │   ├── Report.jsx
│   │   └── Help.jsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useAudioManager.js
│   │   ├── useTimerMode.js
│   │   ├── useTimerControls.js
│   │   └── useAutoStartCycle.js
│   ├── services/           # Business logic
│   │   └── audioService.js # Audio management
│   ├── store/              # Redux state
│   │   ├── index.js        # Store configuration
│   │   ├── settingsSlice.js # Settings reducer
│   │   └── selectors.js    # Memoized selectors
│   ├── utilities/          # Helper functions
│   │   └── util.js         # Time formatting, etc.
│   ├── __tests__/          # Test files
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── store/
│   │   └── utilities/
│   ├── App.jsx             # Root component
│   ├── App.css             # Global styles
│   ├── index.jsx           # App entry point
│   └── setupTests.js       # Test configuration
├── .eslintrc.json          # ESLint config
├── .prettierrc             # Prettier config
├── package.json            # Dependencies
├── README.md               # This file
├── ARCHITECTURE.md         # Architecture docs
├── API.md                  # API reference
├── ROADMAP.md              # Development plan
└── CHANGELOG.md            # Version history
```

### Key Directories Explained

**`/components`** - Presentational and container components

- Each component in its own file
- Co-located styles (`.css` files)
- Memoized with `React.memo()` where beneficial

**`/hooks`** - Custom React hooks for reusable logic

- `useTimerMode` - Mode transitions (pomodoro/break)
- `useTimerControls` - Start/pause/reset logic
- `useAudioManager` - Audio playback interface

**`/services`** - Business logic and external integrations

- `audioService.js` - Singleton audio manager

**`/store`** - Redux state management

- `settingsSlice.js` - All app settings
- `selectors.js` - Centralized state selectors

---

## 💻 Development

### Available Scripts

```bash
# Development
npm start              # Start dev server (http://localhost:3000)
npm run build          # Production build
npm test               # Run tests in watch mode
npm run lint           # Run ESLint
npm run format         # Format code with Prettier

# Testing
npm test -- --coverage               # Test with coverage report
npm test -- --watchAll=false         # Run tests once (CI mode)
npm test -- --testPathPattern=Timer  # Run specific test file

# Analysis
npm run analyze        # Analyze bundle size
```

### Development Workflow

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make Changes**
   - Write code following existing patterns
   - Add tests for new functionality
   - Update documentation if needed

3. **Test Changes**

   ```bash
   npm test                    # Run all tests
   npm run lint                # Check for linting errors
   npm run format              # Auto-format code
   ```

4. **Commit Changes**

   ```bash
   git add .
   git commit -m "feat: add my feature"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation
   - `test:` Tests
   - `refactor:` Code refactoring
   - `perf:` Performance improvement

5. **Push and Create PR**

   ```bash
   git push origin feature/my-feature
   ```

   Then open a Pull Request on GitHub.

### Code Style Guidelines

**Components:**

```javascript
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectValue } from './store/selectors';
import './Component.css';

/**
 * Component description
 * @param {Object} props - Component props
 */
const Component = ({ prop1, prop2 }) => {
  const value = useSelector(selectValue);
  const dispatch = useDispatch();

  return (
    <div className="component">
      {/* JSX */}
    </div>
  );
};

export default React.memo(Component);
```

**Custom Hooks:**

```javascript
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook description
 * @returns {Object} Hook return value
 */
export const useCustomHook = () => {
  const [state, setState] = useState(null);

  const method = useCallback(() => {
    // Logic
  }, []);

  return { state, method };
};
```

---

## 🧪 Testing

### Test Coverage

Current coverage: **>80%** across the codebase

```bash
# Run tests with coverage
npm test -- --coverage --watchAll=false

# Coverage by category:
# - Utilities: 95%+
# - Reducers: 95%+
# - Hooks: 80%+
# - Components: 70%+
```

### Testing Stack

- **Jest** - Test runner and assertions
- **React Testing Library** - Component testing
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/react-hooks** - Hook testing

### Writing Tests

**Component Test Example:**

```javascript
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Timer from './Timer';
import settingsReducer from './store/settingsSlice';

const createMockStore = () => configureStore({
  reducer: { settings: settingsReducer }
});

test('renders timer display', () => {
  const store = createMockStore();
  render(
    <Provider store={store}>
      <Timer />
    </Provider>
  );
  expect(screen.getByText(/25:00/)).toBeInTheDocument();
});
```

**Hook Test Example:**

```javascript
import { renderHook, act } from '@testing-library/react';
import { useTimerMode } from './useTimerMode';

test('advances to next mode', () => {
  const { result } = renderHook(() => useTimerMode());

  act(() => {
    result.current.advanceMode();
  });

  expect(result.current.timerMode).toBe('shortBreak');
});
```

See [ARCHITECTURE.md - Testing Strategy](./ARCHITECTURE.md#testing-strategy) for detailed patterns.

---

## 🚢 Deployment

### Quick Deploy Options

**GitHub Pages (Current):**

```bash
npm run deploy
```

**Netlify:**

```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Vercel:**

```bash
npm install -g vercel
vercel --prod
```

### Platform-Specific Guides

Detailed deployment instructions for:

- GitHub Pages (automated with GitHub Actions)
- Netlify (with `netlify.toml` config)
- Vercel (with `vercel.json` config)
- AWS S3 + CloudFront
- Docker containerization

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete guides.

### Environment Configuration

Create `.env.production` for production builds:

```bash
# Public URL (for subdirectory deployments)
PUBLIC_URL=/pomodor

# Disable source maps (security)
GENERATE_SOURCEMAP=false

# API endpoint (if backend added)
REACT_APP_API_URL=https://api.yourdomain.com

# Analytics (optional)
REACT_APP_GA_ID=G-XXXXXXXXXX
```

---

## ⚡ Performance

### Bundle Size

```
Main bundle:    ~250KB (uncompressed)
Main bundle:    ~87KB (gzipped) ✅
CSS bundle:     ~15KB (gzipped)
Total load:     ~102KB (excellent!)
```

### Lighthouse Scores

```
Performance:      95/100 ✅
Accessibility:   100/100 ✅
Best Practices:  100/100 ✅
SEO:              92/100 ✅
```

### Optimization Techniques

1. **Code Splitting** - Routes lazy-loaded with `React.lazy()`
2. **Memoization** - `React.memo()`, `useMemo()`, `useCallback()`
3. **Selector Optimization** - Memoized Redux selectors with Reselect
4. **Asset Optimization** - Compressed images, optimized audio files
5. **Tree Shaking** - Unused code eliminated in production
6. **Caching** - Proper cache headers for static assets

### Performance Monitoring

```bash
# Run Lighthouse audit
npm install -g lighthouse
lighthouse http://localhost:3000 --view

# Analyze bundle
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

See [ARCHITECTURE.md - Performance Optimizations](./ARCHITECTURE.md#performance-optimizations) for details.

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Quick Contribution Guide

1. **Fork** the repository
2. **Clone** your fork
3. **Create** a feature branch
4. **Make** changes with tests
5. **Submit** a pull request

### Contribution Opportunities

**Good First Issues:**

- 📝 Documentation improvements
- 🐛 Bug fixes
- 🎨 UI/UX enhancements
- ✅ Additional tests

**Advanced Contributions:**

- 🚀 Performance optimizations
- ⚙️ New features from roadmap
- 🏗️ Architecture improvements
- 🔧 Build/tooling enhancements

### Guidelines

- Follow existing code style (ESLint + Prettier enforced)
- Write tests for new features
- Update documentation as needed
- Keep PRs focused and atomic
- Link PRs to relevant issues

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## 🗺️ Roadmap

### Current Status

**Progress:** 97/147 tasks completed (66%)

**Completed Phases:**

- ✅ Phase 1: Performance & Code Quality (13/13)
- ✅ Phase 2: State Management (14/14)
- ✅ Phase 3: Audio Management (11/11)
- ✅ Phase 4: Modernization (36/36)
- ✅ Phase 5: Testing & Quality (15/15)

**In Progress:**

- ⏳ Phase 6: Performance Optimization (8/12)
- ⏳ Phase 8: Developer Experience (8/14)

**Planned:**

- 📋 Phase 7: Features & UX (0/16)
- 📋 Phase 9: Documentation (8/8) ✅ COMPLETE
- 📋 Phase 10: Maintenance & Monitoring (0/8)

### Upcoming Features

**Next Release (v2.1.0):**

- Keyboard shortcuts (Space, Escape, arrows)
- Desktop notifications
- CSS optimization
- Performance profiling improvements

**Future Releases:**

- localStorage persistence
- Dark mode toggle
- Session history and statistics
- Export/import settings
- PWA support (offline mode)
- Multi-language support (i18n)

See [ROADMAP.md](./ROADMAP.md) for the complete development plan.

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Joshua Lehman

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

**What this means:**

- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

See [LICENSE](./LICENSE) file for full text.

---

## 👤 Author

**Joshua Lehman**

- 🌐 Portfolio: [joshlehman.ca](https://joshlehman.ca)
- 💼 LinkedIn: [joshrlehman](https://www.linkedin.com/in/joshrlehman/)
- 🐙 GitHub: [@joshl26](https://github.com/joshl26)
- 📧 Email: Available on portfolio

### Support the Project

If you find PomoBreak helpful:

- ⭐ **Star** this repository
- 🐛 **Report bugs** and suggest features
- 💻 **Contribute** code or documentation
- 📢 **Share** with others
- 💬 **Provide feedback**

---

## 🙏 Acknowledgments

### Inspiration

- **The Pomodoro Technique** by Francesco Cirillo
- Open-source Pomodoro timer projects
- React and Redux community best practices

### Technologies & Resources

- [React](https://react.dev/) - UI library and excellent documentation
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management made easy
- [React Router](https://reactrouter.com/) - Client-side routing
- [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/react) - Testing tools
- [Create React App](https://create-react-app.dev/) - Zero-config build setup

### Community

Thanks to:

- All contributors (past, present, and future)
- Users who report bugs and suggest features
- The open-source community for tools and inspiration
- React/Redux communities for guidance and best practices

---

## 📞 Support & Contact

### Getting Help

- 📖 **Documentation**: Check the docs folder for detailed guides
- 🐛 **Bug Reports**: [Open an issue](https://github.com/joshl26/pomodoro-app/issues/new)
- 💡 **Feature Requests**: [Open an issue](https://github.com/joshl26/pomodoro-app/issues/new)
- ❓ **Questions**: See [FAQ.md](./FAQ.md) or open a discussion

### Stay Updated

- **Watch** this repository for updates
- **Star** to show support and bookmark
- Check [CHANGELOG.md](./CHANGELOG.md) for version updates

---

## 🎓 Learning Resources

**New to React/Redux?** This project can help you learn:

- Modern React patterns (hooks, functional components)
- Redux Toolkit state management
- Custom hooks for reusable logic
- Testing React applications
- Project structure and architecture
- Performance optimization techniques

**Recommended Learning Path:**

1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system overview
2. Explore components in `src/components/`
3. Study custom hooks in `src/hooks/`
4. Review tests in `src/__tests__/`
5. Try making small changes and seeing results

---

## 🔮 Future Vision

PomoBreak aims to be:

1. **The reference implementation** for modern React + Redux apps
2. **A learning resource** for developers at all levels
3. **A production-ready tool** for productivity
4. **An open-source community** for collaboration

**Long-term goals:**

- PWA with offline support
- Mobile apps (React Native)
- Cloud sync capabilities
- Team collaboration features
- Plugin/extension system

---

## 📊 Project Stats

```
Lines of Code:    ~5,000
Test Coverage:    >80%
Bundle Size:      87KB (gzipped)
Dependencies:     25 (minimal!)
Dev Dependencies: 45
Contributors:     1+ (you?)
Stars:            ⭐ (add yours!)
```

---

## 💖 Show Your Support

If you like this project:

```bash
# Give it a star on GitHub ⭐
# Fork it and try new ideas 🍴
# Share it with friends 📢
# Contribute improvements 💻
# Report bugs and suggest features 🐛
```

---

**Ready to boost your productivity?** [Try PomoBreak now!](https://joshlehman.ca/pomodor)

**Want to contribute?** Check out [CONTRIBUTING.md](./CONTRIBUTING.md) and [ROADMAP.md](./ROADMAP.md)

**Need help?** See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) and [FAQ.md](./FAQ.md)

---

<div align="center">

**Made with ❤️ by Joshua Lehman**

[Live Demo](https://joshlehman.ca/pomodor) • [Documentation](./ARCHITECTURE.md) • [Report Bug](https://github.com/joshl26/pomodoro-app/issues) • [Request Feature](https://github.com/joshl26/pomodoro-app/issues)

⭐ Star this repo if you find it helpful!

</div>
