import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/article', label: 'Article' },
  { to: '/mocktest', label: 'Mock Test' },
  { to: '/analytics', label: 'Analytics' },
]

export default function Navbar({ darkMode, onToggleDarkMode }) {
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
          <span className="text-sm font-bold text-on-surface">1,240 XP</span>
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

        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-secondary-container flex items-center justify-center text-on-secondary text-xs font-bold">
          CT
        </div>
      </div>
    </header>
  )
}
