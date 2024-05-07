import { NavLink } from "react-router-dom";
import { ProfileIcon } from "./ProfileIcon";

const SideBar = ({ user }) => {
  return (
    <div className="flex flex-col bg-[#00008B] fixed rounded-lg justify-around w-[17%] h-[98%] ">
      <div className="mb-3 flex flex-col w-full items-center justify-center">
        <ProfileIcon
          user={user.username}
          color={"red"}
          textColor={"white"}
          size={54}
        />
        <h1 className="text-center font-bold uppercase mt-1 text-white ">
          {user?.username}
        </h1>
        <h4 className="text-center text-sm text-teal-100 opacity-80">
          {user?.email}
        </h4>
      </div>
      <div className=" h-[50%] px-5">
        <nav>
          <ul className="flex flex-col gap-4">
            <NavLink
              to="/"
              className={({ isActive, isPending }) =>
                isPending
                  ? "pending"
                  : isActive
                  ? "flex items-center rounded-lg w-full px-2 py-1 h-10 bg-[#ADFF2F] text-white"
                  : "flex items-center rounded-lg w-full px-2 py-1 h-10 bg-white text-black"
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/post"
              className={({ isActive, isPending }) =>
                isPending
                  ? "pending"
                  : isActive
                  ? "flex items-center rounded-lg w-full px-2 py-1 h-10 bg-[#ADFF2F] text-white"
                  : "flex items-center rounded-lg w-full px-2 py-1 h-10 bg-white text-black"
              }
            >
              Post
            </NavLink>
            <NavLink
              to="/work"
              className={({ isActive, isPending }) =>
                isPending
                  ? "pending"
                  : isActive
                  ? "flex items-center rounded-lg w-full px-2 py-1 h-10 bg-[#ADFF2F] text-white"
                  : "flex items-center rounded-lg w-full px-2 py-1 h-10 bg-white text-black"
              }
            >
              Work Out
            </NavLink>
            <NavLink
              to="/meal"
              className={({ isActive, isPending }) =>
                isPending
                  ? "pending"
                  : isActive
                  ? "flex items-center rounded-lg w-full px-2 py-1 h-10 bg-[#ADFF2F] text-white"
                  : "flex items-center rounded-lg w-full px-2 py-1 h-10 bg-white text-black"
              }
            >
              Meal Plan
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive, isPending }) =>
                isPending
                  ? "pending"
                  : isActive
                  ? "flex items-center rounded-lg w-full px-2 py-1 h-10 bg-[#ADFF2F] text-white"
                  : "flex items-center rounded-lg w-full px-2 py-1 h-10 bg-white text-black"
              }
            >
              Profile
            </NavLink>
            <NavLink
              to="/setting"
              className={({ isActive, isPending }) =>
                isPending
                  ? "pending"
                  : isActive
                  ? "flex items-center rounded-lg w-full px-2 py-1 h-10 bg-[#ADFF2F] text-white"
                  : "flex items-center rounded-lg w-full px-2 py-1 h-10 bg-white text-black"
              }
            >
              setting
            </NavLink>
          </ul>
        </nav>
      </div>
      <div className="flex p-2">
        <button
          className="bg-[#ADFF2F] w-full text-white rounded p-2"
          onClick={() => {
            localStorage.removeItem("authUser");
            window.location.reload();
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
export default SideBar;
