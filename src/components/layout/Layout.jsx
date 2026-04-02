import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'

// Dark mode CSS variables — applied via JS because Tailwind v4 strips .dark {} blocks
const DARK_VARS = {
  '--color-surface': '#121212',
  '--color-surface-dim': '#1e1e1e',
  '--color-surface-bright': '#1a1a1a',
  '--color-surface-container': '#1e1e1e',
  '--color-surface-container-low': '#191919',
  '--color-surface-container-high': '#252525',
  '--color-surface-container-highest': '#2c2c2c',
  '--color-surface-container-lowest': '#0e0e0e',
  '--color-surface-variant': '#2c2c2c',
  '--color-surface-tint': '#c4c5dc',
  '--color-background': '#121212',
  '--color-primary': '#ffffff',
  '--color-primary-container': '#2d2f42',
  '--color-on-primary': '#000000',
  '--color-on-primary-container': '#c4c5dc',
  '--color-secondary': '#fea619',
  '--color-secondary-container': '#855300',
  '--color-on-secondary': '#000000',
  '--color-on-secondary-container': '#ffddb8',
  '--color-on-surface': '#e6e6e6',
  '--color-on-surface-variant': '#b0b0b6',
  '--color-on-background': '#e6e6e6',
  '--color-inverse-surface': '#e6e6e6',
  '--color-inverse-on-surface': '#1a1a1a',
  '--color-outline': '#555560',
  '--color-outline-variant': '#3a3a42',
  '--color-error': '#ff6b6b',
  '--color-error-container': '#93000a',
  '--color-on-error': '#ffffff',
  '--color-on-error-container': '#ffdad6',
}

export default function Layout() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false
    const saved = localStorage.getItem('clat-tribe-dark-mode')
    if (saved !== null) return saved === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (darkMode) {
      root.classList.add('dark')
      // Set dark mode variables via inline style to override Tailwind v4 @theme
      Object.entries(DARK_VARS).forEach(([key, value]) => {
        root.style.setProperty(key, value)
      })
    } else {
      root.classList.remove('dark')
      // Remove inline overrides so @theme light values take effect
      Object.keys(DARK_VARS).forEach(key => {
        root.style.removeProperty(key)
      })
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
