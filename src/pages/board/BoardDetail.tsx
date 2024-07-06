import { Link, useNavigate, useParams } from "react-router-dom";
import { btnBase } from "../../utils/utils";
import CommentBox from "./comments/CommentBox ";
import CreateComment from "./comments/CreateComment";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useUser from "../../hooks/useUser";
import { MutationResult } from "../Join";
import useMutation from "../../hooks/useMutation";

export interface NewComment {
  id: number;
  parentCommentId?: number | null;
  childrenComments?: NewComment[];
  content: string;
}

export interface Comment {
  id: number;
  parentCommentId?: number;
  childrenCommentsIds?: number[];
  content: string;
}
export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  like?: boolean;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
}

interface PostResult extends MutationResult {
  data: Post;
}

interface LikeResult extends MutationResult {
  data: {
    like: number;
  };
}

export interface CommentResult extends MutationResult {
  data: Comment[];
}

function BoardDetail() {
  const { boardId } = useParams();
  const { user } = useUser();
  const nav = useNavigate();
  const [realDelete, setrealDelete] = useState(false);
  const [good, setGood] = useState(false);
  const { data: likeData } = useSWR<LikeResult>(`/board/like/${boardId}`);
  const { data: postData } = useSWR<PostResult>(`/board/${boardId}`);
  const [deleteBoard, { data: deleteData }] = useMutation<MutationResult>(
    `/api/v1/board/${boardId}`,
    "DELETE"
  );
  const { data: commentData } = useSWR<CommentResult>(`/comments/${boardId}`);

  const onDeleteClick = () => {
    setrealDelete(true);
  };
  const onRealDeleteClick = () => {
    deleteBoard({ id: boardId });
  };
  useEffect(() => {
    if (deleteData && deleteData?.code === 200) {
      nav("/board", { replace: true });
    } else if (deleteData && deleteData?.code !== 200) {
      nav("/errorPage", {
        replace: true,
        state: { code: deleteData?.code, message: deleteData?.message },
      });
    }
  }, [deleteData, nav]);

  const onGoodClick = () => {
    //좋아요 추후 구현
  };

  //댓글 리스트 수정
  const commentList = (commentData: CommentResult): NewComment[] => {
    const comments: Comment[] = commentData?.data || [];
    let clonComments: Comment[] = [...comments];
    let newComments: NewComment[] = [];
    for (const comment of clonComments) {
      if (!comment.parentCommentId) {
        newComments.push({
          id: comment.id,
          content: comment.content,
          parentCommentId: null,
          childrenComments: [],
        });
      }
    }

    for (const newComment of newComments) {
      let newChildrenComments: NewComment[] = [];
      for (const comment of comments) {
        if (comment.parentCommentId === newComment.id) {
          newChildrenComments.push({
            id: comment.id,
            parentCommentId: newComment.id,
            content: comment.content,
            childrenComments: [],
          });
        }
      }
      newComment.childrenComments = newChildrenComments;
    }

    return newComments;
  };

  return (
    <>
      <div className="w-full bg-gray-100">
        <section className="p-6 bg-white rounded-lg shadow-md">
          <title className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{postData?.data?.title}</h1>
            <span className="text-gray-600">#{postData?.data?.id}</span>
          </title>
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-600">
              <span className="mr-2">작성자: {postData?.data?.author}</span>
              <span>작성일: {postData?.data?.createdAt}</span>
            </div>
            <div className="text-gray-500">
              <span>수정일: {postData?.data?.updatedAt}</span>
            </div>
          </div>
          <div className="mb-1">추천: {likeData?.data?.like}</div>
          <div className="mb-4 space-x-3">
            <button onClick={onGoodClick} className={`${btnBase} `}>
              추천
            </button>
            {user?.nickname === postData?.data?.author ? (
              <>
                <Link
                  to={`/board/modify/${boardId}`}
                  state={{
                    boardId,
                    author: postData?.data?.author,
                    title: postData?.data?.title,
                    content: postData?.data?.content,
                  }}
                >
                  <button className={`${btnBase} bg-green-500 ring-green-500`}>
                    수정
                  </button>
                </Link>
                <button
                  onClick={onDeleteClick}
                  className={`${btnBase} bg-red-500 ring-red-500`}
                >
                  삭제
                </button>
              </>
            ) : null}
          </div>
          <div className="mb-6 leading-relaxed text-gray-800">
            {postData?.data?.content}
          </div>
        </section>

        <section className="p-4 mt-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-2xl font-semibold">댓글</h2>
          <div className="mb-4 space-y-4">
            {commentData &&
              commentList(commentData).map((comment) => (
                <CommentBox
                  key={comment?.id}
                  id={comment?.id}
                  parentCommentId={comment?.parentCommentId}
                  childrenComments={comment?.childrenComments}
                  content={comment?.content}
                />
              ))}
          </div>
          <section>
            <CreateComment />
          </section>
        </section>
      </div>
      {realDelete ? (
        <div className="absolute z-20 flex items-center justify-center w-full h-full bg-black bg-opacity-20">
          <dialog open className="p-6 space-y-3 ">
            <p>정말 게시글을 삭제하시겠습니다?</p>
            <form method="dialog" className="grid grid-cols-2 gap-2">
              <button onClick={onRealDeleteClick} className={`${btnBase}`}>
                예
              </button>
              <button
                onClick={() => setrealDelete(false)}
                className={`${btnBase}`}
              >
                아니오
              </button>
            </form>
          </dialog>
        </div>
      ) : null}
    </>
  );
}

export default BoardDetail;
