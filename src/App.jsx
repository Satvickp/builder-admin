import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignIn from './pages/SignIn'
import Dashboard from './pages/Dashboard';

// const SignIn = React.lazy(() => import('./pages/SignIn'))
// const Dashboard = React.lazy(() => import('./pages/Dashboard'))


function App() {
  return (
    <BrowserRouter>
        <Routes>
        <Route path='/' element={<SignIn />}/>
        <Route path='/dashboard' element={<Dashboard />}/>
      </Routes>  
      {/* <SignIn/> */}
    </BrowserRouter>

  )
}

export default App