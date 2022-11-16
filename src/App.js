import classes from "./App.module.css";
import Header from "./components/Header";
import Timer from "./components/Timer";

function App() {
  return (
    <div className={classes.container}>
      <Header />
      <div className={classes.content}>
        <Timer />
      </div>
    </div>
  );
}

export default App;
