import classes from "./Timer.module.css";
import Progress from "./Progress";
import SecondaryButtons from "./SecondaryButtons";
import { useState } from "react";

import { POMODORO, LONG_BREAK, SHORT_BREAK } from "../constants";

const progress = "20%";

export const initialState = {
  modes: {
    [POMODORO]: {
      id: POMODORO,
      label: "Pomodoro",
      time: 25,
      active: true,
    },
    [SHORT_BREAK]: {
      id: SHORT_BREAK,
      label: "Short Break",
      time: 5,
      active: false,
    },
    [LONG_BREAK]: {
      id: LONG_BREAK,
      label: "Long Break",
      time: 15,
      active: false,
    },
  },
};

const Timer = () => {
  const [time, setTime] = useState("25:00");
  const [active, setActive] = useState("1");

  return (
    <div>
      <Progress percent={progress} />
      <div className={classes.container}>
        <div className={classes.content}>
          <SecondaryButtons timeChange={setTime} activeChange={setActive} />
          <div className={classes.time}>{time}</div>
          <div>
            <button className={classes.action_btn}>START</button>
          </div>
        </div>
        <div className={classes.counter}>{active}</div>
        <footer>Time to Focus!</footer>
      </div>
    </div>
  );
};

export default Timer;
