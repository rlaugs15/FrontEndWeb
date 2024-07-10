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

class FetchError extends Error {
  info?: any; //에러 메시지나 기타 상세한 정보
  status?: number; //상태코드

  constructor(message: string, info?: any, status?: number) {
    super(message);
    this.info = info;
    this.status = status;
  }
}

//이제 swr의 error 속성에서 error.info와 error.status를 읽을 수 있다
const fetcher = async (url: string) => {
  const res = await tokenInstance.get(url);
  if (!res || res.status !== 200) {
    const error = new FetchError(
      "An error occurred while fetching the data.",
      res.data,
      res.status
    );
    throw error;
  }
  return res.data;
};

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <RecoilRoot>
        <SWRConfig
          value={{
            fetcher,
          }}
        >
          <RouterProvider router={router} />
        </SWRConfig>
      </RecoilRoot>
    </React.StrictMode>
  );
});
