import { NavLink } from 'react-router-dom'

const sideItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/article', icon: 'newspaper', label: 'Article' },
  { to: '/highlights', icon: 'style', label: 'Daily News' },
  { to: '/flashcards', icon: 'style', label: 'Flashcards' },
  { to: '/analytics', icon: 'leaderboard', label: 'Analytics' },
  { to: '/mocktest', icon: 'description', label: 'Mock Test' },
  { to: '/weeklyquiz', icon: 'quiz', label: 'Weekly Quiz' },
  { to: '/flowcharts', icon: 'account_tree', label: 'Flowcharts' },
  { to: '/monthly', icon: 'calendar_month', label: 'Monthly' },
  { to: '/staticgk', icon: 'menu_book', label: 'Static GK' },
  { to: '/legalca', icon: 'gavel', label: 'Legal CA' },
  { to: '/persons', icon: 'person', label: 'Persons in News' },
  { to: '/acts', icon: 'description', label: 'Acts & Bills' },
  { to: '/indices', icon: 'analytics', label: 'Indices' },
  { to: '/pyq', icon: 'history_edu', label: 'PYQ Bank' },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col pt-20 pb-6 w-64 z-40 bg-surface border-r border-outline hidden lg:flex">
      <div className="px-6 mb-8">
        <h2 className="text-lg font-black text-on-surface">CLAT Tribe</h2>
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-on-surface-variant">Legal Excellence</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {sideItems.map(item => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `mx-4 flex items-center px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-secondary-container text-on-secondary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-dim'
              }`
            }
          >
            <span className="material-symbols-outlined mr-3 text-xl">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-6 mt-auto space-y-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-secondary to-secondary-container text-on-secondary">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-xl">local_fire_department</span>
            <p className="font-bold">12 Day Streak</p>
          </div>
          <div className="w-full bg-on-secondary/20 h-2 rounded-full overflow-hidden">
            <div className="bg-on-secondary w-2/3 h-full rounded-full"></div>
          </div>
          <p className="text-xs mt-2 opacity-90">Keep it up! 8 more days for reward</p>
        </div>
      </div>
    </aside>
  )
}
