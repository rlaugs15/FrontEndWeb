import { http, HttpResponse } from "msw";
import { SignJWT, jwtVerify } from "jose";
import { logout } from "../tokenInstance";
import { commentListData, posts } from "./data";
import { Post } from "../pages/board/BoardDetail";

const secretKey = new TextEncoder().encode("your-secret-key");

export interface User {
  loginId: string;
  password: string;
  passwordConfirm?: string;
  firstName: string;
  lastName?: string;
  gender: string;
  nickname: string;
  birthDay: string;
  email?: string;
}

//유저 데이터
const users: User[] = [
  {
    loginId: "rlaugs15@naver.com",
    nickname: "Bam",
    password: "rlaguswns123!!",
    firstName: "현준",
    lastName: "김",
    gender: "남자",
    birthDay: "19941234",
    email: "rlaugs15@goole.com",
  },
  {
    loginId: "rlaugs44@naver.com",
    nickname: "Alen",
    password: "rlaguswns123!!",
    firstName: "민아",
    lastName: "방",
    gender: "여자",
    birthDay: "19930513",
    email: "rlaugs44@goole.com",
  },
];

// JWT 생성 함수
const generateToken = async (user: User): Promise<string> => {
  const payload = {
    userId: user.loginId,
  };

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("urn:example:issuer")
    .setAudience("urn:example:audience")
    .setExpirationTime("1h")
    .sign(secretKey);
};

// JWT 검증 및 디코딩 함수
const verifyAndDecodeToken = async (token: string): Promise<any> => {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      issuer: "urn:example:issuer",
      audience: "urn:example:audience",
    });
    return payload;
  } catch (e) {
    console.error("Token verification failed:", e);
    return null;
  }
};

// 쿠키 파싱 유틸리티 함수
const parseCookies = (cookieHeader: string): { [key: string]: string } => {
  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim().split("="))
    .reduce(
      (acc, [key, value]) => {
        acc[key] = decodeURIComponent(value);
        return acc;
      },
      {} as { [key: string]: string }
    );
};

