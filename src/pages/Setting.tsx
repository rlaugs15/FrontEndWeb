import { Link } from "react-router-dom";
import useUser from "../hooks/useUser";

function Setting() {
  const { user } = useUser();
  return (
    <ol className="flex flex-col w-40 p-1 space-y-5">
      {user ? (
        <li className="border-t-2 border-slate-300">
          <header className="text-lg font-semibold">회원정보</header>
          <Link to={"/userProfile/editProfile"}>
            <button className="w-full bg-red-300">회원정보 수정</button>
          </Link>
          <Link to={"/userProfile/deleteProfile"}>
            <button className="w-full bg-red-300">회원탈퇴</button>
          </Link>
        </li>
      ) : null}
      <li className="border-t-2 border-slate-300">메뉴1</li>
      <li className="border-t-2 border-slate-300">메뉴1</li>
      <li className="border-t-2 border-slate-300">메뉴1</li>
    </ol>
  );
}

export default Setting;
