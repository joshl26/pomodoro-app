import classes from "./SecondaryButtons.module.css";
import { initialData } from "./InitialData";

const SecondaryButtons = ({
  timeChange,
  valueChange,
  activeChange,
  active,
}) => {
  // const handleClick = (event) => {
  //   stateChanger(event.target.value);
  //   stateChanger1(event.target.id);
  // };

  function handleClick(props) {
    // console.log(props.target.name);
    timeChange(props.target.name);
    valueChange(props.target.value);
    activeChange(props.target.id);
  }

  return (
    <div className={classes.container}>
      <button
        value={initialData[0].value}
        id={initialData[0].id}
        name={initialData[0].timer} //using name attribute to hold timer value
        className={
          active === initialData[0].id
            ? `${classes.btn_secondary_active}`
            : `${classes.btn_secondary}`
        }
        onClick={handleClick}
      >
        {initialData[0].label}
      </button>

      <button
        value={initialData[1].value}
        id={initialData[1].id}
        name={initialData[1].timer} //using name attribute to hold timer value
        className={
          active === initialData[1].id
            ? `${classes.btn_secondary_active}`
            : `${classes.btn_secondary}`
        }
        onClick={handleClick}
      >
        {initialData[1].label}
      </button>

      <button
        value={initialData[2].value}
        id={initialData[2].id}
        name={initialData[2].timer} //using name attribute to hold timer value
        className={
          active === initialData[2].id
            ? `${classes.btn_secondary_active}`
            : `${classes.btn_secondary}`
        }
        onClick={handleClick}
      >
        {initialData[2].label}
      </button>
    </div>
  );
};

export default SecondaryButtons;
