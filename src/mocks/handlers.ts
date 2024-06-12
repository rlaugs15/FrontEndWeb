import { http, HttpResponse } from "msw";

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

const users: User[] = [
  {
    loginId: "rlaugs15@naver.com",
    nickname: "Bam",
    password: "rlaguswns123!!",
    firstName: "현준",
    lastName: "김",
    gender: "남자",

    birthDay: "941234",
    email: "rlaugs15@google.com",
  },
];

export const handlers = [
  // GET 요청
  http.get("/api/v1/member/me", () => {
    return HttpResponse.json(users, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  // 이메일 인증 GET 요청
  http.get("/api/v1/member/send-authCode", () => {
    return HttpResponse.json(
      { email: "rlaugs15@naver.com" },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }),

  // 인증코드 확인용 GET 요청
  http.get("/api/v1/member/verify-authCode", () => {
    return HttpResponse.json(
      { authCode: "12345" },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }),

  // POST 요청
  // 이메일 인증 코드 전송
  http.post("/api/v1/member/send-authCode", async ({ request }) => {
    const { email } = await request.json();
    if (email)
      return HttpResponse.json(
        { code: 200, message: "12345" },
        { status: 200 }
      );
  }),

  //이메일 인증 코드 인증
  http.post("/api/v1/member/verify-authCode", async ({ request }) => {
    const { email, authCode } = await request.json();
    if (email && authCode)
      return HttpResponse.json({ code: 200 }, { status: 200 });
  }),
  http.post("/api/v1/member/login", async ({ request }) => {
    const { email, password, nickname } = await request.json();

    let user: User | undefined;
    // 로그인
    if (email && password) {
      user = users.find(
        (user) => user.email === email && user.password === password
      );
      if (!user) {
        // 사용자가 없으면 400 응답
        return HttpResponse.json(
          {
            code: 400,
            message: "사용자가 존재하지 않습니다",
            data: null,
          },
          { status: 400 }
        );
      }
      return HttpResponse.json(
        { code: 200, message: "성공", data: user },
        { status: 200 }
      );
      //이메일만 받는 경우(이메일 인증)
    } else if (email) {
      user = users.find((user) => user.email === email);
      if (user) {
        // 사용자가 있으면 400 응답
        return HttpResponse.json(
          {
            code: 400,
            message: "이메일 인증 실패",
          },
          { status: 400 }
        );
      }
      return HttpResponse.json({ code: 200 }, { status: 200 });
      //닉네임 중복 확인
    } else if (nickname) {
      const serchNickname = users.find((user) => user.nickname === nickname);
      if (serchNickname) {
        return HttpResponse.json(
          {
            code: 403,
            message: "중복된 닉네임 입니다.",
            data: null,
          },
          { status: 403 }
        );
      }
      if (!serchNickname) {
        return HttpResponse.json(
          {
            code: 200,
            message: "닉네임 인증 성공",
            data: null,
          },
          { status: 200 }
        );
      }
    }
  }),
  /* http.post("/api/users", async ({ request }) => {
    const requestData = await request.json();
    const nickname = requestData?.nickname;
    const email = requestData?.email;
    const password = requestData?.password;

    const newUser: User = { id: users.length + 1, nickname, email, password };
    users.push(newUser);

    return HttpResponse.json(users, { status: 201 });
  }), */

  //회원가입 승인
  http.post("/api/users/join", async ({ request }) => {
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
    return HttpResponse.json({ code: 200 });
  }),
];
