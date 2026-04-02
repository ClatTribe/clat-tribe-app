import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'

export default function Layout() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false
    const saved = localStorage.getItem('clat-tribe-dark-mode')
    if (saved !== null) return saved === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('clat-tribe-dark-mode', darkMode)
  }, [darkMode])

  const handleToggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  return (
    <>
      <Navbar darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />
      <div className="flex min-h-[calc(100vh-4rem)] bg-surface">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-6 md:p-10 pt-6 pb-20 md:pb-10">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </>
  )
}
