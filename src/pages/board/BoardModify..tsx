import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useUser from "../../hooks/useUser";
import { useForm } from "react-hook-form";
import useMutation from "../../hooks/useMutation";
import { MutationResult } from "../Join";

interface IForm {
  title: string;
  content: string;
}

function BoardModify() {
  const { user } = useUser();
  const {
    state: { boardId, title, author, content },
  } = useLocation();
  const nav = useNavigate();
  const [failModify, setFailModify] = useState(false);
  useEffect(() => {
    if (user?.nickname !== author) {
      nav("/board");
    }
  }, [user, author, nav]);
  const [modify, { data }] = useMutation<MutationResult>(
    "/api/v1/board",
    "PUT"
  );
  const { register, handleSubmit } = useForm<IForm>({
    defaultValues: {
      title,
      content,
    },
  });
  const onModifySubmit = ({ title, content }: IForm) => {
    modify({ id: boardId, title, content });
  };

  useEffect(() => {
    if (data && data?.code === 200) {
      nav(`/board/read/${boardId}`, { replace: true });
    } else if (data && data?.code !== 200) {
      setFailModify(true);
    }
  }, [data, nav, setFailModify]);

  if (failModify) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <span className="text-3xl font-semibold">
          데이터 수정에 실패했습니다.
        </span>
      </div>
    );
  }

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-3xl font-bold">글 수정</h1>
      <form onSubmit={handleSubmit(onModifySubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700">아이디 / 닉네임</label>
          <input
            type="text"
            value={`${author}`}
            disabled
            className="w-full px-3 py-2 bg-gray-100 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700">
            제목
          </label>
          <input
            {...register("title", { required: true })}
            id="title"
            type="text"
            className="w-full px-3 py-2 border rounded"
            maxLength={45}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">본문</label>
          <textarea
            {...register("content", { required: true })}
            className="w-full h-64 px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mt-4 text-right">
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded"
          >
            저장
          </button>
        </div>
      </form>
      <div></div>
    </div>
  );
}

export default BoardModify;
