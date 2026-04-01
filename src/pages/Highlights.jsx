import { useState } from 'react'

export default function Highlights() {
  const [activeFilter, setActiveFilter] = useState('all')

  const newsCards = [
    {
      id: 1,
      category: 'Legal',
      headline: 'Supreme Court Digital Privacy Ruling Expands Article 21 Protections',
      summary: 'Five-judge bench unanimously held that right to digital privacy is fundamental. Section 69A IT Act partially struck down for blanket shutdowns without judicial oversight.',
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 2,
      category: 'International',
      headline: 'ICJ Declares Climate Change Mitigation a Binding State Obligation',
      summary: 'Landmark advisory opinion votes 12-3 that states must reduce GHG emissions under customary law. Paris Agreement 1.5°C target declared binding benchmark.',
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 3,
      category: 'Economy',
      headline: 'RBI Hikes Repo Rate by 25 bps Amid Food Inflation Concerns',
      summary: 'Monetary Policy Committee votes 4-2 to raise Repo Rate to 7.0%. Food inflation at 8.2% cited as primary driver for third consecutive rate hike.',
      color: 'bg-amber-50 border-amber-200'
    },
    {
      id: 4,
      category: 'Legal',
      headline: 'Sedition Law Replaced: Section 124A IPC Gives Way to Narrower BNS 152',
      summary: 'Criminal Laws Amendment Bill replaces broad sedition definition. New law requires actual incitement to violence, narrows government criticism liability.',
      color: 'bg-purple-50 border-purple-200'
    },
    {
      id: 5,
      category: 'International',
      headline: 'India Re-elected to UN Human Rights Council for 2027-2029 Term',
      summary: 'Strong diplomatic victory with 184 votes in UNGA. Marks India\'s sixth term on 47-member human rights body, affirming standing on global stage.',
      color: 'bg-rose-50 border-rose-200'
    },
    {
      id: 6,
      category: 'Legal',
      headline: 'NGT Orders Vedanta to Restore Mangrove Habitat in Coastal Zone',
      summary: 'Environmental tribunal applies polluter pays principle, invokes precautionary principle. Fine imposed for unauthorized construction in CRZ-I zone.',
      color: 'bg-teal-50 border-teal-200'
    }
  ]

  const filteredCards = activeFilter === 'all'
    ? newsCards
    : newsCards.filter(card => card.category.toLowerCase() === activeFilter.toLowerCase())

  const categories = ['All', 'Legal', 'Economy', 'International']

  return (
    <div className="pt-6 px-0 md:px-2">
      {/* Header */}
      <header className="max-w-5xl mx-auto mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">Daily News</p>
            <h1 className="font-headline text-5xl md:text-6xl font-bold text-[#060818] leading-tight">
              Today's Headlines
            </h1>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-600">Last updated</p>
            <p className="text-xs font-bold text-secondary">March 31, 2026</p>
            <p className="text-xs text-slate-500">at 9:00 AM IST</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat.toLowerCase())}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                activeFilter === cat.toLowerCase()
                  ? 'bg-secondary text-white shadow-lg'
                  : 'bg-surface-container-low text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* News Cards Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            className={`rounded-2xl p-6 border-2 shadow-sm hover:shadow-lg transition-all cursor-pointer group ${card.color}`}
          >
            {/* Category Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 bg-white/60 px-3 py-1 rounded-full">
                {card.category}
              </span>
              <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-600 transition-colors">
                arrow_outward
              </span>
            </div>

            {/* Headline */}
            <h3 className="font-headline text-lg font-bold text-slate-800 mb-3 group-hover:text-[#060818] transition-colors leading-tight">
              {card.headline}
            </h3>

            {/* Summary */}
            <p className="text-sm text-slate-700 leading-relaxed mb-4">
              {card.summary}
            </p>

            {/* Read More */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-600 group-hover:text-secondary transition-colors">
              <span>Read More</span>
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                trending_flat
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCards.length === 0 && (
        <div className="max-w-5xl mx-auto text-center py-16">
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 block">newspaper</span>
          <p className="text-slate-600 font-medium">No articles in this category yet.</p>
        </div>
      )}
    </div>
  )
}