export const handlers = [
  // -----------------------GET 요청------------------------------

  // 회원 정보 조회
  http.get("/api/v1/member", async ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return HttpResponse.json(
        { code: 401, message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    const decoded = await verifyAndDecodeToken(token);
    if (!decoded) {
      return HttpResponse.json(
        { code: 401, message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    // 토큰이 유효한 경우 사용자 데이터 반환
    const user = users.find((u) => u.loginId === decoded.userId);

    if (!user) {
      return HttpResponse.json(
        { code: 404, message: "User not found", data: null },
        { status: 404 }
      );
    }

    return HttpResponse.json(
      {
        code: 200,
        message: "Member information retrieved successfully",
        data: {
          id: user.loginId, // Assuming `loginId` is the user's ID
          email: user.email,
          nickname: user.nickname,
          profileImg: null,
          createdAt: null,
        },
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }),

  // 이메일 중복확인 GET 요청
  http.get("/api/v1/auth/check-email/:email", ({ params }) => {
    const { email } = params;
    //const { email } = params;
    const user = users.find((user) => user.loginId === email);
    return HttpResponse.json({ code: 200, message: "email" }, { status: 200 });
    /* if (user) {
      return HttpResponse.json(
        { code: 403, message: "이메일이 이미 사용 중입니다." },
        { status: 403 }
      );
    }

    return HttpResponse.json(
      { code: 200, message: "사용 가능한 이메일입니다." },
      { status: 200 }
    ); */
  }),

  // 이메일 인증 GET 요청
  http.get("/api/v1/send-authCode", () => {
    return HttpResponse.json({ email: "rlaugs15@naver.com" }, { status: 200 });
  }),

  // 인증코드 확인용 GET 요청
  http.get("/api/v1/verify-authCode", () => {
    return HttpResponse.json({ authCode: "12345" }, { status: 200 });
  }),

  // 닉네임 중복 확인 GET 요청
  http.get("/api/v1/auth/check-nickname/:nickname", ({ params }) => {
    const { nickname } = params;
    const user = users.find((user) => user.nickname === nickname);

    if (user) {
      return HttpResponse.json(
        { code: 403, message: "닉네임이 이미 사용 중입니다." },
        { status: 403 }
      );
    }

    return HttpResponse.json(
      { code: 200, message: "사용 가능한 닉네임입니다." },
      { status: 200 }
    );
  }),

  // 게시글 목록 조회
  http.get("/api/v1/board", ({ request }) => {
    const url = new URL(request.url);

    const page = parseInt(url.searchParams.get("page") || "0");
    const size = parseInt(url.searchParams.get("size") || "10");
    const start = page * size;
    const end = start + size;

    const paginatedPosts = posts.slice(start, end);

    return HttpResponse.json(
      {
        code: 200,
        message: "데이터 조회 성공",
        data: {
          posts: paginatedPosts,
          totalElements: posts.length,
          totalPages: Math.ceil(posts.length / size),
          currentPage: page,
        },
      },
      { status: 200 }
    );
  }),

  //게시글 조회
  http.get("/api/v1/board/:id", ({ params }) => {
    const { id } = params;
    const post = posts.find((post) => Number(id) === post?.id);
    return HttpResponse.json(
      {
        code: 200,
        message: "데이터 조회 성공",
        data: post,
      },
      { status: 200 }
    );
  }),

  //좋아요 조회
  http.get("/api/v1/board/like/:id", ({ params }) => {
    const { id } = params;
    const post = posts.find((post) => Number(id) === post?.id);
    return HttpResponse.json(
      {
        code: 200,
        message: "데이터 조회 성공",
        data: {
          like: post?.like,
        },
      },
      { status: 200 }
    );
  }),

  //댓글 조회
  http.get("/api/v1/comments/:id", ({ params }) => {
    const { id } = params;
    const post = posts.find((post) => Number(id) === post?.id);

    let commentList = [];
    for (const boardCommentId of post?.comments!) {
      for (const comment of commentListData) {
        if (boardCommentId === comment.id) {
          commentList.push(comment);
        }
      }
    }
    return HttpResponse.json(
      {
        code: 200,
        message: "데이터 조회 성공",
        data: commentList,
      },
      { status: 200 }
    );
  }),

  // ----------------------POST 요청--------------------------------------
  // 이메일 인증 코드 전송
  http.post("/api/v1/auth/send-code", async ({ request }) => {
    const { email } = await request.json();
    if (email) {
      return HttpResponse.json(
        { code: 200, message: "12345" },
        { status: 200 }
      );
    }
  }),

  // 이메일 인증 코드 인증
  http.post("/api/v1/auth/verify-code", async ({ request }) => {
    const { email, authCode } = await request.json();
    if (email && authCode) {
      return HttpResponse.json({ code: 200 }, { status: 200 });
    }
  }),

  // 로그인 요청
  http.post("/api/v1/login", async ({ request }) => {
    const { loginId, password } = await request.json();

    const user = users.find(
      (user) => user.loginId === loginId && user.password === password
    );

    if (!user) {
      // 사용자가 없으면 400 응답
      return HttpResponse.json(
        {
          code: 400,
          message: "회원정보가 일치하지 않습니다.",
          data: null,
        },
        { status: 400 }
      );
    }

    // Access Token 생성
    const token = await generateToken(user);
    // Refresh Token은 여기에서는 단순히 응답의 쿠키로 설정, 실제 환경에서는 서버에서 관리
    const refreshToken = await new SignJWT({ userId: user.loginId })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secretKey);

    return HttpResponse.json(
      { code: 200, message: "성공", data: { token } },
      {
        status: 200,
        headers: {
          "Set-Cookie": `refreshToken=${refreshToken}; HttpOnly`,
        },
      }
    );
  }),

  // 회원가입 승인
  http.post("/api/v1/join", async ({ request }) => {
    const {
      loginId,
      password,
      passwordConfirm,
      firstName,
      lastName,
      gender,
      nickname,
      birthDay,
      email,
    } = await request.json();
    users.push({
      loginId,
      password,
      passwordConfirm,
      firstName,
      lastName,
      gender,
      nickname,
      birthDay,
      email,
    });
    return HttpResponse.json(
      { code: 200, message: "회원가입 성공" },
      { status: 200 }
    );
  }),

  // 임시 비밀번호 전송
  http.post("/api/v1/send-temporaryPassword", async ({ request }) => {
    const { loginId } = await request.json();
    if (loginId) {
      return HttpResponse.json(
        { code: 200, message: "임시 비밀번호를 발송했습니다." },
        { status: 200 }
      );
    }
  }),

  // Access Token 재발급 요청
  http.post("/auth/reissue-token", async ({ request }) => {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const cookies = parseCookies(cookieHeader);
    const refreshToken = cookies["refreshToken"];
    if (!refreshToken) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
      const { payload } = await jwtVerify(refreshToken, secretKey, {
        issuer: "urn:example:issuer",
        audience: "urn:example:audience",
      });
      if (payload.exp <= Math.floor(Date.now() / 1000)) {
        throw new Error("Token expired");
      }

      const user = users.find((u) => u.loginId === payload.userId);
      if (!user) {
        throw new Error("User not found");
      }

      const newAccessToken = await generateToken(user);
      return HttpResponse.json({ newToken: newAccessToken }, { status: 200 });
    } catch (e) {
      return HttpResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
  }),

  //로그아웃 요청
  http.post("/api/v1/auth/logout", async ({ request }) => {
    logout();
    return HttpResponse.json({ code: 200 }, { status: 200 });
  }),

  //댓글 작성
  http.post("/api/v1/board/comments/:boardId", async ({ request, params }) => {
    const { boardId } = params;
    const { content } = await request.json();
    if (!boardId) {
      return HttpResponse.json(
        { code: 403, message: "게시글을 찾을 수 없습니다." },
        { status: 403 }
      );
    }
    if (!content) {
      return HttpResponse.json(
        { code: 403, message: "댓글 작성에 실패했습니다." },
        { status: 403 }
      );
    }

    const commId = Date.now();

    commentListData.push({
      id: commId,
      parentCommentId: null,
      childrenCommentsIds: [],
      content,
    });
    const targetBoard = posts?.find((post) => post.id === +boardId);
    const targetComments = targetBoard?.comments as number[];
    targetComments.push(commId);

    return HttpResponse.json(
      {
        code: 200,
        message: "댓글 작성이 완료됐습니다.",
        data: {},
      },
      { status: 200 }
    );
  }),

  //대댓글 작성
  http.post(
    "/api/v1/board/comments/reply/:parentId",
    async ({ request, params }) => {
      const { parentId } = params;
      const { content } = await request.json();
      if (!parentId || !content) {
        return HttpResponse.json(
          { code: 403, message: "대댓글 작성에 실패했습니다." },
          { status: 403 }
        );
      }

      const childId = Date.now();
      commentListData.push({
        id: childId,
        parentCommentId: +parentId,
        childrenCommentsIds: [],
        content,
      });

      const targetParentIndex = commentListData.findIndex(
        (comm) => comm.id === +parentId!
      );
      commentListData[targetParentIndex].childrenCommentsIds.push(childId);
      return HttpResponse.json(
        {
          code: 200,
          message: "대댓글 작성이 완료됐습니다.",
          data: { commentListData },
        },
        { status: 200 }
      );
    }
  ),

  // ----------------------DELETE 요청--------------------------------------
  // 회원 정보 삭제 요청
  http.delete("/api/v1/me", async ({ request }) => {
    const { password } = await request.json();

    // 비밀번호와 DELETE 요청이 오면 성공 응답 반환
    return HttpResponse.json(
      { code: 200, message: "User deleted successfully" },
      { status: 200 }
    );
  }),

  //게시글 삭제
  http.delete("/api/v1/board/:id", async ({ params }) => {
    const { id } = params;
    // id로 게시글 찾기
    const postIndex = posts.findIndex((post) => Number(id) === post?.id);
    if (postIndex === -1) {
      return HttpResponse.json(
        { code: 404, message: "게시글 삭제에 실패했습니다.." },
        { status: 404 }
      );
    }
    posts.splice(postIndex, 1);

    // 비밀번호와 DELETE 요청이 오면 성공 응답 반환
    return HttpResponse.json(
      { code: 200, message: "게시글 삭제에 성공했습니다." },
      { status: 200 }
    );
  }),

  // ----------------------PUT 요청--------------------------------------
  http.put("/api/v1/board", async ({ request }) => {
    const { id, title, content } = await request.json();

    // id로 게시글 찾기
    const postIndex = posts.findIndex((post) => Number(id) === post?.id);
    if (postIndex === -1) {
      return HttpResponse.json(
        { code: 404, message: "게시글이 존재하지 않습니다.," },
        { status: 404 }
      );
    }
    const post = posts[postIndex];

    // 새로운 게시글 객체 생성
    const newPost = { ...post, title, content };

    //기존 데이터 업데이트
    posts[postIndex] = newPost;
    return HttpResponse.json(
      { code: 200, message: "데이터가 수정되었습니다,", data: newPost },
      { status: 200 }
    );
  }),
];
