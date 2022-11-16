import classes from "./Timer.module.css";
import Progress from "./Progress";
import SecondaryButtons from "./SecondaryButtons";

import { POMODORO, LONG_BREAK, SHORT_BREAK } from "../constants";

const progress = "30%";

const initialState = {
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
  return (
    <div>
      <Progress percent={progress} />
      <div className={classes.container}>
        <div className={classes.content}>
          <SecondaryButtons />
          <div className={classes.time}>25:00</div>
          <div>
            <button className={classes.action_btn}>START</button>
          </div>
        </div>
        <div className={classes.counter}>#1</div>
        <footer>Time to Focus!</footer>
      </div>
    </div>
  );
};

export default Timer;
