// src/hooks/useAudioManager.js
import { useCallback } from "react";
import { useSelector } from "react-redux";
import audioManager from "../audio/AudioManager";
import { selectAlarmSettings } from "../store/selectors";

/**
 * Hook wrapper that reads alarm settings from Redux and exposes
 * convenient helpers for components.
 */
export function useAudioManager() {
  const alarmSettings = useSelector(selectAlarmSettings) || {};

  const play = useCallback(
    (name, opts = {}) => {
      // decide volume: prefer explicit opts.volume, else take from alarmSettings
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

  const playButtonSound = useCallback(() => {
    // Only play if button sound is NOT explicitly disabled (undefined = allowed)
    if (alarmSettings.buttonSound === false) return Promise.resolve();
    const vol =
      typeof alarmSettings.volume === "number"
        ? alarmSettings.volume
        : undefined;
    try {
      return audioManager.play("button", { volume: vol });
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

  const mute = useCallback(() => audioManager.mute(), []);
  const unmute = useCallback(() => audioManager.unmute(), []);
  const isMuted = useCallback(() => audioManager.isMuted(), []);

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
