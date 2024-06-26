import { useEffect } from "react";
import useSWR from "swr";
import { useLocation, useNavigate } from "react-router-dom";
import { MutationResult } from "../pages/Join";

interface IUser {
  id: number;
  email: string;
  nickname: string;
  profileImg: string;
  createdAt: string; // 생성일 (LocalDateTime은 ISO 문자열로 변환됨)
}

interface IApiResponse extends MutationResult {
  data: IUser;
}

// 로그인된 사용자의 정보를 가져오고 로그인되지 않은 사용자를 로그인 페이지로 리다이렉트
export default function useUser() {
  const { data, error } = useSWR<IApiResponse>("/member");

  const nav = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (error) {
      console.error("Error fetching user data:", error);
      return;
    }

    if (data?.code !== 200 && pathname !== "/") {
      nav("/login", { replace: true });
    }
    if (data?.code === 200 && pathname === "/login") {
      nav("/", { replace: true });
    }
    console.log("useUser 데이터", data);
  }, [data, error, nav, pathname]);

  return { user: data?.data, isLoading: !data && !error };
}
