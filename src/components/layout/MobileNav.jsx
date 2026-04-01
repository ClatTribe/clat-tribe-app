import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const mainItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Home' },
  { to: '/flashcards', icon: 'style', label: 'Cards' },
  { to: '/mocktest', icon: 'quiz', label: 'Tests' },
  { to: '/staticgk', icon: 'menu_book', label: 'GK' },
]

const moreItems = [
  { to: '/article', icon: 'newspaper', label: 'Article' },
  { to: '/highlights', icon: 'style', label: 'Highlights' },
  { to: '/analytics', icon: 'leaderboard', label: 'Analytics' },
  { to: '/weeklyquiz', icon: 'quiz', label: 'Weekly Quiz' },
  { to: '/flowcharts', icon: 'account_tree', label: 'Flowcharts' },
  { to: '/monthly', icon: 'calendar_month', label: 'Monthly' },
  { to: '/legalca', icon: 'gavel', label: 'Legal CA' },
  { to: '/persons', icon: 'person', label: 'Persons' },
  { to: '/acts', icon: 'description', label: 'Acts' },
  { to: '/indices', icon: 'analytics', label: 'Indices' },
  { to: '/pyq', icon: 'history_edu', label: 'PYQ' },
]

export default function MobileNav() {
  const [showMore, setShowMore] = useState(false)

  return (
    <>
      <nav className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-xl border-t border-outline flex justify-around items-center h-16 md:hidden z-50">
        {mainItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors ${
                isActive ? 'text-secondary bg-secondary-container/20' : 'text-on-surface-variant'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined text-lg"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span className="text-[10px] font-bold mt-0.5">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        <button
          onClick={() => setShowMore(!showMore)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors ${
            showMore ? 'text-secondary bg-secondary-container/20' : 'text-on-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-lg">more_horiz</span>
          <span className="text-[10px] font-bold mt-0.5">More</span>
        </button>
      </nav>

      {showMore && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setShowMore(false)}>
          <div className="absolute bottom-16 right-4 bg-surface border border-outline rounded-2xl shadow-lg p-2 max-w-xs w-64">
            <div className="space-y-1">
              {moreItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setShowMore(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-secondary-container/30 text-secondary font-bold'
                        : 'text-on-surface-variant hover:bg-surface-dim'
                    }`
                  }
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
