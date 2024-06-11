import useSWR from "swr";
import Nav from "../components/Nav";

function Home() {
  const { data } = useSWR("/api/users");
  return (
    <div>
      <Nav />
      <main className="h-[300vh]">
        <h1>Alle에 오신 것을 환영합니다!</h1>
      </main>
    </div>
  );
}

export default Home;
