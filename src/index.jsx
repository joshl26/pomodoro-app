import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./layout";
import store from "./store/store";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <HelmetProvider>
        <Provider store={store}>
          <BrowserRouter basename="/pomodor">
            <App />
          </BrowserRouter>
        </Provider>
      </HelmetProvider>
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element");
}
