import classes from "./Timer.module.css";
import Progress from "./Progress";

import { POMODORO, LONG_BREAK, SHORT_BREAK } from "../constants";

const SecondaryButton = ({ label }) => {
  return <button onClick={onClick}>{label}</button>;
};

const onClick = () => {
  console.log("TEST");
};

const progress = "20%";

const initialState = {
  modes: {
    [POMODORO]: {
      id: POMODORO,
      label: "Pomodoro",
      time: 25,
    },
    [SHORT_BREAK]: {
      id: SHORT_BREAK,
      label: "Short Break",
      time: 5,
    },
    [LONG_BREAK]: {
      id: LONG_BREAK,
      label: "Long Break",
      time: 15,
    },
  },
};

const Timer = () => {
  return (
    <div>
      <Progress percent={progress} />
      <div className={classes.container}>
        <div className={classes.content}>
          <ul>
            <SecondaryButton label={"POMO"} />
            <button className={classes.btn_secondary_active}>Pomodoro</button>
            <button className={classes.btn_secondary}>Short Break</button>
            <button className={classes.btn_secondary}>Long Break</button>
          </ul>
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
