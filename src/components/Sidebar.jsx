import "./Style.css";
import { BsPersonCircle } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { SideBarData } from "../data/sidebar";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title border-b-2">
        <div className="sidebar-brand flex gap-2">
          <BsPersonCircle className="w-8 h-8" /> Builder Admin
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>

      <ul className="mx-9 grid gap-3">
        {SideBarData.map((item) => (
          <li
            className="w-full flex justify-start items-center text-lg font-semibold"
            key={item.id}
          >
            <NavLink
              style={{ textDecoration: "none" }}
              to={item.route}
              className={({ isActive }) =>
                `flex gap-3 duration-200 hover:text-white items-center ${
                  isActive ? "text-white" : "text-gray-500"
                }`
              }
            >
              {item.icon} {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
export default Sidebar;
