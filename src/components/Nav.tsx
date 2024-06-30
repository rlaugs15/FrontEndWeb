import { Link, useMatch, useNavigate } from "react-router-dom";
import { btnBase, cls } from "../utils/utils";
import useUser from "../hooks/useUser";
import useMutation from "../hooks/useMutation";
import { useSetRecoilState } from "recoil";
import { settingStateAtom } from "../atoms";
import { MutationResult } from "../pages/Join";
import { mutate } from "swr";
import { logout } from "../tokenInstance";

function Nav() {
  const { user } = useUser();

  const [logoutMutaion] = useMutation<MutationResult>("/auth/logout");

  const setSetting = useSetRecoilState(settingStateAtom);
  const nav = useNavigate();
  const onLoginClick = () => {
    nav("/login");
  };
  const onJoinClick = () => {
    nav("/join");
  };
  const onLogoutClick = async () => {
    await logoutMutaion({});
    await logout();
    mutate("/member", null, { revalidate: false });

    nav("/");
  };

  const onOpenSettingClick = () => {
    setSetting((prev) => !prev);
  };
  const match = useMatch("/");
  return (
    <nav className="flex items-center bg-purple-300">
      <section className="flex space-x-2">
        <button onClick={onOpenSettingClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </button>
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
            />
          </svg>
        </button>
      </section>
      <section className="grid w-full grid-cols-3 px-6 py-2">
        <Link to={"/"}>
          <button className="text-3xl font-semibold focus-in-expand">
            Alle
          </button>
        </Link>

        <section
          className={cls(
            "flex justify-center items-center space-x-3",
            match ? "scale-in-center" : ""
          )}
        >
          <Link to={"/"} className="transition duration-300 hover:scale-150">
            홈
          </Link>
          <Link
            to={"/board"}
            className="transition duration-300 hover:scale-150"
          >
            게시판
          </Link>
          <button className="transition duration-300 hover:scale-150">
            목록2
          </button>
          <button className="transition duration-300 hover:scale-150">
            목록3
          </button>
          <button className="transition duration-300 hover:scale-150">
            목록4
          </button>
        </section>
        <div className="flex justify-end space-x-3 ">
          {user?.id ? (
            <>
              <button onClick={onLogoutClick} className={btnBase}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button onClick={onLoginClick} className={btnBase}>
                로그인
              </button>
              <button onClick={onJoinClick} className={btnBase}>
                회원가입
              </button>
            </>
          )}
        </div>
      </section>
    </nav>
  );
}

export default Nav;
