// src/audio/AudioManager.test.js
import audioManager from "./AudioManager";

describe("AudioManager", () => {
  // Minimal global Audio mock for these unit tests
  class MockAudio {
    constructor(src) {
      this.src = src;
      this.play = jest.fn().mockResolvedValue();
      this.pause = jest.fn();
      this.currentTime = 0;
      this.volume = 1;
      this.loop = false;
      this.preload = "";
    }
  }

  beforeAll(() => {
    global.Audio = MockAudio; // Jest-friendly mock
  });

  afterAll(() => {
    delete global.Audio;
  });

  beforeEach(() => {
    // Ensure a clean slate for each test
    if (
      audioManager.instances &&
      typeof audioManager.instances.clear === "function"
    ) {
      audioManager.instances.clear();
    } else {
      audioManager.instances = new Map();
    }
    audioManager.muted = false;
    audioManager.globalVolume = 1;
  });

  afterEach(() => {
    // Stop and clear any instances created during tests
    try {
      for (const name of audioManager.getAvailableSounds()) {
        audioManager.stop(name);
      }
    } catch {}
    if (
      audioManager.instances &&
      typeof audioManager.instances.clear === "function"
    ) {
      audioManager.instances.clear();
    }
    jest.clearAllMocks();
  });

  test("load creates an audio instance and returns it", () => {
    const inst = audioManager.load("button");
    expect(inst).toBeDefined();
    // In Jest environment asset imports are often mocked (e.g. "test-file-stub").
    // Assert the src is a string instead of relying on filename content.
    expect(typeof inst.src).toBe("string");
    expect(typeof inst.play).toBe("function");
  });

  test("load is idempotent (caches instance)", () => {
    const a = audioManager.load("Bell");
    const b = audioManager.load("Bell");
    expect(a).toBe(b);
  });

  test("play calls play() on the audio instance", async () => {
    const inst = audioManager.load("Bell");
    await audioManager.play("Bell");
    expect(inst.play).toHaveBeenCalled();
  });

  test("play creates and caches instance when not preloaded", async () => {
    await audioManager.play("Digital");
    expect(audioManager.instances.has("Digital")).toBe(true);
    const inst = audioManager.instances.get("Digital");
    expect(inst).toBeDefined();
    expect(inst.play).toHaveBeenCalled();
  });

  test("play applies explicit volume option", async () => {
    await audioManager.play("Kitchen", { volume: 0.42 });
    const inst = audioManager.instances.get("Kitchen");
    expect(inst).toBeDefined();
    expect(inst.volume).toBeCloseTo(0.42, 5);
    expect(inst.play).toHaveBeenCalled();
  });

  test("stop pauses and resets currentTime", async () => {
    const inst = audioManager.load("Digital");
    inst.currentTime = 1.23;
    await audioManager.play("Digital");
    audioManager.stop("Digital");
    expect(inst.pause).toHaveBeenCalled();
    expect(inst.currentTime).toBe(0);
    expect(inst.loop).toBe(false);
  });

  test("setVolume sets instance volume", () => {
    const inst = audioManager.load("Bell");
    audioManager.setVolume("Bell", 0.2);
    expect(inst.volume).toBeCloseTo(0.2);
  });

  test("stop / setVolume are no-ops for unknown keys (no throw)", () => {
    expect(() => audioManager.stop("unknown-key")).not.toThrow();
    expect(() => audioManager.setVolume("unknown-key", 0.5)).not.toThrow();
  });

  test("mute prevents play from attempting to play", async () => {
    audioManager.mute();
    const inst = audioManager.load("Kitchen");
    await audioManager.play("Kitchen");
    // when muted, instance.play should not be called
    expect(inst.play).not.toHaveBeenCalled();
    audioManager.unmute();
  });

  test("play swallows synchronous play errors", async () => {
    const inst = audioManager.load("Bell");
    // make play throw synchronously
    inst.play = jest.fn(() => {
      throw new Error("boom");
    });
    await expect(audioManager.play("Bell")).resolves.toBeUndefined();
  });

  test("getAvailableSounds contains registry keys", () => {
    const keys = audioManager.getAvailableSounds();
    expect(keys).toEqual(
      expect.arrayContaining([
        "button",
        "Bell",
        "Digital",
        "Kitchen",
        "alarm",
        "tick",
      ])
    );
  });
});
