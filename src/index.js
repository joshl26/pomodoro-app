import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Importing the Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";

import Settings from "./components/Settings";

// function Main() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<App />}></Route>
//         <Route path="/settings" element={<Settings />}></Route>
//       </Routes>
//     </Router>
//   );
// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
