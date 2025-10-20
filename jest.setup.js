// jest.setup.js
require("@testing-library/jest-dom");

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
global.Audio = MockAudio;
