import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { MutationResult } from "../Join";
import { Post } from "./BoardDetail";
import { posts } from "../../mocks/data";
import { useForm } from "react-hook-form";

interface BoardListResponse extends MutationResult {
  data: {
    posts: Post[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
  };
}

interface IForm {
  page: number;
}

function BoardList() {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const { data: boardListData } = useSWR<BoardListResponse>(
    `/board?page=${page}&size=${size}`
  );
  console.log(boardListData);

  const { register, handleSubmit, setValue } = useForm<IForm>({
    defaultValues: {
      page: page + 1,
    },
  });
  useEffect(() => {
    setValue("page", page + 1);
  }, [page, setValue]);

  const onMoveSubmit = ({ page }: IForm) => {
    setPage(page - 1);
  };

  const onPrevClick = () => {
    setPage((num) => num - 1);
  };

  const onNextClick = () => {
    setPage((num) => num + 1);
  };
  const start = page * size;
  const end = start + size;
  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Boards</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="w-full text-sm leading-normal text-gray-600 uppercase bg-gray-200">
            <th className="px-6 py-3 text-left">번호</th>
            <th className="px-6 py-3 text-left">제목</th>
            <th className="px-6 py-3 text-left">작성자</th>
            <th className="px-6 py-3 text-left">등록일</th>
            <th className="px-6 py-3 text-center">조회</th>
            <th className="px-6 py-3 text-center">추천</th>
            <th className="px-6 py-3 text-center">반대</th>
          </tr>
        </thead>
        <tbody className="text-sm font-light text-gray-600">
          {boardListData?.data?.posts.map((post) => (
            <tr
              key={post.id}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="px-6 py-3 text-left">{post.id}</td>
              <td className="px-6 py-3 text-left">
                <Link
                  to={`/board/read/${post.id}`}
                  className="text-blue-500 hover:underline"
                >
                  {post.title}
                </Link>
              </td>
              <td className="px-6 py-3 text-left">{post.author}</td>
              <td className="px-6 py-3 text-left">{post.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button
          onClick={onPrevClick}
          disabled={page === 0}
          className="px-4 py-2 font-semibold text-gray-800 bg-gray-200 rounded hover:bg-gray-300"
        >
          Previous
        </button>
        <form
          onSubmit={handleSubmit(onMoveSubmit)}
          className="flex items-center w-auto"
        >
          Page <input {...register("page")} className="w-10 text-center" /> of{" "}
          {Math.ceil(posts.length / size)}
        </form>
        <button
          onClick={onNextClick}
          disabled={end >= posts.length}
          className="px-4 py-2 font-semibold text-gray-800 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default BoardList;
