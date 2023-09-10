import classes from "./Help.module.css";

import howToImage from "../assets/Pomodore_Technique.png";

import { Container } from "react-bootstrap";

const Help = () => {
  return (
    <>
      <h1 className={classes.textalign_center}>Help</h1>
      <div className={classes.spacer}> </div>

      <Container className={classes.align_center}>
        <img
          alt="
  
  How to use this pomodoro timer.
  
  What is the pomodoro technique?
  The pomodoro technique is a method for staying focused and mentally fresh.
  
  How to use this Pomodoro timer app: 
  Step 1 - Pick a task.
  Step 2 - Start a 25 minute timer (aka pomodoro).
  Step 3 - Work on your task.
  Step 4 - Start a 5 minute break (aka short break).
  Step 5 - Every four pomodoros take a 15-30 min break (aka long break).
  Repeat cycle from step 1.

  All the timers cans be set from the Settings page. 

  Turning on auto-break will automatically cycle through the timers in the pattern mentioned above. 
  
  "
          className={classes.howto_image}
          src={howToImage}
        ></img>
      </Container>
    </>
  );
};

export default Help;
