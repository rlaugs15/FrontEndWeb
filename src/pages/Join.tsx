import { useForm } from "react-hook-form";
import { btnBase } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import useMutation from "../hooks/useMutation";
import { useEffect, useState } from "react";

/* interface User {
  loginId: string;
  password: string;
  passwordConfirm?: string;
  firstName: string;
  lastName?: string;
  gender: string;
  nickname: string;
  birthDay: string;
  email?: string;
}

const users: User[] = [
  {
    loginId: "rlaugs15@naver.com",
    password: "rlaguswns123!!",
    firstName: "현준",
    lastName: "김",
    gender: "남자",
    nickname: "Bam",
    birthDay: "941234",
    email: "rlaugs15@google.com",
  },
]; */

interface IJoinForm {
  email: string;
  nickname: string;
  password: string;
  password2: string;
  token?: string;
}

export interface MutationResult {
  code: number; //반환 성공 여부를 임의로 설정
  message?: string;
  dadt?: string | null;
}

function Join() {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<IJoinForm>();

  const nav = useNavigate();
  const onHomeClick = () => {
    nav("/");
  };

  const [emailCheck, { data: emailCheckData, loading: emailCheckLoading }] =
    useMutation<MutationResult>("/api/v1/member/verify-authCode");
  const [cofirmEmail, setCofirmEmail] = useState(false);

  const [tokenConfirm, { data: tokenData, loading: tokenLoading }] =
    useMutation<MutationResult>("/api/users/token");
  const [cofirmToken, setCofirmToken] = useState(false);

  const [
    nicknameCheck,
    { data: nicknameCheckData, loading: nicknameCheckLoading },
  ] = useMutation<MutationResult>("/api/users");
  const [cofirmNickname, setCofirmNickname] = useState(false);

  //email버튼을 클릭 후 서버의 이메일과 일치하는지 체크
  const onEmailConfirm = async () => {
    if (emailCheckLoading) return;
    const email = getValues("email");
    await emailCheck({ email });
  };
  useEffect(() => {
    if (emailCheckData?.code === 400) {
      setError("email", { message: emailCheckData?.message });
      setValue("token", "");
      setCofirmToken(false);
      setCofirmEmail(false);
    } else if (emailCheckData) {
      setCofirmEmail(true);
      clearErrors("email");
    }
  }, [emailCheckData, setError]);

  //토큰 인증 체크
  const onTokenConfirm = async () => {
    const token = getValues("token");
    if (tokenLoading) return;
    await tokenConfirm({ token });
  };
  useEffect(() => {
    if (tokenData?.code === 400) {
      setCofirmToken(false);
      setError("token", { message: tokenData?.message });
    } else if (tokenData?.code === 200) {
      setCofirmEmail(false);
      setCofirmToken(true);
    }
  }, [tokenData, setError]);

  //닉네임 중복 확인
  const onNicknameConfirm = async () => {
    const nickname = getValues("nickname");
    if (nickname.length > 5) {
      setCofirmNickname(false);
      setError("nickname", { message: "최대 5자까지 입력 가능합니다." });
      return;
    }
    if (nicknameCheckLoading) return;
    await nicknameCheck({ nickname });
  };
  useEffect(() => {
    if (nicknameCheckData?.code === 403) {
      setCofirmNickname(false);
      setError("nickname", { message: nicknameCheckData?.message });
    } else if (nicknameCheckData?.code === 200) {
      setCofirmNickname(true);
      clearErrors("nickname");
    }
  }, [nicknameCheckData, setError]);

  //회원가입 승인
  const buttonReady = cofirmNickname && !cofirmEmail && cofirmToken;
  const [join, { data: joinData, loading: joinLoading }] =
    useMutation<MutationResult>("/api/users/join");
  const onJoinSubmit = ({
    email,
    nickname,
    password,
    password2,
  }: IJoinForm) => {
    if (!buttonReady) return;
    if (password !== password2) {
      setError("password2", { message: "비밀번호가 일치하지 않습니다." });
      return;
    }
    if (joinLoading) return;

    join({ email, nickname, password, password2 });
  };
  useEffect(() => {
    if (joinData?.code === 401) {
      //401페이지로 이동
    } else if (joinData?.code === 200) {
      nav("/");
    }
  }, [joinData, nav]);
  return (
    <div>
      <header className="grid grid-cols-3 py-3 bg-purple-300 px-7">
        <div />
        <span className="text-3xl font-semibold text-center">회원가입</span>
        <button
          onClick={() => onHomeClick()}
          className="font-semibold text-end"
        >
          홈
        </button>
      </header>
      <main className="flex items-center justify-center h-screen ">
        <form
          onSubmit={handleSubmit(onJoinSubmit)}
          className="flex flex-col bg-purple-100 w-[800px] p-3"
        >
          <label className="font-semibold" htmlFor="email">
            이메일:{" "}
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </label>
          <div className="mb-16 space-x-2">
            <input
              {...register("email", { required: true })}
              className="w-5/6 h-9"
              id="email"
              type="email"
              required
              placeholder="이메일을 입력해주세요."
            />
            <button onClick={onEmailConfirm} className={`${btnBase}`}>
              이메일 확인
            </button>
          </div>
          {cofirmEmail ? (
            <>
              <label className="font-semibold" htmlFor="token">
                토큰:{" "}
                {errors.token && (
                  <span className="text-red-500">{errors.token.message}</span>
                )}
              </label>
              <div className="mb-16 space-x-2">
                <input
                  {...register("token", { required: true })}
                  className="w-3/6 h-9"
                  id="token"
                  type="password"
                  required
                  placeholder="토큰을 입력해주세요."
                />
                <button
                  onClick={onTokenConfirm}
                  className={`${btnBase} bg-white`}
                >
                  토큰 확인
                </button>
              </div>
            </>
          ) : null}
          {cofirmToken ? (
            <span className="mb-16 font-semibold">
              토큰 인증이 완료되었습니다.
            </span>
          ) : null}
          <label className="font-semibold" htmlFor="nickname">
            닉네임:{" "}
            {errors.nickname && (
              <span className="text-red-500">{errors.nickname.message}</span>
            )}
            {cofirmNickname && <span>사용할 수 있는 닉네임입니다.</span>}
          </label>
          <div className="mb-16 space-x-2">
            <input
              {...register("nickname", {
                required: "닉네임은 필수 항목입니다.",
                maxLength: {
                  value: 5,
                  message: "닉네임은 최대 5자까지 입력 가능합니다.",
                },
              })}
              className="w-3/6 h-9"
              id="nickname"
              type="text"
              required
              placeholder="닉네임을 5자 이하로 입력해주세요."
            />
            <button onMouseDown={onNicknameConfirm} className={`${btnBase}`}>
              닉네임 중복 확인
            </button>
          </div>
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
            placeholder="비밀번호 입력(영문자, 숫자, 특수문자 포함 8-20자)"
          />

          <label className="font-semibold" htmlFor="pass2">
            비밀번호 확인:{" "}
            {errors?.password2 && (
              <span className="w-full mb-3 text-center text-red-500">
                {errors.password2.message}
              </span>
            )}
          </label>
          <input
            {...register("password2", {
              required: "비밀번호 확인은 필수 항목입니다.",
            })}
            className="mb-24 h-9"
            id="pass2"
            type="password"
            required
            placeholder="비밀번호 재입력"
          />
          {buttonReady ? (
            <button className={`${btnBase} py-2 font-semibold text-2xl mx-24`}>
              가입
            </button>
          ) : (
            <abbr
              title="이메일, 닉네임 인증을 완료해주세요."
              className="py-2 mx-24 text-2xl font-semibold text-center rounded-sm text-slate-500 bg-slate-300"
            >
              가입(이메일, 닉네임 인증 필수)
            </abbr>
          )}
        </form>
      </main>
    </div>
  );
}

export default Join;
