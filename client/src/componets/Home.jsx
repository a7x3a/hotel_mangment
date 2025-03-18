import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../context/userContext'
const Home = () => {  
  const { user, setUser } = useContext(UserContext) 
  const navigate = useNavigate()
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-5'>
      <h1 className='text-2xl font-bold '>Welcome to the Home Page</h1>
      <span className='text-sm text-gray-500'>{user?.email}</span>
      <button className='bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition-all duration-300 rounded-md cursor-pointer' onClick={() => navigate('/login')}>Logout</button>
    </div>
  )
} 

export default Home