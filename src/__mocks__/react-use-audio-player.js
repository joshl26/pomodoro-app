// __mocks__/react-use-audio-player.js
export const useGlobalAudioPlayer = () => ({
  play: jest.fn(),
  pause: jest.fn(),
  stop: jest.fn(),
  load: jest.fn(),
});
