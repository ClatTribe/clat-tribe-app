import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/article', label: 'Article' },
  { to: '/mocktest', label: 'Mock Test' },
  { to: '/analytics', label: 'Analytics' },
]

export default function Navbar({ darkMode, onToggleDarkMode }) {
  const { user, profile, signOut } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Get user's initials for avatar fallback
  const getInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  // Get avatar URL (Google picture or fallback)
  const getAvatarUrl = () => {
    return user?.user_metadata?.avatar_url || null
  }

  const xp = profile?.xp || 0
  const userName = user?.user_metadata?.full_name || user?.email || 'User'
  const userEmail = user?.email || ''

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center w-full px-6 h-16 bg-surface/70 backdrop-blur-xl border-b border-outline/50 shadow-sm">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold tracking-tight text-on-surface font-headline">CLAT Tribe</span>
        <nav className="hidden md:flex gap-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium px-3 py-5 transition-colors ${
                  isActive
                    ? 'text-secondary font-bold border-b-2 border-secondary'
                    : 'text-on-surface-variant hover:bg-surface-dim'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-surface-dim rounded-full">
          <span className="material-symbols-outlined text-secondary text-lg">bolt</span>
          <span className="text-sm font-bold text-on-surface">
            {xp.toLocaleString()} XP
          </span>
        </div>

        <button
          onClick={onToggleDarkMode}
          className="theme-toggle p-2 hover:bg-surface-dim rounded-full transition-colors relative"
          title="Toggle dark mode"
        >
          <span className="material-symbols-outlined">
            {darkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        <button className="p-2 hover:bg-surface-dim rounded-full transition-colors relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full"></span>
        </button>

        {/* User Avatar Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center text-on-secondary text-xs font-bold hover:opacity-80 transition-opacity"
          >
            {getAvatarUrl() ? (
              <img
                src={getAvatarUrl()}
                alt={userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-secondary to-secondary-container flex items-center justify-center">
                {getInitials()}
              </div>
            )}
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-surface border border-outline rounded-lg shadow-lg p-2 z-50">
              <div className="px-3 py-2 border-b border-outline/30">
                <p className="text-sm font-bold text-on-surface">{userName}</p>
                <p className="text-xs text-on-surface-variant">{userEmail}</p>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false)
                  signOut()
                }}
                className="w-full mt-2 px-3 py-2 text-sm text-error hover:bg-error/10 rounded transition-colors text-left font-medium"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
