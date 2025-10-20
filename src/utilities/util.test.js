import {
  minutesToSeconds,
  secondsToMinutes,
  formatTime,
  clamp,
  isValidDuration,
} from "./util";

describe("Utility functions", () => {
  describe("minutesToSeconds", () => {
    it("converts minutes to seconds correctly", () => {
      expect(minutesToSeconds(5)).toBe(300);
      expect(minutesToSeconds(0)).toBe(0);
      expect(minutesToSeconds(1.5)).toBe(90);
    });
  });

  describe("secondsToMinutes", () => {
    it("converts seconds to whole minutes correctly", () => {
      expect(secondsToMinutes(300)).toBe(5);
      expect(secondsToMinutes(359)).toBe(5);
      expect(secondsToMinutes(0)).toBe(0);
      expect(secondsToMinutes(59)).toBe(0);
    });
  });

  describe("formatTime", () => {
    it("formats time as MM:SS correctly", () => {
      expect(formatTime(5, 30)).toBe("5:30");
      expect(formatTime(0, 9)).toBe("0:09");
      expect(formatTime(10, 0)).toBe("10:00");
      expect(formatTime(0, 0)).toBe("0:00");
    });
  });

  describe("clamp", () => {
    it("returns value when within min and max", () => {
      expect(clamp(15, 1, 60)).toBe(15);
    });
    it("returns min when value is less than min", () => {
      expect(clamp(0, 1, 60)).toBe(1);
    });
    it("returns max when value is greater than max", () => {
      expect(clamp(100, 1, 60)).toBe(60);
    });
    it("works when min equals max", () => {
      expect(clamp(5, 5, 5)).toBe(5);
      expect(clamp(0, 5, 5)).toBe(5);
      expect(clamp(10, 5, 5)).toBe(5);
    });
  });

  describe("isValidDuration", () => {
    it("returns true for valid durations between 1 and 60 inclusive", () => {
      expect(isValidDuration(1)).toBe(true);
      expect(isValidDuration(25)).toBe(true);
      expect(isValidDuration(60)).toBe(true);
    });
    it("returns false for non-integers", () => {
      expect(isValidDuration(1.5)).toBe(false);
      expect(isValidDuration(0.99)).toBe(false);
    });
    it("returns false for values less than 1 or greater than 60", () => {
      expect(isValidDuration(0)).toBe(false);
      expect(isValidDuration(61)).toBe(false);
      expect(isValidDuration(-5)).toBe(false);
    });
    it("returns false for non-numbers", () => {
      expect(isValidDuration("25")).toBe(false);
      expect(isValidDuration(null)).toBe(false);
      expect(isValidDuration(undefined)).toBe(false);
    });
  });
});
