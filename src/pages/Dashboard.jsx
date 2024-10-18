import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
// import './Style.css'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Home from './components/Home'
import ActivityStatus from './components/Table'

function Dashboard() {
    const [openSidebarToggle, setOpenSidebarToggle] = useState(false)
  
    const OpenSidebar = () => {
      setOpenSidebarToggle(!openSidebarToggle)
    }
  return (
    <>
      <div >
      <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar}/>
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
      <Home />
    </div>
        {/* /* <Link to={'/'} className='bg-blue-600 text-white my-5 mx-10 p-4 rounded'>SignIn</Link>*/}
      </div>
    </>
  )
}

export default Dashboard
