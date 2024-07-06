import { useParams } from "react-router-dom";
import useMutation from "../../../hooks/useMutation";
import { MutationResult } from "../../Join";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { mutate } from "swr";
import { CommentResult } from "../BoardDetail";
import useUser from "../../../hooks/useUser";

interface IForm {
  content: string;
}

interface CreateCommentProps {
  parentId?: number;
  child?: boolean;
}

function CreateComment({ parentId, child = false }: CreateCommentProps) {
  const { boardId } = useParams();
  const { user } = useUser();
  const [createComm, { data }] = useMutation<MutationResult>(
    child
      ? `/api/v1/board/comments/reply/${parentId}`
      : `/api/v1/board/comments/${boardId}`
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
    if (!child) {
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
    }

    if (child) {
      const id = Date.now();
      mutate<CommentResult>(
        `/comments/${boardId}`,
        (prev) => {
          if (!prev) return prev;
          let commData = [...prev.data];
          const targetParentCommIndex = commData.findIndex(
            (comm) => comm.id === parentId
          );
          commData[targetParentCommIndex].childrenCommentsIds?.push(id);
          return {
            ...prev,
            data: [
              ...commData,
              {
                id,
                parentCommentId: parentId,
                childrenCommentsIds: [],
                content,
              },
            ],
          } as any;
        },
        false
      );
    }
  };

  useEffect(() => {
    if (data && data.code === 200) {
      clearErrors("content");
    }
    if (data && data.code !== 200) {
      setError("content", { message: "댓글 작성에 실패했습니다." });
    }
  }, [data, setError, clearErrors]);

  if (!user) {
    return null;
  }
  return (
    <form onSubmit={handleSubmit(onCreateCommSubmit)}>
      {errors && (
        <span className="text-red-500">{errors?.content?.message}</span>
      )}
      <input
        {...register("content", { required: true })}
        className="w-full p-2 mb-2 border border-gray-300 rounded"
        placeholder="댓글을 입력하세요"
        required
      />
      <button className="px-4 py-2 text-white bg-blue-500 rounded">
        {child ? "대댓글 등록" : "댓글 등록"}
      </button>
    </form>
  );
}

export default CreateComment;
