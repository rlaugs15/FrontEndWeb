interface ICommentBox {
  writer: string;
  createdAt: string;
  comment: string;
}

function CommentBox({ writer, createdAt, comment }: ICommentBox) {
  return (
    <div className="p-4 bg-gray-100 rounded shadow">
      <div className="flex items-center justify-between">
        <span className="text-gray-800">{writer}</span>
        <span className="text-sm text-gray-600">{createdAt}</span>
      </div>
      <p className="mt-2 text-gray-700">{comment}</p>
    </div>
  );
}

export default CommentBox;
