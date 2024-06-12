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
  loginId: string;
  password: string;
  passwordConfirm?: string;
  firstName: string;
  lastName?: string;
  gender: string;
  nickname: string;
  birthDay: string;
  email?: string;
  authCode: string;
}

export interface MutationResult {
  code?: number; //일단 수정대기, 쓰이지 않으면 삭제할 것
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
    useMutation<MutationResult>("/api/v1/member/send-authCode");
  const [cofirmEmail, setCofirmEmail] = useState(false);

  const [authCodeCheck, { data: authCodeData, loading: authCodeLoading }] =
    useMutation<MutationResult>("/api/v1/member/verify-authCode");
  const [cofirmAuthCode, setCofirmAuthCode] = useState(false);

  const [
    nicknameCheck,
    { data: nicknameCheckData, loading: nicknameCheckLoading },
  ] = useMutation<MutationResult>("/api/v1/member/me");
  const [cofirmNickname, setCofirmNickname] = useState(false);

  //email버튼을 클릭하고 사용가능 이메일 여부 체크
  //가입된 이메일 존재하는지 체크? 서버에서 체크하는게 좋을듯
  const onEmailConfirm = async () => {
    if (emailCheckLoading) return;
    const email = getValues("email");
    await emailCheck({ email });
    setCofirmAuthCode(false);
  };
  useEffect(() => {
    if (emailCheckData?.code !== 200) {
      setError("email", { message: emailCheckData?.message });
      setValue("authCode", "");
      setCofirmAuthCode(false);
      setCofirmEmail(false);
    } else if (emailCheckData?.code === 200) {
      setCofirmEmail(true);
      clearErrors("email");
    }
  }, [emailCheckData, setError]);

  //인증코드 체크
  const onauthCodeCheck = async () => {
    const email = getValues("email");
    const authCode = getValues("authCode");
    if (authCodeLoading) return;
    await authCodeCheck({ email, authCode });
    setValue("authCode", "");
  };
  useEffect(() => {
    if (authCodeData?.code !== 200) {
      setCofirmAuthCode(false);
      setError("authCode", { message: authCodeData?.message });
    } else if (authCodeData?.code === 200) {
      setCofirmEmail(false);
      setCofirmAuthCode(true);
    }
  }, [authCodeData, setError]);

  //닉네임 중복 확인
  //중복체크 api가 없음
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
    if (nicknameCheckData?.code !== 200) {
      setCofirmNickname(false);
      setError("nickname", { message: nicknameCheckData?.message });
    } else if (nicknameCheckData?.code === 200) {
      setCofirmNickname(true);
      clearErrors("nickname");
    }
  }, [nicknameCheckData, setError]);

  //회원가입 승인
  const buttonReady = cofirmNickname && !cofirmEmail && cofirmAuthCode;
  const [join, { data: joinData, loading: joinLoading }] =
    useMutation<MutationResult>("/api/v1/member/join");
  const onJoinSubmit = ({
    email,
    nickname,
    password,
    passwordConfirm,
  }: IJoinForm) => {
    if (!buttonReady) return;
    if (password !== passwordConfirm) {
      setError("passwordConfirm", { message: "비밀번호가 일치하지 않습니다." });
      return;
    }
    if (joinLoading) return;

    join({ email, nickname, password, passwordConfirm });
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
                인증코드:{" "}
                {errors.authCode && (
                  <span className="text-red-500">
                    {errors.authCode.message}
                  </span>
                )}
              </label>
              <div className="mb-16 space-x-2">
                <input
                  {...register("authCode", { required: true })}
                  className="w-3/6 h-9"
                  id="token"
                  type="password"
                  required
                  placeholder="토큰을 입력해주세요."
                />
                <button
                  onClick={onauthCodeCheck}
                  className={`${btnBase} bg-white`}
                >
                  인증코드 확인
                </button>
              </div>
            </>
          ) : null}
          {cofirmAuthCode ? (
            <span className="mb-16 font-semibold">
              이메일 인증이 완료되었습니다.
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
          <label className="font-semibold" htmlFor="first">
            이름:{" "}
            {errors.firstName && (
              <span className="text-red-500">{errors.firstName.message}</span>
            )}
          </label>
          <input
            {...register("firstName", {
              required: true,
            })}
            className="mb-16 h-9"
            id="first"
            required
            placeholder="이름은 필수 항목입니다."
          />
          <label className="font-semibold" htmlFor="last">
            성:
          </label>
          <input
            {...register("lastName", {
              required: true,
            })}
            className="mb-16 h-9"
            id="last"
            required
            placeholder="이름을 입력해주세요."
          />
          <fieldset>
            <legend>성별</legend>

            <input type="radio" id="male" />
            <label htmlFor="male">남성</label>
            <br />

            <input type="radio" id="female" />
            <label htmlFor="female">여성</label>
            <br />
          </fieldset>
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
            {errors?.passwordConfirm && (
              <span className="w-full mb-3 text-center text-red-500">
                {errors.passwordConfirm.message}
              </span>
            )}
          </label>
          <input
            {...register("passwordConfirm", {
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
