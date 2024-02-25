import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./App.tsx";

// css imports
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";

// Create a react query client
const queryClient = new QueryClient();

// app root
const app_root = (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
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
