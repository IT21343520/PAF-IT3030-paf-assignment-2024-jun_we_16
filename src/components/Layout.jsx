import { useEffect, useState } from "react";
import SideBar from "./SideBar";

const Layout = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authUser"));
    setAuthUser(user);
    if (!user) {
      window.location.href = "/login";
    }
  }, []);

  if (!authUser) return null;

  return (
    <div className="flex bg-white ">
      <div className="p-2 h-screen">
        <SideBar user={authUser} />
      </div>
      <div className="w-[83%] ml-[17%]  p-2 h-screen">{children}</div>
    </div>
  );
};
export default Layout;
