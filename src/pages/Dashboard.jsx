import React from 'react'
import { Link } from 'react-router-dom'

function Dashboard() {
  return (
    <div>
      Dashboard
      <Link to={'/signin'} className='bg-blue-600 text-white my-5 mx-10 p-4 rounded'>SignIn</Link>
    </div>
  )
}

export default Dashboard
