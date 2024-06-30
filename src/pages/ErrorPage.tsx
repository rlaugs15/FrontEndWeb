import { useLocation } from "react-router-dom";

function ErrorPage() {
  const location = useLocation();
  const { code, message } = location.state || {};
  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen space-y-4">
      <span className="text-5xl font-semibold">{code}</span>
      <span className="text-2xl font-medium">{message}</span>
    </main>
  );
}

export default ErrorPage;
