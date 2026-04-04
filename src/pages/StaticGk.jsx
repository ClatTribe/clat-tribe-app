import { useState } from 'react'
import { staticGkData } from '../data/staticGk'

export default function StaticGk() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [expandedCard, setExpandedCard] = useState(null)

  const categories = [
    { id: 'all', label: 'All', icon: 'apps' },
    { id: 'polity', label: 'Polity', icon: 'account_balance' },
    { id: 'legal', label: 'Legal', icon: 'gavel' },
    { id: 'economy', label: 'Economy', icon: 'payments' },
    { id: 'environment', label: 'Environment', icon: 'eco' },
    { id: 'international', label: 'International', icon: 'public' }
  ]

  const filteredData = staticGkData.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.cat === activeCategory
    const matchesSearch = searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.preview.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const groupedByCategory = categories.reduce((acc, cat) => {
    if (cat.id === 'all') return acc
    acc[cat.id] = filteredData.filter(item => item.cat === cat.id)
    return acc
  }, {})

  return (
    <div className="pt-6 px-0 md:px-2 pb-16">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">Static Knowledge</p>
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-white mb-8">General Knowledge Bank</h1>

        {/* Search Bar */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search for articles, keywords, concepts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 bg-white rounded-2xl border-2 border-slate-200 focus:border-secondary focus:outline-none text-slate-800 placeholder-slate-400"
          />
          <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                activeCategory === cat.id
                  ? 'bg-secondary text-white shadow-lg'
                  : 'bg-surface-container-low text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-5xl mx-auto mb-8">
        <p className="text-sm text-slate-600">
          <strong className="text-slate-800">{filteredData.length}</strong> article{filteredData.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Content Grid */}
      {filteredData.length > 0 ? (
        <div className="max-w-5xl mx-auto">
          {activeCategory === 'all' ? (
            // Group by category when "All" is selected
            <div className="space-y-12">
              {Object.entries(groupedByCategory).map(([catId, items]) => {
                if (items.length === 0) return null
                const catLabel = categories.find(c => c.id === catId)?.label

                return (
                  <div key={catId}>
                    <h3 className="font-headline text-2xl font-bold text-[#060818] mb-6 flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary">
                        {categories.find(c => c.id === catId)?.icon}
                      </span>
                      {catLabel}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {items.map((item) => (
                        <GkCard
                          key={item.title}
                          item={item}
                          expanded={expandedCard === item.title}
                          onToggle={() => setExpandedCard(expandedCard === item.title ? null : item.title)}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            // Single category grid
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredData.map((item) => (
                <GkCard
                  key={item.title}
                  item={item}
                  expanded={expandedCard === item.title}
                  onToggle={() => setExpandedCard(expandedCard === item.title ? null : item.title)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-5xl mx-auto text-center py-16">
          <span className="material-symbols-outlined text-6xl text-slate-300 block mb-4">article</span>
          <p className="text-slate-600 font-medium">No articles found matching your search.</p>
        </div>
      )}
    </div>
  )
}

function GkCard({ item, expanded, onToggle }) {
  return (
    <div
      onClick={onToggle}
      className="bg-white rounded-2xl border-2 border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-100 hover:bg-slate-50 transition-colors">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h4 className="font-bold text-slate-800 mb-2 leading-tight">{item.title}</h4>
            <p className="text-sm text-slate-600 line-clamp-2">{item.preview}</p>
          </div>
          <span className={`material-symbols-outlined text-secondary flex-shrink-0 transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}>
            expand_more
          </span>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-6 py-6 bg-slate-50 border-t border-slate-100">
          <p className="text-sm text-slate-700 leading-relaxed">{item.content}</p>
        </div>
      )}
    </div>
  )
}
