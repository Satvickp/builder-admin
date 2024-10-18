import { Outlet } from 'react-router-dom'
import { useState } from 'react'
// import './Style.css'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

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
      <Outlet />
    </div>
      </div>
    </>
  )
}

export default Dashboard
