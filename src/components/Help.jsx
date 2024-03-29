import howToImage from "../assets/Pomodore_Technique.png";
import { Container } from "react-bootstrap";
import "./Help.css";

const Help = () => {
  return (
    <div>
      <h1 className="textalign-center">Help</h1>
      <div className="spacer" />
      <Container className="align-center">
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
          className="howto-image"
          src={howToImage}
        ></img>
      </Container>
    </div>
  );
};

export default Help;
