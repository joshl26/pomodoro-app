import { useState } from "react";
import classes from "./SecondaryButtons.module.css";

const SecondaryButtons = ({ timeChange, activeChange }) => {
  // const handleClick = (event) => {
  //   stateChanger(event.target.value);
  //   stateChanger1(event.target.id);
  // };

  function handleClick(event) {
    timeChange(event.target.value);
    activeChange(event.target.id);
  }

  const active = "1";

  return (
    <div className={classes.container}>
      <button
        value={"25:00"}
        key={1}
        className={
          active === "1"
            ? `${classes.active} ${classes.btn_secondary}`
            : `${classes.btn_secondary}`
        }
        id={"1"}
        onClick={handleClick}
      >
        Pomodoro
      </button>

      <button
        value={"15:00"}
        key={2}
        className={
          active === "2"
            ? `${classes.active} ${classes.btn_secondary}`
            : `${classes.btn_secondary}`
        }
        id={"2"}
        onClick={handleClick}
      >
        Short Break
      </button>

      <button
        value={"30:00"}
        key={3}
        className={
          active === "3"
            ? `${classes.active} ${classes.btn_secondary}`
            : `${classes.btn_secondary}`
        }
        id={"3"}
        onClick={handleClick}
      >
        Long Break
      </button>
    </div>
  );
};

export default SecondaryButtons;
