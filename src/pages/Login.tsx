import { useForm } from "react-hook-form";
import { btnBase } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import useMutation from "../hooks/useMutation";
import { MutationResult } from "./Join";
import { useEffect } from "react";

interface ILoginForm {
  email: string;
  password: string;
}

function Login() {
  const nav = useNavigate();
  const onHomeClick = () => {
    nav("/");
  };
  const [login, { data: loginData, loading: loginLoading }] =
    useMutation<MutationResult>("/api/users");
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
    if (loginData?.code === 400) {
      setError("email", { message: loginData?.message });
    } else if (loginData) {
      nav("/");
    }
  }, [loginData, nav]);
  return (
    <div>
      <header className="grid grid-cols-3 py-3 bg-purple-300 px-7">
        <div />
        <span className="text-3xl font-semibold text-center">로그인</span>
        <button onClick={onHomeClick} className="font-semibold text-end">
          홈
        </button>
      </header>
      <main className="flex items-center justify-center h-screen ">
        <form
          onSubmit={handleSubmit(onLoginSubmit)}
          className="flex flex-col bg-purple-100 w-[800px] p-3"
        >
          <label className="font-semibold" htmlFor="email">
            이메일:
          </label>
          <input
            {...register("email", { required: true })}
            className="mb-16 h-9"
            id="email"
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
          {errors.email && (
            <span className="text-center text-red-500">
              {errors.email.message}
            </span>
          )}
          <button className={`${btnBase} py-2 font-semibold text-2xl mx-24`}>
            로그인
          </button>
        </form>
      </main>
    </div>
  );
}

export default Login;
