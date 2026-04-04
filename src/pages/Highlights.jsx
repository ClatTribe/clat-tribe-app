import { useState, useEffect } from 'react'
import { getDailyNewsByDate, getLatestNewsDate } from '../lib/progress'

const categoryColors = {
  'Legal': 'bg-blue-50 border-blue-200',
  'Economy': 'bg-amber-50 border-amber-200',
  'International': 'bg-green-50 border-green-200',
  'Polity': 'bg-purple-50 border-purple-200',
  'Science': 'bg-teal-50 border-teal-200',
  'Environment': 'bg-emerald-50 border-emerald-200',
  'General': 'bg-slate-50 border-slate-200',
}

export default function Highlights() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [newsCards, setNewsCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [categories, setCategories] = useState(['All'])

  useEffect(() => {
    async function fetchNews() {
      setLoading(true)
      try {
        const latestDate = await getLatestNewsDate()
        if (!latestDate) {
          setNewsCards([])
          setLoading(false)
          return
        }

        setLastUpdated(latestDate)
        const news = await getDailyNewsByDate(latestDate)
        setNewsCards(news)

        const uniqueCats = [...new Set(news.map(n => n.category))]
        setCategories(['All', ...uniqueCats])
      } catch (err) {
        console.error('Error loading news:', err)
      }
      setLoading(false)
    }
    fetchNews()
  }, [])

  const filteredCards = activeFilter === 'all'
    ? newsCards
    : newsCards.filter(card => card.category.toLowerCase() === activeFilter.toLowerCase())

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="pt-6 px-0 md:px-2">
      {/* Header */}
      <header className="max-w-5xl mx-auto mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">Daily News</p>
            <h1 className="font-headline text-5xl md:text-6xl font-bold text-white leading-tight">
              Today's Headlines
            </h1>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-600">Last updated</p>
            <p className="text-xs font-bold text-secondary">{lastUpdated ? formatDate(lastUpdated) : '\u2014'}</p>
            <p className="text-xs text-slate-500">at 6:00 AM IST</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat.toLowerCase())}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeFilter === cat.toLowerCase() ? 'bg-secondary text-white shadow-lg' : 'bg-surface-container-low text-slate-600 hover:bg-slate-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {loading && (
        <div className="max-w-5xl mx-auto text-center py-16">
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block animate-spin">progress_activity</span>
          <p className="text-slate-600 font-medium">Loading today's news...</p>
        </div>
      )}

      {!loading && (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {filteredCards.map((card) => (
            <a
              key={card.id}
              href={card.source_url || '#'}
              target={card.source_url ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className={`rounded-2xl p-6 border-2 shadow-sm hover:shadow-lg transition-all cursor-pointer group ${categoryColors[card.category] || categoryColors['General']}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 bg-white/60 px-3 py-1 rounded-full">
                    {card.category}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500">
                    {card.source}
                  </span>
                </div>
                <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-600 transition-colors">
                  arrow_outward
                </span>
              </div>

              <h3 className="font-headline text-lg font-bold text-slate-800 mb-3 group-hover:text-[#060818] transition-colors leading-tight">
                {card.headline}
              </h3>

              <p className="text-sm text-slate-700 leading-relaxed mb-4">
                {card.summary}
              </p>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 group-hover:text-secondary transition-colors">
                <span>Read More</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                  trending_flat
                </span>
              </div>
            </a>
          ))}
        </div>
      )}

      {!loading && filteredCards.length === 0 && (
        <div className="max-w-5xl mx-auto text-center py-16">
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">newspaper</span>
          <p className="text-slate-600 font-medium">No articles in this category yet.</p>
        </div>
      )}
    </div>
  )
}
