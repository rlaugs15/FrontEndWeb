import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./Router.tsx";
import { RecoilRoot } from "recoil";
import { SWRConfig } from "swr";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RecoilRoot>
      <SWRConfig
        value={{
          fetcher: (url: string) =>
            fetch(url).then((response) => response.json()),
        }}
      >
        <RouterProvider router={router} />
      </SWRConfig>
    </RecoilRoot>
  </React.StrictMode>
);
