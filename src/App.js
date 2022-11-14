import logo from "./logo.svg";
import classes from "./App.module.css";
import Header from "./components/Header";

function App() {
  return (
    <div className={classes.container}>
      <Header />
    </div>
  );
}

export default App;
