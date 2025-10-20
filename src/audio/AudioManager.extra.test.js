// src/audio/AudioManager.extra.test.js
import audioManager from "./AudioManager";

describe("AudioManager — extra tests", () => {
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
    global.Audio = MockAudio;
  });

  afterAll(() => {
    delete global.Audio;
  });

  beforeEach(() => {
    // Reset internal state
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
    jest.clearAllMocks();
  });

  test("setVolume clamps values to 0..1", () => {
    const inst = audioManager.load("Bell");
    audioManager.setVolume("Bell", -5);
    expect(inst.volume).toBe(0);

    audioManager.setVolume("Bell", 99);
    expect(inst.volume).toBe(1);
  });

  test("play handles rejected promise from play()", async () => {
    const inst = audioManager.load("Bell");
    inst.play = jest.fn(() => Promise.reject(new Error("play blocked")));
    // Should resolve (swallow) and not throw
    await expect(audioManager.play("Bell")).resolves.toBeUndefined();
    expect(inst.play).toHaveBeenCalled();
  });

  test("play swallows synchronous play errors", async () => {
    const inst = audioManager.load("Digital");
    inst.play = jest.fn(() => {
      throw new Error("boom");
    });
    await expect(audioManager.play("Digital")).resolves.toBeUndefined();
  });

  test("play sets loop and new instances inherit globalVolume", async () => {
    audioManager.globalVolume = 0.33;
    await audioManager.play("Kitchen", { loop: true });
    const inst = audioManager.instances.get("Kitchen");
    expect(inst).toBeDefined();
    expect(inst.loop).toBe(true);
    // new instance should pick up globalVolume on creation
    expect(inst.volume).toBeCloseTo(0.33, 5);
  });

  test("stop / setVolume are no-ops for unknown keys (no throw)", () => {
    expect(() => audioManager.stop("unknown-key")).not.toThrow();
    expect(() => audioManager.setVolume("unknown-key", 0.5)).not.toThrow();
  });
});
