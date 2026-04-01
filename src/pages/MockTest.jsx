import { useState } from 'react'

const subjects = [
  { icon: 'gavel', name: 'Legal Aptitude', desc: 'Constitution, Torts & Contracts', defaultChecked: true },
  { icon: 'menu_book', name: 'English Proficiency', desc: 'Comprehension & Vocabulary', defaultChecked: true },
  { icon: 'psychology', name: 'Logical Reasoning', desc: 'Critical & Analytical Logic' },
  { icon: 'public', name: 'Current Affairs', desc: 'GK & Contemporary News' },
  { icon: 'calculate', name: 'Quantitative Tech.', desc: 'Data Interpretation & Math' },
]

const difficulties = [
  { icon: 'school', name: 'Beginner', desc: 'Fundamental concepts with detailed post-test explanations.' },
  { icon: 'trending_up', name: 'Intermediate', desc: 'Standard CLAT patterns with time-pressure simulations.' },
  { icon: 'workspace_premium', name: 'Advanced', desc: 'Highly complex legal reasoning and dense technical passages.' },
]

export default function MockTest() {
  const [questionCount, setQuestionCount] = useState(20)
  const [difficulty, setDifficulty] = useState('Beginner')
  const [selectedSubjects, setSelectedSubjects] = useState(['Legal Aptitude', 'English Proficiency'])
  const [adaptive, setAdaptive] = useState(true)

  const toggleSubject = (name) => {
    setSelectedSubjects(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    )
  }

  return (
    <div className="max-w-5xl mx-auto pt-6">
      {/* Header */}
      <div className="mb-12">
        <nav className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-[0.05em] text-outline">
          <a className="hover:text-secondary transition-colors" href="#">Dashboard</a>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <a className="hover:text-secondary transition-colors" href="#">Practice</a>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface">Customize</span>
        </nav>
        <h1 className="font-headline text-5xl md:text-6xl text-primary mb-4 leading-tight">
          Architect Your <span className="font-headline italic">Intelligence.</span>
        </h1>
        <p className="font-body text-on-surface-variant max-w-2xl text-lg">
          Refine the parameters of your mock exam to align with your current learning trajectory. Professional curation for the serious legal scholar.
        </p>
      </div>

      <div className="space-y-16">
        {/* Subject Selection */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-[1px] bg-secondary"></span>
            <h2 className="font-label text-xs font-bold uppercase tracking-[0.05em] text-secondary">01. Subject Selection</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map(s => (
              <button
                key={s.name}
                onClick={() => toggleSubject(s.name)}
                className={`p-6 rounded-xl text-left transition-all duration-300 hover:bg-surface-container-high active:scale-95 ${
                  selectedSubjects.includes(s.name)
                    ? 'border border-secondary bg-surface-container-lowest'
                    : 'bg-surface-container-low border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="material-symbols-outlined text-secondary">{s.icon}</span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedSubjects.includes(s.name) ? 'bg-secondary border-secondary' : 'border-outline-variant'}`}>
                    {selectedSubjects.includes(s.name) && <span className="material-symbols-outlined text-[14px] text-white">check</span>}
                  </div>
                </div>
                <span className="font-headline text-xl text-primary block">{s.name}</span>
                <p className="text-xs text-on-surface-variant mt-1 font-body">{s.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Config */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-[1px] bg-secondary"></span>
              <h2 className="font-label text-xs font-bold uppercase tracking-[0.05em] text-secondary">02. Parameters</h2>
            </div>
            <div className="space-y-10">
              <div>
                <label className="block font-label text-xs font-bold uppercase tracking-[0.05em] text-on-surface-variant mb-4">Number of Questions</label>
                <div className="flex bg-surface-container-low p-1 rounded-xl">
                  {[20, 50, 100, 120].map(n => (
                    <button key={n} onClick={() => setQuestionCount(n)} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${questionCount === n ? 'bg-surface-container-lowest shadow-sm text-primary' : 'text-on-surface-variant hover:text-primary'}`}>{n}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block font-label text-xs font-bold uppercase tracking-[0.05em] text-on-surface-variant">Time Limit</label>
                  <span className="text-secondary font-bold text-sm">60 Minutes</span>
                </div>
                <input className="w-full h-1.5 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-secondary" max="180" min="30" type="range" defaultValue="60" />
                <div className="flex justify-between mt-2 text-[10px] text-outline uppercase font-bold tracking-widest">
                  <span>30m</span><span>180m</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-[1px] bg-secondary"></span>
              <h2 className="font-label text-xs font-bold uppercase tracking-[0.05em] text-secondary">03. Proficiency Level</h2>
            </div>
            <div className="space-y-4">
              {difficulties.map(d => (
                <button
                  key={d.name}
                  onClick={() => setDifficulty(d.name)}
                  className={`w-full flex items-start gap-4 p-5 rounded-xl text-left transition-all ${
                    difficulty === d.name
                      ? 'bg-surface-container-lowest border border-secondary'
                      : 'bg-surface-container-low border border-transparent'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary">{d.icon}</span>
                  </div>
                  <div>
                    <div className="font-headline text-lg text-primary">{d.name}</div>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{d.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Adaptive + CTA */}
        <section className="p-8 md:p-12 rounded-2xl bg-primary-container relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary opacity-5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                </div>
                <h3 className="font-headline text-2xl text-white">Adaptive Difficulty</h3>
              </div>
              <p className="text-on-primary-container text-sm max-w-lg leading-relaxed">
                Difficulty adjusts based on your recent topic performance using our <span className="text-secondary-container font-bold">Elo-rating system</span>. The algorithm identifies your weak points and challenges you exactly where growth is needed.
              </p>
            </div>
            <div className="flex flex-col items-center gap-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={adaptive} onChange={() => setAdaptive(!adaptive)} />
                <div className="w-14 h-7 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                <span className="ms-3 text-sm font-bold text-white uppercase tracking-widest">Active</span>
              </label>
              <button className="w-full md:w-auto px-10 py-5 bg-secondary text-on-secondary rounded-xl font-bold text-base hover:bg-secondary-container transition-all shadow-lg active:scale-95 group">
                <span className="flex items-center justify-center gap-2">
                  Start Practice Test
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer Note */}
      <aside className="mt-20 border-l-4 border-secondary bg-surface-container-low p-8 rounded-r-xl mb-12">
        <h4 className="font-label text-xs font-bold uppercase tracking-[0.05em] text-secondary mb-2">Proctor's Note</h4>
        <p className="font-body text-on-surface-variant text-sm italic leading-relaxed">
          "Preparation is not the act of answering questions you already know; it is the disciplined pursuit of those that currently escape your reasoning. Ensure your subject selection targets your lowest percentile areas for maximum efficacy."
        </p>
      </aside>
    </div>
  )
}
