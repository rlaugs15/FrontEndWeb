import { useForm } from "react-hook-form";
import { MutationResult } from "./Join";
import { Link, useNavigate } from "react-router-dom";
import { btnBase } from "../utils/utils";
import useMutation from "../hooks/useMutation";
import { useEffect, useState } from "react";

interface ISearchPassForm {
  loginId: string;
}

function SearchPass() {
  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<ISearchPassForm>();

  const [searchPass, { data: passData, loading: passLoading }] =
    useMutation<MutationResult>("/api/v1/send-temporaryPassword");
  const nav = useNavigate();
  const [tempPass, setTempPass] = useState(false);

  const onSerachEmailSubmit = async (data: ISearchPassForm) => {
    if (passLoading) return;
    await searchPass(data);
    console.log("passData", passData);
  };
  useEffect(() => {
    if (passData?.code !== 200) {
      setError("loginId", { message: passData?.message });
    } else if (passData?.code === 200) {
      clearErrors("loginId");
      setTempPass(true);
    }
  }, [passData, clearErrors, setTempPass, setError]);

  useEffect(() => {
    if (tempPass) {
      setTimeout(() => {
        nav("/login");
      }, 1500);
    }
  }, [tempPass, nav]);
  return (
    <div className="absolute top-0 flex items-center justify-center w-screen h-screen bg-black bg-opacity-50">
      <main className="bg-purple-100 w-[500px] z-10 p-3">
        {tempPass ? (
          <p className="py-5 font-semibold text-center">
            임시 비밀번호 발송에 성공했습니다. <br /> 이메일을 확인해주세요.
          </p>
        ) : (
          <>
            <nav className="flex justify-end">
              <Link to={"/login"}>
                <button className="font-semibold">X</button>
              </Link>
            </nav>
            <form
              onSubmit={handleSubmit(onSerachEmailSubmit)}
              className="flex flex-col "
            >
              <label className="font-semibold" htmlFor="loginId">
                이메일:
                {errors.loginId && (
                  <span className="text-red-500">{errors.loginId.message}</span>
                )}
              </label>
              <input
                {...register("loginId", { required: true })}
                className="mb-16 h-9"
                id="loginId"
                required
                placeholder="이메일을 입력해주세요."
              />

              <button
                className={`${btnBase} py-2 font-semibold text-2xl mx-24`}
              >
                임시 비밀번호 전송
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}

export default SearchPass;
