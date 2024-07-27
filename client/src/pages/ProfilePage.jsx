import React from 'react'
import { useNavigate } from 'react-router-dom'

function Profile() {
  return (
    <div className='bg-slate-800 bg-center bg-no-repeat min-h-screen flex flex-col items-center justify-center'>
        <div>
        <h1 className='text-white text-5xl font-bold'>ProfilePage</h1>
        <h2 className='text-yellow-500 text-3xl font-bold flex flex-col hover:underline items-center'>My-Name</h2>
        </div>
    </div>
  )
}

export default Profile