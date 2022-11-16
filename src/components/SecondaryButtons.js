import { useState } from "react";
import classes from "./SecondaryButtons.module.css";

const SecondaryButtons = () => {
  const [active, setActive] = useState("1");

  const handleClick = (event) => {
    setActive(event.target.id);
  };

  return (
    <div className={classes.container}>
      <button
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
