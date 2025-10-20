import ButtonPressSound from "../assets/sounds/button-press.wav";
import BellSound from "../assets/sounds/alarm-bell.mp3";
import DigitalSound from "../assets/sounds/alarm-digital.mp3";
import KitchenSound from "../assets/sounds/alarm-kitchen.mp3";
import TickingSlowSound from "../assets/sounds/ticking-slow.mp3";

/**
 * Lightweight singleton AudioManager.
 * - Uses HTMLAudioElement (new Audio(src))
 * - Keeps instances per sound name so we can control stop/load/volume
 * - Methods return promises where appropriate (play)
 *
 * Sound registry keys:
 *  - "button"  -> button press sound
 *  - "Bell"    -> bell alarm (sound names matching select options)
 *  - "Digital" -> digital alarm
 *  - "Kitchen" -> kitchen alarm
 *  - "alarm"   -> fallback alarm (alias to Bell)
 */

const SOUND_REGISTRY = {
  button: ButtonPressSound,
  Bell: BellSound,
  Digital: DigitalSound,
  Kitchen: KitchenSound,
  alarm: BellSound,
  tick: TickingSlowSound,
};

class AudioManager {
  constructor() {
    this.instances = new Map(); // name => HTMLAudioElement
    this.muted = false;
    this.globalVolume = 1;
  }

  _createInstance(name) {
    const url = SOUND_REGISTRY[name];
    if (!url) return null;
    const a = new Audio(url);
    a.preload = "auto";
    a.volume = this.globalVolume;
    a.loop = false;
    return a;
  }

  load(name) {
    if (this.instances.has(name)) return this.instances.get(name);
    const instance = this._createInstance(name);
    if (!instance) return null;
    this.instances.set(name, instance);
    return instance;
  }

  async play(name, { loop = false, volume } = {}) {
    if (this.muted) return Promise.resolve();
    let instance = this.instances.get(name) || this._createInstance(name);
    if (!instance) return Promise.resolve();

    // store instance if not already stored
    if (!this.instances.has(name)) this.instances.set(name, instance);

    instance.loop = !!loop;
    if (typeof volume === "number") {
      instance.volume = Math.max(0, Math.min(1, volume));
    }
    try {
      const p = instance.play();
      // In some environments play returns undefined; normalize to Promise
      return p instanceof Promise ? p : Promise.resolve();
    } catch (err) {
      // swallow and resolve, tests can still assert instance.play was called
      return Promise.resolve();
    }
  }

  stop(name) {
    const instance = this.instances.get(name);
    if (!instance) return;
    try {
      instance.pause();
      instance.currentTime = 0;
      instance.loop = false;
    } catch {
      // ignore
    }
  }

  setVolume(name, v) {
    const instance = this.instances.get(name);
    if (!instance) return;
    instance.volume = Math.max(0, Math.min(1, Number(v) || 0));
  }

  mute() {
    this.muted = true;
    // optionally pause all sounds
    for (const inst of this.instances.values()) {
      try {
        inst.pause();
      } catch {}
    }
  }

  unmute() {
    this.muted = false;
  }

  isMuted() {
    return this.muted;
  }

  // expose registry keys (useful for tests)
  getAvailableSounds() {
    return Object.keys(SOUND_REGISTRY);
  }
}

// assign to a named variable before exporting to satisfy ESLint import/no-anonymous-default-export
/** @type {AudioManager} */
const audioManager = new AudioManager();

export default audioManager;