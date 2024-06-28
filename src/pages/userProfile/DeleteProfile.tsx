import { useForm } from "react-hook-form";
import useMutation from "../../hooks/useMutation";
import useUser from "../../hooks/useUser";
import { MutationResult } from "../Join";
import { btnBase } from "../../utils/utils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../tokenInstance";
import { mutate } from "swr";

interface IForm {
  password: string;
  password2: string;
}

function DeleteProfile() {
  const { user } = useUser();
  const [pass, setPass] = useState("");
  const [clearMessage, setClearMessage] = useState(false);
  const nav = useNavigate();
  const [deleteUser, { data, loading }] = useMutation<MutationResult>(
    "/api/v1/me",
    "DELETE"
  );
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IForm>();
  const [deleteConfirm, setdDleteConfirm] = useState(false);

  const onDeleteSubmit = ({ password, password2 }: IForm) => {
    if (password !== password2) {
      return setError("password", { message: "비밀번호가 일치하지 않습니다." });
    }
    setPass(password);
    setdDleteConfirm(true);
  };

  const onDeleteConfirm = () => {
    if (loading) return;
    deleteUser({ password: pass });
  };

  useEffect(() => {
    if (data?.code === 401) {
      setdDleteConfirm(false);
      setError("password", { message: "탈퇴에 실패했습니다." });
    }
    if (data?.code === 200) {
      setClearMessage(true);
      setTimeout(() => {
        logout();
        mutate("/member", null, { revalidate: false });
        nav("/");
      }, 2000);
    }
  }, [data, setClearMessage, setdDleteConfirm, setError, nav]);
  return (
    <>
      {!deleteConfirm ? (
        <form
          onSubmit={handleSubmit(onDeleteSubmit)}
          className="flex flex-col bg-purple-100 w-[800px] p-3"
        >
          <label className="font-semibold" htmlFor="id">
            비밀번호:{" "}
            {errors?.password && <span>{errors?.password?.message}</span>}
          </label>
          <input
            {...register("password", { required: true })}
            type="password"
            className="mb-16 h-9"
            required
            placeholder="비밀번호를 입력해주세요."
          />
          <label className="font-semibold" htmlFor="nickname">
            비밀번호 확인:
          </label>
          <input
            {...register("password2")}
            type="password"
            className="mb-16 h-9"
            required
            placeholder="비밀번호를 다시 입력해주세요."
          />
          <button className={`${btnBase}`}>유저 탈퇴</button>
        </form>
      ) : (
        <div className="flex flex-col bg-purple-100 w-[800px] p-3">
          {clearMessage ? (
            <span>탈퇴에 성공했습니다.</span>
          ) : (
            <>
              <span>정말 탈퇴하시겠습니까?</span>
              <button onClick={onDeleteConfirm} className={`${btnBase}`}>
                탈퇴하기
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default DeleteProfile;
