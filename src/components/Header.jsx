import React from 'react'
import './Style.css'
import 
 {BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsSearch, BsJustify}
 from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'

function Header({OpenSidebar}) {

  const navigate = useNavigate();

  function handleLogout(){
    window.sessionStorage.removeItem("token")
    navigate("/");
  };

  return (
    <header className='header'>
        <div className='menu-icon'>
            <BsJustify className='icon' onClick={OpenSidebar}/>
        </div>
        <div className='header-left text-white'>
            <BsSearch  className='icon'/>
        </div>
        <div className='header-right text-white ' >
            <BsFillBellFill className='icon'/>
            <BsFillEnvelopeFill className='icon'/>
            <BsPersonCircle className='icon' onClick={handleLogout}/>
        </div>
    </header>
  )
}

export default Header