import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const SignIn = React.lazy(() => import('./pages/SignIn'))
const Dashboard = React.lazy(() => import('./pages/Dashboard'))


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/signin' element={<SignIn />}/>
        <Route path='/' element={<Dashboard />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App