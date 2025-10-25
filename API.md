# PomoBreak API Documentation

**Version**: 2.0
**Last Updated**: 2025-10-25

---

## Table of Contents

1. [Redux API](#redux-api)
   - [Actions](#actions)
   - [Selectors](#selectors)
   - [Thunks](#thunks)
2. [Custom Hooks](#custom-hooks)
3. [Audio Service](#audio-service)
4. [Utility Functions](#utility-functions)
5. [Component Props](#component-props)

---

## Redux API

### Actions

All actions are created with Redux Toolkit's `createSlice`. Import from `src/store/settingsSlice.js`.

#### Timer Duration Actions

##### `setPomoDuration(minutes)`

Set the Pomodoro work session duration.

**Parameters:**

- `minutes` (number): Duration in minutes (1-60)

**Example:**

```javascript
dispatch(setAlarmVolume(0.7)); // 70% volume
```

---

##### `setTickingSound(url)`

Set the ticking sound file URL.

**Parameters:**

- `url` (string): Path to audio file

**Example:**

```javascript
dispatch(setTickingSound('/sounds/tick.mp3'));
```

---

##### `setTickingVolume(volume)`

Set ticking sound volume level.

**Parameters:**

- `volume` (number): Volume 0.0 to 1.0

**Example:**

```javascript
dispatch(setTickingVolume(0.3));
```

---

##### `setButtonSound(url)`

Set the button click sound file URL.

**Parameters:**

- `url` (string): Path to audio file

**Example:**

```javascript
dispatch(setButtonSound('/sounds/click.mp3'));
```

---

##### `setButtonVolume(volume)`

Set button sound volume level.

**Parameters:**

- `volume` (number): Volume 0.0 to 1.0

**Example:**

```javascript
dispatch(setButtonVolume(0.5));
```

---

### Selectors

Import from `src/store/selectors.js`. All selectors accept the Redux state as their first parameter.

#### Duration Selectors

##### `selectPomoDuration(state)`

Get the pomodoro duration in minutes.

**Returns:** `number`

**Example:**

```javascript
import { useSelector } from 'react-redux';
import { selectPomoDuration } from './store/selectors';

const pomoDuration = useSelector(selectPomoDuration);
// Returns: 25
```

---

##### `selectShortBreakDuration(state)`

Get the short break duration in minutes.

**Returns:** `number`

---

##### `selectLongBreakDuration(state)`

Get the long break duration in minutes.

**Returns:** `number`

---

##### `selectLongBreakInterval(state)`

Get the long break interval (cycles between long breaks).

**Returns:** `number`

---

#### Mode & Cycle Selectors

##### `selectTimerMode(state)`

Get the current timer mode.

**Returns:** `'pomodoro' | 'shortBreak' | 'longBreak'`

**Example:**

```javascript
const timerMode = useSelector(selectTimerMode);

if (timerMode === 'pomodoro') {
  // Show work-focused UI
}
```

---

##### `selectCycleCount(state)`

Get the current cycle count.

**Returns:** `number`

---

##### `selectAutoStartBreaks(state)`

Check if auto-start breaks is enabled.

**Returns:** `boolean`

---

##### `selectAutoStartPomodoros(state)`

Check if auto-start pomodoros is enabled.

**Returns:** `boolean`

---

#### Audio Selectors

##### `selectAlarmSound(state)`

Get the alarm sound URL.

**Returns:** `string`

---

##### `selectAlarmVolume(state)`

Get the alarm volume level.

**Returns:** `number` (0.0 to 1.0)

---

##### `selectTickingSound(state)`

Get the ticking sound URL.

**Returns:** `string`

---

##### `selectTickingVolume(state)`

Get the ticking volume level.

**Returns:** `number` (0.0 to 1.0)

---

##### `selectButtonSound(state)`

Get the button sound URL.

**Returns:** `string`

---

##### `selectButtonVolume(state)`

Get the button volume level.

**Returns:** `number` (0.0 to 1.0)

---

#### Derived Selectors (Memoized)

##### `selectCurrentDuration(state)`

Get the duration for the current timer mode.

**Returns:** `number` (minutes)

**Example:**

```javascript
const currentDuration = useSelector(selectCurrentDuration);
// If mode is 'pomodoro': returns 25
// If mode is 'shortBreak': returns 5
// If mode is 'longBreak': returns 15
```

**Implementation:**

```javascript
export const selectCurrentDuration = createSelector(
  [selectTimerMode, selectPomoDuration, selectShortBreakDuration, selectLongBreakDuration],
  (mode, pomo, short, long) => {
    const durationMap = {
      'pomodoro': pomo,
      'shortBreak': short,
      'longBreak': long
    };
    return durationMap[mode];
  }
);
```

---

### Thunks

Composite actions that dispatch multiple actions in sequence. Import from `src/store/settingsSlice.js`.

#### `advanceCycle()`

Advance to the next timer mode based on cycle count.

**Logic:**

- If `cycleCount % longBreakInterval === 0`: Go to long break
- Otherwise: Go to short break
- Increment cycle count

**Example:**

```javascript
// User completes a pomodoro
dispatch(advanceCycle());

// State changes:
// - timerModeState: 'pomodoro' → 'shortBreak' (or 'longBreak')
// - cycleCount: incremented
```

---

##### `retreatCycle()`

Move back to the previous timer mode.

**Logic:**

- Decrement cycle count (minimum 0)
- Set mode to 'pomodoro'

**Example:**

```javascript
// User clicks "back" button
dispatch(retreatCycle());
```

---

##### `resetCycleAndTimer()`

Reset cycle count to 0 and return to pomodoro mode.

**Example:**

```javascript
// User clicks "reset all" button
dispatch(resetCycleAndTimer());

// State changes:
// - cycleCount: 0
// - timerModeState: 'pomodoro'
```

---

## Custom Hooks

### useTimerMode()

Encapsulates timer mode transitions and cycle management.

**Import:**

```javascript
import { useTimerMode } from './hooks/useTimerMode';
```

**Returns:**

```typescript
{
  timerMode: 'pomodoro' | 'shortBreak' | 'longBreak',
  cycleCount: number,
  advanceMode: () => void,
  retreatMode: () => void,
  setMode: (mode: string) => void,
  resetAll: () => void
}
```

**Example:**

```javascript
const Timer = () => {
  const { timerMode, advanceMode, resetAll } = useTimerMode();

  const handleComplete = () => {
    // Move to next mode when timer completes
    advanceMode();
  };

  return (
    <div>
      <h1>Current: {timerMode}</h1>
      <button onClick={resetAll}>Reset All</button>
    </div>
  );
};
```

---

### useAutoStartCycle()

Manages auto-start behavior for timer cycles.

**Import:**

```javascript
import { useAutoStartCycle } from './hooks/useAutoStartCycle';
```

**Returns:**

```typescript
{
  autoStartBreaks: boolean,
  autoStartPomodoros: boolean,
  setAutoStartBreaks: (enabled: boolean) => void,
  setAutoStartPomodoros: (enabled: boolean) => void,
  shouldAutoStart: () => boolean
}
```

**Example:**

```javascript
const Timer = () => {
  const { shouldAutoStart } = useAutoStartCycle();

  useEffect(() => {
    if (timeLeft === 0 && shouldAutoStart()) {
      // Auto-start next timer
      startTimer();
    }
  }, [timeLeft]);
};
```

---

### useTimerControls()

Consolidates start/pause/resume/reset logic.

**Import:**

```javascript
import { useTimerControls } from './hooks/useTimerControls';
```

**Returns:**

```typescript
{
  isRunning: boolean,
  isPaused: boolean,
  start: () => void,
  pause: () => void,
  resume: () => void,
  reset: () => void
}
```

**Example:**

```javascript
const Timer = () => {
  const { isRunning, start, pause, reset } = useTimerControls();

  return (
    <div>
      {!isRunning ? (
        <button onClick={start}>Start</button>
      ) : (
        <button onClick={pause}>Pause</button>
      )}
      <button onClick={reset}>Reset</button>
    </div>
  );
};
```

---

### useAudioManager()

React hook wrapper for the audio service.

**Import:**

```javascript
import { useAudioManager } from './hooks/useAudioManager';
```

**Returns:**

```typescript
{
  load: (key: string, src: string) => Promise<void>,
  play: (key: string, options?: { loop?: boolean }) => void,
  stop: (key: string) => void,
  setVolume: (key: string, volume: number) => void,
  preload: (key: string, src: string) => Promise<void>
}
```

**Example:**

```javascript
const Timer = () => {
  const { load, play, setVolume } = useAudioManager();

  // Load alarm on mount
  useEffect(() => {
    load('alarm', '/sounds/alarm.mp3');
  }, [load]);

  // Play when timer completes
  const handleComplete = () => {
    play('alarm');
  };

  // Update volume
  const handleVolumeChange = (newVolume) => {
    setVolume('alarm', newVolume);
  };

  return <div>Timer UI</div>;
};
```

---

## Audio Service

Direct service API (usually accessed via `useAudioManager` hook).

**Import:**

```javascript
import AudioService from './services/audioService';

const audioService = AudioService.getInstance();
```

### Methods

#### `load(key, src)`

Load and cache an audio file.

**Parameters:**

- `key` (string): Unique identifier for this audio
- `src` (string): URL/path to audio file

**Returns:** `Promise<void>`

**Example:**

```javascript
await audioService.load('alarm', '/sounds/alarm.mp3');
```

---

##### `play(key, options)`

Play a loaded audio file.

**Parameters:**

- `key` (string): Audio identifier
- `options` (object, optional):
  - `loop` (boolean): Loop playback (default: false)

**Returns:** `Promise<void>`

**Example:**

```javascript
// Play once
audioService.play('alarm');

// Play on loop
audioService.play('ticking', { loop: true });
```

**Note:** Gracefully handles promise rejections (e.g., autoplay restrictions).

---

##### `stop(key)`

Stop playback and reset to start.

**Parameters:**

- `key` (string): Audio identifier

**Example:**

```javascript
audioService.stop('ticking');
```

---

##### `setVolume(key, volume)`

Set volume for a specific audio instance.

**Parameters:**

- `key` (string): Audio identifier
- `volume` (number): Volume level 0.0 to 1.0

**Example:**

```javascript
audioService.setVolume('alarm', 0.8); // 80% volume
```

---

##### `dispose(key)`

Remove audio from cache and free resources.

**Parameters:**

- `key` (string): Audio identifier

**Example:**

```javascript
audioService.dispose('oldAlarm');
```

---

## Utility Functions

Import from `src/utilities/util.js`.

### `formatTime(seconds)`

Format seconds into MM:SS display format.

**Parameters:**

- `seconds` (number): Total seconds

**Returns:** `string` (format: "MM:SS")

**Example:**

```javascript
import { formatTime } from './utilities/util';

formatTime(125);  // Returns: "02:05"
formatTime(3600); // Returns: "60:00"
formatTime(45);   // Returns: "00:45"
```

---

#### `secondsToMinutes(seconds)`

Convert seconds to minutes (rounded).

**Parameters:**

- `seconds` (number)

**Returns:** `number`

**Example:**

```javascript
secondsToMinutes(120); // Returns: 2
secondsToMinutes(150); // Returns: 3 (rounded)
```

---

##### `minutesToSeconds(minutes)`

Convert minutes to seconds.

**Parameters:**

- `minutes` (number)

**Returns:** `number`

**Example:**

```javascript
minutesToSeconds(5);  // Returns: 300
minutesToSeconds(25); // Returns: 1500
```

---

## Component Props

### Timer Component

**Props:** None (uses Redux for all state)

**Usage:**

```javascript
<Timer />
```

---

### SecondaryButtons Component

**Props:**

```typescript
{
  onForward: () => void,      // Handler for forward button
  onBackward: () => void,     // Handler for backward button
  onReset: () => void,        // Handler for reset button
  isRunning: boolean,         // Current timer state
  timerMode: string,          // Current mode
  disabled?: boolean          // Optional: disable all buttons
}
```

**Example:**

```javascript
<SecondaryButtons
  onForward={handleForward}
  onBackward={handleBackward}
  onReset={handleReset}
  isRunning={isRunning}
  timerMode={timerMode}
/>
```

---

### Settings Component

**Props:** None (uses Redux for all state)

**Usage:**

```javascript
<Settings />
```

---

### ResponsiveHeader Component

**Props:**

```typescript
{
  title?: string,             // Optional: Override default title
  showBackButton?: boolean    // Optional: Show back navigation
}
```

**Example:**

```javascript
<ResponsiveHeader title="PomoBreak" />
```

---

## Usage Examples

### Complete Timer Implementation

```javascript
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTimerMode } from './hooks/useTimerMode';
import { useTimerControls } from './hooks/useTimerControls';
import { useAudioManager } from './hooks/useAudioManager';
import { selectCurrentDuration, selectAlarmSound } from './store/selectors';
import { formatTime } from './utilities/util';

const Timer = () => {
  const dispatch = useDispatch();
  const { timerMode, advanceMode } = useTimerMode();
  const { isRunning, start, pause, reset } = useTimerControls();
  const { load, play, stop } = useAudioManager();

  const currentDuration = useSelector(selectCurrentDuration);
  const alarmSound = useSelector(selectAlarmSound);

  const [timeLeft, setTimeLeft] = useState(currentDuration * 60);

  // Load alarm sound
  useEffect(() => {
    if (alarmSound) {
      load('alarm', alarmSound);
    }
  }, [alarmSound, load]);

  // Timer tick
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          play('alarm');
          advanceMode();
          return currentDuration * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, currentDuration, play, advanceMode]);

  return (
    <div className="timer">
      <h1>{timerMode}</h1>
      <div className="display">{formatTime(timeLeft)}</div>
      <button onClick={isRunning ? pause : start}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};

export default Timer;
```

---

### Settings with Audio Preview

```javascript
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAudioManager } from './hooks/useAudioManager';
import { setAlarmSound, setAlarmVolume } from './store/settingsSlice';
import { selectAlarmSound, selectAlarmVolume } from './store/selectors';

const Settings = () => {
  const dispatch = useDispatch();
  const { load, play, stop, setVolume } = useAudioManager();

  const alarmSound = useSelector(selectAlarmSound);
  const alarmVolume = useSelector(selectAlarmVolume);

  const [previewPlaying, setPreviewPlaying] = useState(false);

  // Load selected alarm
  useEffect(() => {
    if (alarmSound) {
      load('settingsAlarm', alarmSound);
      setVolume('settingsAlarm', alarmVolume);
    }
  }, [alarmSound, alarmVolume, load, setVolume]);

  const handleAlarmChange = (newUrl) => {
    dispatch(setAlarmSound(newUrl));
  };

  const handleVolumeChange = (newVolume) => {
    dispatch(setAlarmVolume(newVolume));
    setVolume('settingsAlarm', newVolume);
  };

  const handlePreview = () => {
    if (previewPlaying) {
      stop('settingsAlarm');
      setPreviewPlaying(false);
    } else {
      play('settingsAlarm');
      setPreviewPlaying(true);
      setTimeout(() => setPreviewPlaying(false), 2000);
    }
  };

  return (
    <div className="settings">
      <h2>Alarm Settings</h2>
      <select value={alarmSound} onChange={(e) => handleAlarmChange(e.target.value)}>
        <option value="/sounds/alarm1.mp3">Chime</option>
        <option value="/sounds/alarm2.mp3">Bell</option>
      </select>

      <label>
        Volume: {Math.round(alarmVolume * 100)}%
        <input
          type="range"
          min="0"
          max="100"
          value={alarmVolume * 100}
          onChange={(e) => handleVolumeChange(e.target.value / 100)}
        />
      </label>

      <button onClick={handlePreview}>
        {previewPlaying ? 'Stop Preview' : 'Preview Sound'}
      </button>
    </div>
  );
};

export default Settings;
```

---

## Error Handling

### Audio Errors

```javascript
const { load, play } = useAudioManager();

try {
  await load('alarm', '/sounds/alarm.mp3');
  play('alarm');
} catch (error) {
  console.error('Audio error:', error);
  // Show user-friendly error message
  alert('Unable to load audio. Please check your sound settings.');
}
```

### Redux Errors

```javascript
try {
  dispatch(setPomoDuration(invalidValue));
} catch (error) {
  console.error('Redux error:', error);
  // Reset to safe default
  dispatch(setPomoDuration(25));
}
```

---

## TypeScript Definitions (Future)

Recommended types for TypeScript migration:

```typescript
// State types
interface SettingsState {
  pomoDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  timerModeState: 'pomodoro' | 'shortBreak' | 'longBreak';
  cycleCount: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  alarmSound: string;
  alarmVolume: number;
  tickingSound: string;
  tickingVolume: number;
  buttonSound: string;
  buttonVolume: number;
}

// Hook return types
interface UseTimerModeReturn {
  timerMode: 'pomodoro' | 'shortBreak' | 'longBreak';
  cycleCount: number;
  advanceMode: () => void;
  retreatMode: () => void;
  setMode: (mode: string) => void;
  resetAll: () => void;
}

interface UseAudioManagerReturn {
  load: (key: string, src: string) => Promise<void>;
  play: (key: string, options?: { loop?: boolean }) => void;
  stop: (key: string) => void;
  setVolume: (key: string, volume: number) => void;
  preload: (key: string, src: string) => Promise<void>;
}
```

---

**Maintained by:** Joshua Lehman
**For questions or contributions:** See [CONTRIBUTING.md](./CONTRIBUTING.md):**

```javascript
import { setPomoDuration } from './store/settingsSlice';

dispatch(setPomoDuration(25));
```

---

### `setShortBreakDuration(minutes)`

Set the short break duration.

**Parameters:**

- `minutes` (number): Duration in minutes (1-30)

**Example:**

```javascript
dispatch(setShortBreakDuration(5));
```

---

#### `setLongBreakDuration(minutes)`

Set the long break duration.

**Parameters:**

- `minutes` (number): Duration in minutes (5-60)

**Example:**

```javascript
dispatch(setLongBreakDuration(15));
```

---

##### `setLongBreakInterval(count)`

Set how many pomodoros before a long break.

**Parameters:**

- `count` (number): Number of pomodoros (2-10)

**Example:**

```javascript
dispatch(setLongBreakInterval(4)); // Long break every 4 pomodoros
```

---

#### Timer Mode Actions

##### `setTimerModeState(mode)`

Directly set the current timer mode.

**Parameters:**

- `mode` (string): One of `'pomodoro'`, `'shortBreak'`, `'longBreak'`

**Example:**

```javascript
dispatch(setTimerModeState('shortBreak'));
```

---

##### `setTimerModeAndReset({ mode, resetCycle })`

Set timer mode and optionally reset the cycle count.

**Parameters:**

- `mode` (string): Timer mode
- `resetCycle` (boolean): Whether to reset cycle count to 0

**Example:**

```javascript
// Switch to pomodoro and reset cycle
dispatch(setTimerModeAndReset({ mode: 'pomodoro', resetCycle: true }));

// Switch to break without resetting cycle
dispatch(setTimerModeAndReset({ mode: 'shortBreak', resetCycle: false }));
```

---

#### Cycle Management Actions

##### `incrementCycleCount()`

Increment the cycle counter by 1.

**Example:**

```javascript
dispatch(incrementCycleCount());
```

---

##### `decrementCycleCount()`

Decrement the cycle counter by 1 (minimum 0).

**Example:**

```javascript
dispatch(decrementCycleCount());
```

---

##### `resetCycleCount()`

Reset cycle counter to 0.

**Example:**

```javascript
dispatch(resetCycleCount());
```

---

#### Auto-Start Actions

##### `setAutoStartBreaks(enabled)`

Enable/disable auto-starting break timers.

**Parameters:**

- `enabled` (boolean)

**Example:**

```javascript
dispatch(setAutoStartBreaks(true));
```

---

##### `setAutoStartPomodoros(enabled)`

Enable/disable auto-starting pomodoro timers after breaks.

**Parameters:**

- `enabled` (boolean)

**Example:**

```javascript
dispatch(setAutoStartPomodoros(false));
```

---

#### Audio Actions

##### `setAlarmSound(url)`

Set the alarm sound file URL.

**Parameters:**

- `url` (string): Path to audio file

**Example:**

```javascript
dispatch(setAlarmSound('/sounds/chime.mp3'));
```

---

##### `setAlarmVolume(volume)`

Set alarm volume level.

**Parameters:**

- `volume` (number): Volume 0.0 to 1.0

**Example
