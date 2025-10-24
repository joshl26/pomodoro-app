import { useCallback } from "react";
import { useSelector } from "react-redux";
import audioManager from "../audio/AudioManager";
import { selectAlarmSettings } from "../store/selectors";

export function useAudioManager() {
  const alarmSettings = useSelector(selectAlarmSettings) || {};

  const play = useCallback(
    (name, opts = {}) => {
      const vol =
        typeof opts.volume === "number"
          ? opts.volume
          : typeof alarmSettings.volume === "number"
            ? alarmSettings.volume
            : undefined;

      try {
        return audioManager.play(name, { ...opts, volume: vol });
      } catch (err) {
        return Promise.reject(err);
      }
    },
    [alarmSettings?.volume]
  );

  const stop = useCallback((name) => {
    try {
      return audioManager.stop(name);
    } catch {
      return null;
    }
  }, []);

  const load = useCallback((name) => {
    try {
      return audioManager.load(name);
    } catch {
      return null;
    }
  }, []);

  const playButtonSound = useCallback(async () => {
    if (alarmSettings.buttonSound === false) return Promise.resolve();
    const vol =
      typeof alarmSettings.volume === "number"
        ? alarmSettings.volume
        : undefined;
    try {
      return await audioManager.play("button", { volume: vol });
    } catch {
      return Promise.resolve();
    }
  }, [alarmSettings?.buttonSound, alarmSettings?.volume]);

  const setVolume = useCallback((name, vol) => {
    try {
      return audioManager.setVolume(name, vol);
    } catch {
      return null;
    }
  }, []);

  const mute = useCallback(() => {
    try {
      return audioManager.mute();
    } catch {
      return null;
    }
  }, []);

  const unmute = useCallback(() => {
    try {
      return audioManager.unmute();
    } catch {
      return null;
    }
  }, []);

  const isMuted = useCallback(() => {
    try {
      return audioManager.isMuted();
    } catch {
      return false;
    }
  }, []);

  return {
    play,
    stop,
    load,
    playButtonSound,
    setVolume,
    mute,
    unmute,
    isMuted,
  };
}

export default useAudioManager;
