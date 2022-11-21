import classes from "./Timer.module.css";
import SecondaryButtons from "./SecondaryButtons";
import { useState } from "react";
import CountdownTimer from "./CountDownTimer";

const Timer = ({ activeChange }) => {
  const [time, setTime] = useState("25");
  const [value, setValue] = useState("25:00");
  const [active, setActive] = useState("1");
  const [timer, setTimer] = useState(false);

  const setTimeHandler = (props) => {
    setTime(props);
    // console.log(props);
  };

  const setActiveHandler = (props) => {
    setActive(props);
    // console.log(props);
    activeChange(props);
  };

  const setValueHandler = (props) => {
    setValue(props);
    // console.log(props);
  };

  const setTimerHandler = (props) => {
    // console.log(props);
    setTimer(!timer);
    // console.log(timer);
  };

  const totalTimeMS = time * 60 * 1000;
  const NOW_IN_MS = new Date().getTime();

  const dateTimeAfterThreeDays = NOW_IN_MS + totalTimeMS;

  return (
    <div>
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
              <CountdownTimer
                targetDate={dateTimeAfterThreeDays}
                time={totalTimeMS}
              />
            ) : (
              <>{value}</>
            )}
          </div>

          <div>
            <button
              className={
                timer === false && active === "1"
                  ? `${classes.action_btn1}`
                  : `${classes.action_btn1_active}` &&
                    timer === false &&
                    active === "2"
                  ? `${classes.action_btn2}`
                  : `${classes.action_btn2_active}` &&
                    timer === false &&
                    active === "3"
                  ? `${classes.action_btn3}`
                  : `${classes.action_btn3_active}`
              }
              onClick={setTimerHandler}
            >
              {timer === false ? "START" : "STOP"}
            </button>
          </div>
        </div>
        <footer></footer>
      </div>
    </div>
  );
};

export default Timer;
