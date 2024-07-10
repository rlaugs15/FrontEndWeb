import { useForm } from "react-hook-form";
import { btnBase } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import useMutation from "../hooks/useMutation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useUser from "../hooks/useUser";

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
  code?: number;
  message?: string;
}

function Join() {
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setFocus,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<IJoinForm>();

  const nav = useNavigate();
  const { user } = useUser();
  useEffect(() => {
    if (user) {
      nav("/");
    }
  }, [user, nav]);

  const onHomeClick = () => {
    nav("/");
  };

  const [emailAuthOpen, setEmailAuthOpen] = useState(false);

  const [emailCheck, setEmailCheck] = useState("");
  const {
    data: emailCheckData,
    isLoading: emailCheckLoading,
    error: emailCheckError,
  } = useSWR<MutationResult>(
    emailCheck ? `/auth/check-email/${emailCheck}` : null,
    {
      dedupingInterval: 0,
    }
  );

  const [cofirmEmail, setCofirmEmail] = useState(false);
  const [
    emailAuth,
    { data: emailAuthData, loading: emailAuthLoading, error: emailAuthError },
  ] = useMutation<MutationResult>("/api/v1/auth/send-code");

  const [authCodeCheck, { data: authCodeData, loading: authCodeLoading }] =
    useMutation<MutationResult>("/api/v1/auth/verify-code");
  const [cofirmAuthCode, setCofirmAuthCode] = useState(false);

  const [nicknameCheck, setNicknameCheck] = useState("");
  const [cofirmNickname, setCofirmNickname] = useState(false);
  const {
    data: nicknameCheckData,
    isValidating: nicknameCheckLoading,
    error: nicknameError,
  } = useSWR<MutationResult>(
    nicknameCheck ? `/auth/check-nickname/${nicknameCheck}` : null,
    {
      dedupingInterval: 0,
    }
  );

  //이메일 중복체크
  const onEmailCheck = (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    const email = getValues("loginId");
    if (emailCheckLoading) return;
    setEmailCheck(email);
  };
  useEffect(() => {
    if (emailCheckError) {
      setError("loginId", { message: "이메일 중복 체크에 실패했습니다." });
      setFocus("loginId");
    }
    if (emailCheckData && emailCheckData.code === 200) {
      setEmailAuthOpen(true);
      clearErrors("loginId");
    }
    setEmailCheck("");
  }, [
    emailCheckData,
    setError,
    clearErrors,
    setFocus,
    setEmailAuthOpen,
    setEmailCheck,
    emailCheckError,
  ]);

  //이메일 인증코드 전송
  const onEmailConfirm = async (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    const email = getValues("loginId");
    if (emailAuthLoading) return;
    setCofirmAuthCode(false);
    await emailAuth({ email });
  };

  useEffect(() => {
    if (emailAuthError) {
      setError("authCode", { message: "인증코드에 대해 실패했습니다." });
      setValue("authCode", "");
      setCofirmAuthCode(false);
      setFocus("loginId");
    }
    if (emailAuthData && emailAuthData.code === 200) {
      clearErrors("loginId");
      setFocus("authCode");
      setCofirmEmail(true);
    }
  }, [
    emailAuthData,
    setError,
    setFocus,
    setValue,
    setCofirmAuthCode,
    setCofirmEmail,
    emailAuthError,
  ]);

  //인증번호 체크
  const onauthCodeCheck = async (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    const email = getValues("loginId");
    const authCode = getValues("authCode");
    if (authCodeLoading) return;
    await authCodeCheck({ email, authCode });
    setValue("authCode", "");
  };
  useEffect(() => {
    if (authCodeData && authCodeData?.code !== 200) {
      setCofirmAuthCode(false);
      setError("authCode", { message: "인증에 실패했습니다." });
    }
    if (authCodeData && authCodeData?.code === 200) {
      setCofirmEmail(false);
      setCofirmAuthCode(true);
      setFocus("nickname");
    }
  }, [
    authCodeData,
    setError,
    setCofirmEmail,
    setCofirmAuthCode,
    setFocus,
    errors,
  ]);

  //닉네임 중복 확인
  const onNicknameConfirm = async (event: { stopPropagation: () => void }) => {
    event.stopPropagation();
    const nickname = getValues("nickname");
    if (nickname.length > 51) {
      setCofirmNickname(false);
      setError("nickname", { message: "최대 50자까지 입력 가능합니다." });
      return;
    }
    if (nicknameCheckLoading) return;
    setNicknameCheck(nickname);
  };
  useEffect(() => {
    if (nicknameError) {
      setCofirmNickname(false);
      setError("nickname", { message: "중복된 닉네임입니다." });
      setNicknameCheck("");
      setFocus("nickname");
    }
    if (nicknameCheckData && nicknameCheckData?.code === 200) {
      setCofirmNickname(true);
      clearErrors("nickname");
      setFocus("firstName");
      setNicknameCheck("");
    }
  }, [
    nicknameCheckData,
    nicknameError,
    setError,
    setFocus,
    setNicknameCheck,
    clearErrors,
    setCofirmNickname,
  ]);

  //회원가입 승인
  const buttonReady = cofirmNickname && !cofirmEmail && cofirmAuthCode;
  const [join, { data: joinData, loading: joinLoading }] =
    useMutation<MutationResult>("/api/v1/join");
  const onJoinSubmit = (data: IJoinForm) => {
    const { password, passwordConfirm } = data;
    if (!buttonReady) return;
    if (password !== passwordConfirm) {
      setError("passwordConfirm", { message: "비밀번호가 일치하지 않습니다." });
      return;
    }
    if (joinLoading) return;

    join(data);
  };
  useEffect(() => {
    if (joinData && joinData?.code !== 200) {
      nav("/errorPage", {
        replace: true,
        state: { code: joinData?.code, message: joinData?.message },
      });
    }
    if (joinData && joinData?.code === 200) {
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
      <main className="relative flex items-center justify-center h-screen top-32">
        <form
          onSubmit={handleSubmit(onJoinSubmit)}
          className="flex flex-col bg-purple-100 w-[800px] p-3"
        >
          <label className="font-semibold" htmlFor="loginId">
            이메일(필수):{" "}
            {errors.loginId && (
              <span className="text-red-500">{errors.loginId.message}</span>
            )}
          </label>
          <div className="mb-16 space-x-2">
            <input
              {...register("loginId", { required: true, maxLength: 255 })}
              className="w-5/6 h-9"
              id="loginId"
              type="email"
              required
              placeholder="이메일을 입력해주세요."
            />
            {!emailAuthOpen ? (
              <button onClick={onEmailCheck} className={`${btnBase}`}>
                중복 확인
              </button>
            ) : (
              <button
                onClick={onEmailConfirm}
                className={`${btnBase} bg-red-500`}
              >
                인증코드 전송
              </button>
            )}
          </div>
          {emailAuthData?.code === 200 && cofirmEmail ? (
            <>
              <label className="font-semibold" htmlFor="authCode">
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
                  id="authCode"
                  type="password"
                  required
                  placeholder="인증코드를 입력해주세요."
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
            닉네임(필수):{" "}
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
                  value: 50,
                  message: "닉네임은 최대 50자까지 입력 가능합니다.",
                },
              })}
              className="w-3/6 h-9"
              id="nickname"
              type="text"
              required
              placeholder="닉네임을 50자 이하로 입력해주세요."
            />
            <button onMouseDown={onNicknameConfirm} className={`${btnBase}`}>
              닉네임 중복 확인
            </button>
          </div>
          <label className="font-semibold" htmlFor="first">
            이름(필수):{" "}
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
            placeholder="성을 입력해주세요."
          />
          <label className="font-semibold" htmlFor="birthDay">
            생년월일(필수):
          </label>
          <input
            {...register("birthDay", {
              required: true,
            })}
            className="mb-16 h-9"
            id="birthDay"
            required
            placeholder="ex)19970107"
          />
          <fieldset className="p-2">
            <legend className="font-semibold">
              성별(필수):{" "}
              {errors.gender && (
                <p className="text-red-500">{errors.gender.message}</p>
              )}
            </legend>
            <div className="flex justify-between space-x-2 form_radio_btn">
              <section className="w-full">
                <input
                  type="radio"
                  id="male"
                  {...register("gender", { required: "성별을 선택해주세요" })}
                  value="email"
                />
                <label htmlFor="male">남자</label>
              </section>

              <section className="w-full">
                <input
                  type="radio"
                  id="female"
                  {...register("gender", { required: "성별을 선택해주세요" })}
                  value="phone"
                />
                <label htmlFor="female">여자</label>
              </section>
            </div>
          </fieldset>
          <label className="font-semibold" htmlFor="pass">
            비밀번호(필수):{" "}
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
            비밀번호 확인(필수):{" "}
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
