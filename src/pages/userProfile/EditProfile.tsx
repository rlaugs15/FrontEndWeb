import { useForm } from "react-hook-form";
import useUser from "../../hooks/useUser";
import { btnBase } from "../../utils/utils";
import useMutation from "../../hooks/useMutation";
import { MutationResult } from "../Join";
import { useEffect } from "react";

interface IForm {
  id: string;
  nickname: string;
}

function EditProfile() {
  const { user } = useUser();
  const [edit, { data, loading }] = useMutation<MutationResult>(
    "/api/v1/me",
    "PATCH"
  );
  const { register, handleSubmit } = useForm<IForm>({
    defaultValues: { nickname: user?.nickname },
  });

  const onEditSubmit = (data: IForm) => {
    console.log(data);
    if (loading) return;
    edit(data);
  };

  useEffect(() => {}, [loading, data]);
  return (
    <>
      <form
        onSubmit={handleSubmit(onEditSubmit)}
        className="flex flex-col bg-purple-100 w-[800px] p-3"
      >
        <label className="font-semibold" htmlFor="id">
          ID(필수):
        </label>
        <input
          {...register("id", { required: true })}
          type="email"
          className="mb-16 h-9"
          required
          placeholder="이메일을 입력해주세요."
        />
        <label className="font-semibold" htmlFor="nickname">
          닉네임:
        </label>
        <input
          {...register("nickname")}
          type="text"
          className="mb-16 h-9"
          required
          placeholder="닉네임을 입력해주세요."
        />
        <button className={`${btnBase}`}>회원정보 수정</button>
      </form>
    </>
  );
}

export default EditProfile;
