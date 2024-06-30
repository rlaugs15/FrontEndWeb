function CommentInput() {
  return (
    <>
      <textarea
        className="w-full p-2 mb-2 border border-gray-300 rounded"
        rows={4}
        placeholder="댓글을 입력하세요"
      />
      <button className="px-4 py-2 text-white bg-blue-500 rounded">
        댓글 등록
      </button>
    </>
  );
}

export default CommentInput;
