import { Outlet } from "react-router-dom";
import Nav from "../../components/Nav";

function Board() {
  return (
    <div>
      <Nav />
      <div className="flex items-start justify-center h-screen">
        <Outlet />
      </div>
    </div>
  );
}

export default Board;
