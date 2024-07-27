import React from 'react'

function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-700 to-indigo-900">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <svg className="w-12 h-12 text-indigo-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8.44 12.44a1 1 0 011.12 1.68A5 5 0 1115 10h1.09A6 6 0 108.44 12.44zM10 3a7 7 0 100 14A7 7 0 0010 3z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-indigo-700">App Name</h2>
          <p className="text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
        <h2 className="text-2xl font-bold text-center mb-8">Sign up</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Email / User Name</label>
            <input type="email" placeholder="Enter your Email here" className="w-full mt-2 p-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input type="password" placeholder="Password" className="w-full mt-2 p-2 border rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Confirm Password</label>
            <input type="password" placeholder="Confirm Password" className="w-full mt-2 p-2 border rounded" />
          </div>
          <button type="submit" className="w-full bg-purple-700 text-white p-2 rounded">Sign up</button>
        </form>
        <div className="mt-4 text-center">
          OR SIGN UP WITH
          <div className="mt-2">
            <button className="w-10 h-10 bg-blue-500 text-white rounded-full mx-2">F</button>
            <button className="w-10 h-10 bg-red-500 text-white rounded-full mx-2">G</button>
          </div>
          <p className="mt-4">Already have an account? <a href="/" className="text-purple-700">Sign in</a></p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage