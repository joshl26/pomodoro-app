import classes from "./Timer.module.css";
import Progress from "./Progress";

const progress = "20%";

const Timer = () => {
  return (
    <div>
      <Progress percent={progress} />
      <div className={classes.container}>
        <div className={classes.content}>
          <ul>
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
