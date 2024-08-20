import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  const [values, setValues] = useState({ usernameOrEmail: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const { usernameOrEmail, password } = values;
    let errors = {};

    if (usernameOrEmail.trim() === '') {
      errors.usernameOrEmail = 'Username or Email is required';
    }
    if (password.trim() === '') {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post('http://localhost:3000/user/login', {
          username: usernameOrEmail,
          password
        });

        if (response.status === 200) {
          const { token } = response.data;
          localStorage.setItem('token', token);
          navigate('/dashboard');
        } else {
          setErrors({ login: 'Login failed' });
        }
      } catch (error) {
        console.error('Login error:', error);
        if (error.response && error.response.status === 401) {
          setErrors({ login: 'Invalid username or password' });
        } else {
          setErrors({ login: 'An error occurred. Please try again.' });
        }
      }
    } else {
      setErrors(errors);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-700">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-8">Sign in</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700">Email / Username</label>
            <input
              type="text"
              name="usernameOrEmail"
              value={values.usernameOrEmail}
              onChange={handleInput}
              placeholder="Enter your Email or Username here"
              className="w-full mt-2 p-2 border rounded"
            />
            {errors.usernameOrEmail && <p className="text-red-500">{errors.usernameOrEmail}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleInput}
              placeholder="Password"
              className="w-full mt-2 p-2 border rounded"
            />
            {errors.password && <p className="text-red-500">{errors.password}</p>}
          </div>
          {errors.login && <p className="text-red-500">{errors.login}</p>}
          <button type="submit" className="w-full bg-indigo-700 text-white p-2 rounded">Sign in</button>
        </form>
        <div className="mt-4 text-center">
          <p>Don't have an account? <a href="/register" className="text-indigo-700">Register Now</a></p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
