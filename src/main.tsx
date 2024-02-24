import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const app_root = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// dynamically importing the worker and starting it
async function enableMocking() {
  const { worker } = await import("./mocks/browser");

  return worker.start();
}

// when mock api is ready, render the app
enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(app_root);
});
