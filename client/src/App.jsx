import { useState,React } from 'react'
import { BrowserRouter as Router, Routes, Route } from'react-router-dom'
import HomePage from './pages/HomePage'
import About from './pages/AboutPage'
import Profile from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import { ThemeProvider } from './global/ThemeContext'
import './App.css'

function App() {



  return (
    <ThemeProvider>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage  />} />
        <Route path="/dashboard" element={<DashboardPage  />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
    </ThemeProvider>
  )
}

export default App
