import { useState } from "react";
import classes from "./SecondaryButtons.module.css";

const SecondaryButtons = () => {
  const [active, setActive] = useState("");

  const handleClick = (event) => {
    setActive(event.target.id);
  };

  return (
    <div className={classes.container}>
      <button
        key={1}
        className={active === "1" ? `${classes.active}` : undefined}
        id={"1"}
        onClick={handleClick}
      >
        Pomodoro
      </button>

      <button
        key={2}
        className={active === "2" ? `${classes.active}` : undefined}
        id={"2"}
        onClick={handleClick}
      >
        Short Break
      </button>

      <button
        key={3}
        className={active === "3" ? `${classes.active}` : undefined}
        id={"3"}
        onClick={handleClick}
      >
        Long Break
      </button>
    </div>
  );
};

export default SecondaryButtons;
