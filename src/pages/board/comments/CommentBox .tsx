import { NewComment } from "../BoardDetail";

function CommentBox({
  id,
  parentCommentId,
  childrenComments,
  content,
}: NewComment) {
  return (
    <div className="p-4 rounded shadow">
      <div className="flex items-center justify-between">
        {/* <span className="text-gray-800">{writer}</span> */}
        {/* <span className="text-sm text-gray-600">{createdAt}</span> */}
      </div>
      <p className="p-3 mt-2 text-gray-700 bg-gray-100">{content}</p>
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
