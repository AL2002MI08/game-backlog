import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";

async function deferRender() {
  const { worker } = await import("@/mocks/mockServer.browser");
  return worker.start();
}

deferRender().then(() => {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
  );
});
