import React from 'react'
import Login from './componets/Login'
import Home from './componets/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UserProvider } from './context/userContext'
const App = () => {
  return (
    <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </BrowserRouter>
    </UserProvider>
  )
}

export default App