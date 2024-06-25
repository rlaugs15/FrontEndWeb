import { useForm } from "react-hook-form";
import { btnBase } from "../utils/utils";
import { Link, useNavigate } from "react-router-dom";
import useMutation from "../hooks/useMutation";
import { useEffect } from "react";
import { MutationResult } from "./Join";

interface ILoginForm {
  loginId: string;
  password: string;
}

interface LoginResponse extends MutationResult {
  data: {
    token: string;
    refreshToken: string;
  };
}

function Login() {
  const nav = useNavigate();
  const onHomeClick = () => {
    nav("/");
  };
  const [login, { data: loginData, loading: loginLoading }] =
    useMutation<LoginResponse>("/api/v1/login");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ILoginForm>();

  const onLoginSubmit = async (data: ILoginForm) => {
    if (loginLoading) return;
    await login(data);
  };
  useEffect(() => {
    if (loginData?.code !== 200) {
      setError("loginId", { message: loginData?.message });
    } else if (loginData?.code === 200 && loginData?.data?.token) {
      console.log("loginData", loginData);
      localStorage.setItem("accessToken", loginData?.data?.token);
      nav("/");
    }
  }, [loginData, nav, setError]);
  return (
    <div>
      <header className="grid grid-cols-3 py-3 bg-purple-300 px-7">
        <div />
        <span className="text-3xl font-semibold text-center">로그인</span>
        <button onClick={onHomeClick} className="font-semibold text-end">
          홈
        </button>
      </header>
      <main className="flex flex-col items-center justify-center h-screen space-y-3">
        <form
          onSubmit={handleSubmit(onLoginSubmit)}
          className="flex flex-col bg-purple-100 w-[800px] p-3"
        >
          <label className="font-semibold" htmlFor="loginId">
            이메일:
          </label>
          <input
            {...register("loginId", { required: true, maxLength: 255 })}
            className="mb-16 h-9"
            id="loginId"
            type="email"
            required
            placeholder="이메일을 입력해주세요."
          />

          <label className="font-semibold" htmlFor="pass">
            비밀번호:{" "}
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
          </label>
          <input
            {...register("password", {
              required: "비밀번호는 필수 항목입니다.",
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,20}$/,
                message:
                  "비밀번호는 8-20자 이내여야 하며, 영문자, 숫자, 특수문자를 포함해야 합니다.",
              },
            })}
            className="mb-16 h-9"
            id="pass"
            type="password"
            required
            placeholder="비밀번호를 입력해주세요."
          />
          {errors.loginId && (
            <span className="text-center text-red-500">
              {errors.loginId.message}
            </span>
          )}
          <button className={`${btnBase} py-2 font-semibold text-2xl mx-24`}>
            로그인
          </button>
        </form>
        <div className="flex w-[800px] justify-between">
          <Link to={"/join"}>
            <button className={`${btnBase}`}>회원가입</button>
          </Link>
          <section className="space-x-2">
            <Link to={"searchEmail"}>
              <button className={`${btnBase}`}>이메일 찾기</button>
            </Link>
            <Link to={"searchPass"}>
              <button className={`${btnBase}`}>임시 비밀번호 전송</button>
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Login;
