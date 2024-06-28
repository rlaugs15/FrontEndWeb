import Nav from "../components/Nav";
import useUser from "../hooks/useUser";

function Home() {
  const { user } = useUser();

  return (
    <div>
      <Nav />
      <main className="h-[300vh]">
        {user ? (
          <h1>환영합니다 {user?.nickname}!</h1>
        ) : (
          <h1>Alle에 오신 것을 환영합니다!</h1>
        )}
      </main>
    </div>
  );
}

export default Home;
