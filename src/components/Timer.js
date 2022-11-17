import classes from "./Timer.module.css";
import Progress from "./Progress";
import SecondaryButtons from "./SecondaryButtons";
import { useState } from "react";

const Timer = () => {
  const [time, setTime] = useState("25");
  const [value, setValue] = useState("25:00");
  const [active, setActive] = useState("1");
  const [timer, setTimer] = useState(false);

  const setTimeHandler = (props) => {
    setTime(props);
    console.log(props);
  };

  const setActiveHandler = (props) => {
    setActive(props);
    console.log(props);
  };

  const setValueHandler = (props) => {
    setValue(props);
    console.log(props);
  };

  const progress = "20%";

  return (
    <div>
      <Progress percent={progress} />
      <div className={classes.container}>
        <div className={classes.content}>
          <SecondaryButtons
            timeChange={setTimeHandler}
            valueChange={setValueHandler}
            activeChange={setActiveHandler}
            active={active}
          />
          <div className={classes.time}>{value}</div>
          <div>
            <button className={classes.action_btn}>START</button>
          </div>
        </div>
        <div className={classes.counter}>
          {"Current Time: " + time}
          <br />
          <br />

          {"Active ID: " + active}
          <br />
          <br />
        </div>
        <footer>Time to Focus!</footer>
      </div>
    </div>
  );
};

export default Timer;
