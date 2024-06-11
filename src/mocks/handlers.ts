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
    password: "rlaguswns123!!",
    firstName: "현준",
    lastName: "김",
    gender: "남자",
    nickname: "Bam",
    birthDay: "941234",
    email: "rlaugs15@google.com",
  },
];

const setToken: { token: string } = {
  token: "123456",
};

export const handlers = [
  // GET 요청
  http.get("/api/users", () => {
    return HttpResponse.json(users, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  http.get("/api/users/token", () => {
    return HttpResponse.json(setToken, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  // POST 요청
  // 이메일 인증 코드 전송
  http.post("/api/v1/member/send-authCode", async ({ request }) => {
    const { email, password, nickname } = await request.json();
  }),

  //이메일 인증 코드 인증
  http.post("/api/v1/member/verify-authCode", async ({ request }) => {
    const { email, password, nickname } = await request.json();
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
        return HttpResponse.json({
          code: 400,
          message: "사용자가 존재하지 않습니다",
          data: null,
        });
      }
      return HttpResponse.json({ code: 200, message: "성공", data: user });
      //이메일만 받는 경우(이메일 인증)
    } else if (email) {
      user = users.find((user) => user.email === email);
      if (user) {
        // 사용자가 있으면 400 응답
        return HttpResponse.json({
          code: 400,
          message: "이메일 인증 실패",
        });
      }
      return HttpResponse.json({ code: 200 });
      //닉네임 중복 확인
    } else if (nickname) {
      const serchNickname = users.find((user) => user.nickname === nickname);
      if (serchNickname) {
        return HttpResponse.json({
          code: 403,
          message: "중복된 닉네임 입니다.",
          data: null,
        });
      }
      if (!serchNickname) {
        return HttpResponse.json({
          code: 200,
          message: "닉네임 인증 성공",
          data: null,
        });
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

  //토큰 인증
  http.post("/api/users/token", async ({ request }) => {
    const { token } = await request.json();
    if (setToken.token !== token) {
      return HttpResponse.json({
        code: 401,
        message: "잘못된 토큰입니다.",
      });
    }
    return HttpResponse.json({ code: 200, message: "성공" });
  }),

  //회원가입 승인
  http.post("/api/users/join", async ({ request }) => {
    const { email, name, password } = await request.json();
    users.push({ id: Date.now() + "", email, name, password });
    return HttpResponse.json({ code: 200 });
  }),
];
