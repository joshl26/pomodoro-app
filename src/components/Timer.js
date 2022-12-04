import classes from "./Timer.module.css";
import SecondaryButtons from "./SecondaryButtons";
import { useState } from "react";
import CountdownTimer from "./CountDownTimer";
import Container from "react-bootstrap/esm/Container";

import { useSelector } from "react-redux";

const Timer = () => {
  const [time, setTime] = useState("25");
  const [value, setValue] = useState("25:00");
  const [timer, setTimer] = useState(false);

  const timeMode = useSelector((state) => state.settings.timermode);

  // const dispatch = useDispatch();

  const setTimeHandler = (props) => {
    setTime(props);
    // console.log(props);
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
      <Container>
        <div className={classes.content}>
          <SecondaryButtons
            timeChange={setTimeHandler}
            valueChange={setValueHandler}
            active={timeMode}
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
                timer === false && timeMode === "1"
                  ? `${classes.action_btn1}`
                  : `${classes.action_btn1_active}` &&
                    timer === false &&
                    timeMode === "2"
                  ? `${classes.action_btn2}`
                  : `${classes.action_btn2_active}` &&
                    timer === false &&
                    timeMode === "3"
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
      </Container>
    </div>
  );
};

export default Timer;
