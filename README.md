### Welcome to PomoBreak (pomodoro-app) README

<p align="center">
  <a href="https://www.npmjs.com/package/pomodoro-app" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/pomodoro-app.svg">
  </a>
  <img alt="npm" src="https://img.shields.io/badge/npm-%3E%3D8.0.0-blue.svg" />
  <img alt="node" src="https://img.shields.io/badge/node-%3E%3D17.0.0-blue.svg" />
  <a href="https://github.com/joshl26/pomodoro-app#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/joshl26/pomodoro-app/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/joshl26/pomodoro-app/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/joshl26/pomodoro-app" />
  </a>
</p>

### Table of contents
- Overview
- Features
- Demo & Screenshots
- Prerequisites
- Quick start
- Useful scripts
- Project structure
- Key components & hooks
- Audio manager (API & examples)
- Testing & common issues
- Troubleshooting
- Code style, linting, pre-commit hooks
- CI / GitHub Actions (suggested)
- Roadmap & contributing
- License & authorship
- Acknowledgements

#### Overview
PomoBreak (pomodoro-app) is a lightweight Pomodoro timer built with React and Redux. The project explores UI/UX design, routing, state management, custom audio management, and test coverage for robust front-end development.

#### Features
- Customizable Pomodoro durations (work, short break, long break)
- Cycle tracking and auto-start options
- Custom alarm and UI button sounds with preload & volume controls
- Responsive UI (desktop + mobile)
- Tests for reducers, hooks, and components
- Custom audio manager to avoid duplicated audio instances and reduce latency

