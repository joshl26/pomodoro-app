import classes from "./Timer.module.css";
import Progress from "./Progress";
import SecondaryButtons from "./SecondaryButtons";
import { useState } from "react";
import CountdownTimer from "./CountDownTimer";
import { initialData } from "./InitialData";

const Timer = ({ activeChange }) => {
  const [time, setTime] = useState("25");
  const [value, setValue] = useState("25:00");
  const [active, setActive] = useState("1");
  const [timer, setTimer] = useState(false);

  const progress = "20%";

  const setTimeHandler = (props) => {
    setTime(props);
    console.log(props);
  };

  const setActiveHandler = (props) => {
    setActive(props);
    console.log(props);
    activeChange(props);
  };

  const setValueHandler = (props) => {
    setValue(props);
    console.log(props);
  };

  const setTimerHandler = (props) => {
    console.log(props);
    setTimer(!timer);
    console.log(timer);
  };

  const THREE_DAYS_IN_MS = time * 60 * 1000;
  const NOW_IN_MS = new Date().getTime();

  const dateTimeAfterThreeDays = NOW_IN_MS + THREE_DAYS_IN_MS;

  return (
    <div>
      <Progress percent={progress} />
      <div className={classes.spacer} />
      <div className={classes.container}>
        <div className={classes.content}>
          <SecondaryButtons
            timeChange={setTimeHandler}
            valueChange={setValueHandler}
            activeChange={setActiveHandler}
            active={active}
          />
          <div className={classes.time}>
            {timer === true ? (
              <CountdownTimer targetDate={dateTimeAfterThreeDays} />
            ) : (
              <>{value}</>
            )}
          </div>

          <div>
            <button
              className={
                active === "1"
                  ? `${classes.action_btn1}`
                  : `${classes.action_btn1_active}` && active === "2"
                  ? `${classes.action_btn2}`
                  : `${classes.action_btn2_active}` && active === "3"
                  ? `${classes.action_btn3}`
                  : `${classes.action_btn3_active}`
              }
              onClick={setTimerHandler}
            >
              {timer === false ? "START" : "RESET"}
            </button>
          </div>
        </div>
        {/* <div className={classes.counter}>
          {"Current Time: " + time}
          <br />
          <br />

          {"Active ID: " + active}
          <br />
          <br />

          {"Timer State: " + timer}
          <br />
          <br />
        </div> */}
        <footer></footer>
      </div>
    </div>
  );
};

export default Timer;
