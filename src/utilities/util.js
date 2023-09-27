export function player({ asset, volume = 0.5, loop = false, isRunning }) {
  const audio = new Audio();
  audio.src = asset;
  audio.volume = volume;

  if (loop) {
    audio.addEventListener(
      "ended",
      () => {
        audio.currentTime = 0;
        audio.play();
      },
      false
    );
  }

  const play = () => {
    console.log("play");
    console.log(`"audio.src:" ${audio.src}`);
    console.log(`"audio.volume:" ${audio.volume}`);

    if (audio.paused || !audio.currentTime) {
      audio.play().catch(() => {});
    }
  };

  const stop = () => {
    console.log("Audio stop initiated");
  };

  const setVolume = (value) => (audio.volume = value);

  const setAudio = (src) => {
    audio.src = src;
  };

  return {
    play,
    stop,
    setVolume,
    setAudio,
  };
}
