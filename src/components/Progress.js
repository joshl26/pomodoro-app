import classes from "./Progress.module.css";

const Progress = ({ percent }) => {
  return (
    <div className={classes.container}>
      <div className={classes.progress} style={{ width: `${percent}` + "%" }} />
    </div>
  );
};

export default Progress;
