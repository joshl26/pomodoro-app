import { useEffect, useState } from "react";

const useCountdown = (targetDate, time) => {
  console.log(time);
  const countDownDate = new Date(targetDate).getTime();

  const NOW_IN_MS = new Date().getTime();

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  console.log("current time" + NOW_IN_MS);
  console.log("time" + time);
  console.log("countdown" + countDown);
  console.log("targetdate" + targetDate);

  const x = (countDown / time) * 100;

  console.log(x);

  return getReturnValues(countDown, x);
};

const getReturnValues = (countDown, x) => {
  // console.log(x);
  // calculate time left
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return [days, hours, minutes, seconds, x];
};

export { useCountdown };
