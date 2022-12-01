import classes from "./Settings.module.css";

const Settings = () => {
  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <h3 className={classes.card_text}>SETTINGS</h3>

        <div className={classes.divider}></div>
        <div className={classes.spacer_small}></div>
        <h4 className={classes.card_text}>Time (minutes) </h4>
        <div className={classes.flex_container}>
          <div className={classes.flex_cell}>
            <p className={classes.card_text}>Pomodoro</p>
            <div></div>
          </div>
          <div className={classes.flex_cell}>
            <p className={classes.card_text}>Short Break</p>
          </div>
          <div className={classes.flex_cell}>
            <p className={classes.card_text}>Long Break</p>
          </div>
        </div>
        <div className={classes.divider}></div>
      </div>
    </div>
  );
};

export default Settings;
