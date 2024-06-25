import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router.tsx";
import { RecoilRoot } from "recoil";
import { SWRConfig } from "swr";
import tokenInstance from "./tokenInstance.ts";

async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }

  const { worker } = await import("./mocks/browser");
  return worker.start();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <RecoilRoot>
        <SWRConfig
          value={{
            fetcher: (url: string) =>
              tokenInstance.get(url).then((res) => res.data),
          }}
        >
          <RouterProvider router={router} />
        </SWRConfig>
      </RecoilRoot>
    </React.StrictMode>
  );
});
