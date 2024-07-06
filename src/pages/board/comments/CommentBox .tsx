import { useState } from "react";
import { btnBase } from "../../../utils/utils";
import { NewComment } from "../BoardDetail";
import CreateComment from "./CreateComment";
import useUser from "../../../hooks/useUser";

function CommentBox({
  id,
  parentCommentId,
  childrenComments,
  content,
}: NewComment) {
  const { user } = useUser();
  const [reply, setReply] = useState(false);
  const onreplyCommClick = () => {
    setReply((prev) => !prev);
  };
  return (
    <div className="p-4 rounded shadow">
      <div className="flex items-center justify-between">
        {/* <span className="text-gray-800">{writer}</span> */}
        {/* <span className="text-sm text-gray-600">{createdAt}</span> */}
      </div>
      <div className="flex justify-between p-3 mt-2 text-gray-700 bg-gray-100">
        <p className="">{content}</p>
        {user ? (
          <button onClick={onreplyCommClick} className={`${btnBase}`}>
            답글
          </button>
        ) : null}
      </div>
      {reply ? (
        <div className="w-full p-1 m-1 border border-gray-300 rounded-md">
          <CreateComment parentId={id!} child={true} />
        </div>
      ) : null}

      {childrenComments?.map((children) => (
        <p
          key={children.id}
          className="p-3 mt-2 ml-5 text-gray-700 bg-gray-100"
        >
          {children.content}
        </p>
      ))}
    </div>
  );
}

export default CommentBox;
