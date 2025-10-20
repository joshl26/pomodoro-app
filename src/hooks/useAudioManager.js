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

      return audioManager.play(name, { ...opts, volume: vol });
    },
    [alarmSettings.volume]
  );

  const stop = useCallback((name) => audioManager.stop(name), []);

  const load = useCallback((name) => audioManager.load(name), []);

  const playButtonSound = useCallback(() => {
    // Only play if button sound is enabled in settings
    if (alarmSettings.buttonSound === false) return Promise.resolve();
    const vol =
      typeof alarmSettings.volume === "number"
        ? alarmSettings.volume
        : undefined;
    return audioManager.play("button", { volume: vol });
  }, [alarmSettings.buttonSound, alarmSettings.volume]);

  const mute = useCallback(() => audioManager.mute(), []);
  const unmute = useCallback(() => audioManager.unmute(), []);
  const isMuted = useCallback(() => audioManager.isMuted(), []);

  return {
    play,
    stop,
    load,
    playButtonSound,
    mute,
    unmute,
    isMuted,
  };
}
