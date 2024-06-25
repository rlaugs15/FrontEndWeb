interface NotFoundProps {
  code?: number;
  message?: string;
}

function NotFound({
  code = 404,
  message = "존재하지 않는 페이지입니다.",
}: NotFoundProps) {
  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen space-y-4">
      <span className="text-5xl font-semibold">{code}</span>
      <span className="text-2xl font-medium">{message}</span>
    </main>
  );
}

export default NotFound;
