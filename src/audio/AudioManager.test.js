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
    }
  }

  beforeAll(() => {
    global.Audio = MockAudio; // Jest-friendly mock
  });

  afterAll(() => {
    delete global.Audio;
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

  test("play calls play() on the audio instance", async () => {
    const inst = audioManager.load("Bell");
    await audioManager.play("Bell");
    expect(inst.play).toHaveBeenCalled();
  });

  test("stop pauses and resets currentTime", async () => {
    const inst = audioManager.load("Digital");
    inst.currentTime = 1.23;
    await audioManager.play("Digital");
    audioManager.stop("Digital");
    expect(inst.pause).toHaveBeenCalled();
    expect(inst.currentTime).toBe(0);
  });

  test("mute prevents play from attempting to play", async () => {
    audioManager.mute();
    const inst = audioManager.load("Kitchen");
    await audioManager.play("Kitchen");
    // when muted, instance.play should not be called
    expect(inst.play).not.toHaveBeenCalled();
    audioManager.unmute();
  });

  test("setVolume sets instance volume", () => {
    const inst = audioManager.load("Bell");
    audioManager.setVolume("Bell", 0.2);
    expect(inst.volume).toBeCloseTo(0.2);
  });
});
