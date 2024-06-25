import { Outlet } from "react-router-dom";
import Nav from "../../components/Nav";

function UserProfile() {
  return (
    <div>
      <Nav />
      <div className="flex items-center justify-center h-screen">
        <Outlet />
      </div>
    </div>
  );
}

export default UserProfile;
