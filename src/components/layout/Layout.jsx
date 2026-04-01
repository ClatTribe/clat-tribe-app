import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'

export default function Layout() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false
    return document.documentElement.classList.contains('dark')
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const handleToggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  return (
    <>
      <Navbar darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />
      <div className="flex min-h-screen bg-surface">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-6 md:p-10 pt-6">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </>
  )
}