#### Demo & Screenshots
- Live demo: [Live Demo Site](https://joshlehman.ca/pomodor)
- Landing page: [Screenshot - Landing Page](https://raw.githubusercontent.com/joshl26/joshl26/main/assets/pomodor-1.png)
- Timers: [Screenshot - Timers](https://raw.githubusercontent.com/joshl26/joshl26/main/assets/pomodor-2.png)
- Help: [Screenshot - Help](https://raw.githubusercontent.com/joshl26/joshl26/main/assets/pomodor-3.png)
- Settings: [Screenshot - Settings](https://raw.githubusercontent.com/joshl26/joshl26/main/assets/pomodor-4.png)

#### Prerequisites
- Node.js >= 17.0.0
- npm >= 8.0.0

Note: At times the repo has referenced pnpm in tooling notes (packageManager field). If you prefer npm, remove or update the packageManager field in package.json. If you want to use pnpm, either install it globally or enable with Corepack:

```bash
# Option A: install pnpm globally
npm i -g pnpm

# Option B: enable via Corepack
corepack enable
corepack prepare pnpm@<version> --activate
```

#### Quick start
1. Clone the repo:
```bash
git clone https://github.com/joshl26/pomodoro-app.git
cd pomodoro-app
```

2. Install dependencies:
```bash
npm install
```

3. Start dev server:
```bash
npm run start
```

4. Run tests:
```bash
npm run test
```

#### Useful scripts (example)
Ensure these scripts exist or adapt them to your package.json:
```bash
"start": "react-scripts start",
"build": "react-scripts build",
"test": "react-scripts test --env=jsdom",
"test:watch": "react-scripts test --watchAll",
"lint": "eslint 'src/**/*.{js,jsx}'",
"format": "prettier --write 'src/**/*.{js,jsx,json,md}'"
```

### Project structure (recommended)
A simple overview; actual project layout may vary slightly:
```
/src
  /assets
    /sounds
  /components
    Timer.jsx
    Settings.jsx
    SecondaryButtons.jsx
  /hooks
    useAudioManager.js
    useTimerMode.js
  /services
    audioService.js
  /store
    settingsSlice.js
    index.js
  /__tests__
  App.jsx
  index.jsx
README.md
ROADMAP.md
CONTRIBUTING.md
```

### Key components & hooks (what to look for)
#### Timer.jsx
- Core timer UI
- Uses Redux for timer state and durations
- Uses useAudioManager hook for ticking and alarm sounds

#### Settings.jsx
- UI for choosing alarm and button sounds, volume controls
- Uses useAudioManager.load to preload selected sounds to reduce latency
- Uses debounced previews for sliders

#### SecondaryButtons.jsx
- Quick controls (forward/back, skip, reset)
- Plays a short button sound via useAudioManager.play

#### Hooks
- useAudioManager: wrap audio service and expose play/load/stop/setVolume
- useTimerMode: encapsulates mode transitions (pomodoro, short break, long break)
- useTimerControls: start/pause/resume logic and associated UI handlers

### Audio manager — API & examples
The project uses a custom audio manager (service + hook) rather than a library to better control loading, memory, and test behavior. The exact method names in your codebase may vary slightly — below is a recommended interface and examples of how to use it.

#### Typical API (exposed by src/hooks/useAudioManager.js)
- load(key, src) — load and cache an audio asset (preload)
- play(key, { loop = false }) — play a cached or inline audio; safe against rejected play() promises
- stop(key) — stop playback of one sound instance
- setVolume(keyOrGlobal, volume) — update volume immediately without re-playing
- dispose(key) — free resources if needed

Example usage in a component:
```javascript
const { load, play, setVolume, stop } = useAudioManager();

// Preload user-selected alarm on settings mount
useEffect(() => {
  if (alarmUrl) load('selectedAlarm', alarmUrl)
}, [alarmUrl, load])

// Play preview when user toggles preview button
const onPreview = () => {
  stop('preview')    // ensure previous preview stopped
  play('selectedAlarm') // play preview sound
}

// Update volume immediately
setVolume('selectedAlarm', 0.6) // 60%
```

Testing notes:
- In tests, mock useAudioManager to avoid real audio output:
```javascript
jest.mock('../hooks/useAudioManager', () => () => ({
  load: jest.fn(),
  play: jest.fn(),
  stop: jest.fn(),
  setVolume: jest.fn(),
}));
```

### Testing & common issues
The project uses Jest + React Testing Library. Common patterns and fixes:

- Use provider wrappers when rendering components that rely on Redux:
```javascript
import { Provider } from 'react-redux';
render(<Provider store={store}><Settings /></Provider>);
```

- For hook tests, use renderHook from @testing-library/react-hooks or RTL's utilities with providers.

- If tests show "React is not defined" or "Invalid hook call":
  - Ensure your component files import React if using JSX in files that require it.
  - Verify single React version: run `npm ls react` to detect duplicates.
  - Ensure test mocks don't return components that violate Rules of Hooks.

- For side-effects and async hook effects:
  - Use `waitFor` and `findBy*` queries instead of immediate assertions.
  - Avoid overuse of fake timers if the code depends on microtasks (Promise microtasks). If needed, temporarily use real timers with `jest.useRealTimers()`.

- Audio play() rejections in headless environments:
  - The audio manager swallows rejected play() promises to avoid test failures. When mocking audio, assert mock calls rather than actual playback.

### Troubleshooting (common gotchas)
- pnpm mismatch errors: remove or update `packageManager` in package.json, or install matching pnpm via Corepack.
- Duplicate React instances: run `npm ls react` and remove duplicates (sometimes caused by workspace or local linked package).
- Slider tests failing: confirm Slider component imports React (if needed) and test uses React Testing Library queries not direct DOM node access.
- Redux state not updating in tests: use a real store instance unless intentionally mocking dispatch; ensure reducers initialize default state.

### Code style, linting & pre-commit hooks
- ESLint configuration should enforce best practices (no var, consistent imports). Add rules or extend recommended configs.
- Prettier for formatting consistency; add `.prettierrc`.
- Husky + lint-staged for pre-commit checks (example):
```bash
npx husky-init && npm install
# then in package.json
"husky": { ... }
"lint-staged": {
  "src/**/*.{js,jsx}": [
    "npm run lint",
    "npm run format",
    "git add"
  ]
}
```

### CI / GitHub Actions (suggested)
A minimal CI workflow to run tests, lint, and build:
```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm run lint
      - run: npm run test -- --coverage --watchAll=false
      - run: npm run build
```

Add coverage thresholds or fail builds when coverage falls under target.

### Roadmap & contributing
- The detailed roadmap is in `ROADMAP.md`. It lists completed phases (Performance, State, Audio, Testing) and next priorities (Router migration to v6, code-splitting, bundle analysis).
- Contributions are welcome. Please follow the repository's [CONTRIBUTING.md](https://github.com/joshl26/pomodoro-app/blob/master/CONTRIBUTING.md) and open issues for feature requests or bug reports.
- When opening PRs:
  - Link to the roadmap task or issue.
  - Add a short description, testing steps, and screenshots if relevant.
  - Ensure tests are added/updated and lint passes.

#### Suggested PR template (copy into .github/PULL_REQUEST_TEMPLATE.md)
```markdown
## Summary
Short description of what this PR does.

## Related issue
Closes #<issue_number> or relates to #<issue_number>

## Changes
- Bullet list of changes

## How to test
- Steps to reproduce locally

## Checklist
- [ ] Tests added/updated
- [ ] Lint/format passes
- [ ] Build passes
```

### License & authorship
This project is licensed under the MIT License — see the full license at [LICENSE](https://github.com/joshl26/pomodoro-app/blob/master/LICENSE).

Author: Joshua Lehman — portfolio: [joshlehman.ca](https://joshlehman.ca) • GitHub: [joshl26](https://github.com/joshl26) • LinkedIn: [joshrlehman](https://www.linkedin.com/in/joshrlehman/)

### Acknowledgements & resources
- React, Redux, React Router
- React Testing Library, Jest
- Inspiration from open-source Pomodoro apps and front-end patterns

---