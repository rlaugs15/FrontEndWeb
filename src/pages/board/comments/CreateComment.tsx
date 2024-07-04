import { useParams } from "react-router-dom";
import useMutation from "../../../hooks/useMutation";
import { MutationResult } from "../../Join";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { mutate } from "swr";
import { CommentResult } from "../BoardDetail";

interface IForm {
  content: string;
}

function CreateComment() {
  const { boardId } = useParams();
  const [createComm, { data }] = useMutation<MutationResult>(
    `/api/v1/board/comments/${boardId}`
  );
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<IForm>();

  const onCreateCommSubmit = ({ content }: IForm) => {
    createComm({ content });
    reset({ content: "" });
    mutate<CommentResult>(
      `/comments/${boardId}`,
      (prev) =>
        prev &&
        ({
          ...prev,
          data: [
            ...prev.data,
            {
              id: Date.now(),
              parentCommentId: null,
              childrenCommentsIds: [],
              content,
            },
          ],
        } as any),
      false
    );
  };
  useEffect(() => {
    if (data && data.code === 200) {
      clearErrors("content");
    }
    if (data && data.code !== 200) {
      setError("content", { message: "댓글 작성에 실패했습니다." });
    }
  }, [data, setError, clearErrors]);
  return (
    <form onSubmit={handleSubmit(onCreateCommSubmit)}>
      {errors && (
        <span className="text-red-500">{errors?.content?.message}</span>
      )}
      <textarea
        {...register("content", { required: true })}
        className="w-full p-2 mb-2 border border-gray-300 rounded"
        rows={4}
        placeholder="댓글을 입력하세요"
        required
      />
      <button className="px-4 py-2 text-white bg-blue-500 rounded">
        댓글 등록
      </button>
    </form>
  );
}

export default CreateComment;
