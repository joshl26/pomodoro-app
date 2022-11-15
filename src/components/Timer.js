import classes from "./Timer.module.css";
import Progress from "./Progress";

const progress = "20%";

const Timer = () => {
  return (
    <div>
      <Progress percent={progress} />
      <div className={classes.container}>
        <div className={classes.content}>
          <ul>{/* TODO */}</ul>
        </div>
      </div>
    </div>
  );
};

export default Timer;
