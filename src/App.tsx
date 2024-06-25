import { Outlet, useMatch } from "react-router-dom";
import SearchEmail from "./pages/SearchEmail";
import SearchPass from "./pages/SearchPass";
import Setting from "./pages/Setting";
import { useRecoilValue } from "recoil";
import { settingStateAtom } from "./atoms";

function App() {
  const settingState = useRecoilValue(settingStateAtom);
  const searchEmail = useMatch("/login/searchEmail");
  const searchPass = useMatch("/login/searchPass");
  return (
    <>
      <div className="flex h-screen">
        {settingState ? <Setting /> : null}
        <section className="w-full">
          <Outlet />
        </section>
      </div>
      {searchEmail ? <SearchEmail /> : null}
      {searchPass ? <SearchPass /> : null}
    </>
  );
}

export default App;
