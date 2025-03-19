import React from "react";
import "./Style.css";
import {
  BsFillBellFill,
  BsFillEnvelopeFill,
  BsPersonCircle,
  BsSearch,
  BsJustify,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/Features/UserSlice"; 

function Header({ OpenSidebar }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("USER_TOKEN");
    dispatch(setUser(null));
    navigate("/", { replace: true });
  };

  return (
    <header className="header">
      <div className="menu-icon">
        <BsJustify className="icon" onClick={OpenSidebar} />
      </div>
      <div className="header-left text-white">
        <BsSearch className="icon" />
      </div>
      <div className="header-right text-white">
        <BsFillBellFill className="icon" />
        <BsFillEnvelopeFill className="icon" />
        <BsPersonCircle
          className="icon hover:cursor-pointer"
          onClick={handleLogout}
        />
      </div>
    </header>
  );
}

export default Header;
