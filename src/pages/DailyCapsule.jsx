import { useState } from 'react'

export default function DailyCapsule() {
  const [selectedAnswer, setSelectedAnswer] = useState(1)

  return (
    <div className="pt-6 px-0 md:px-2">
      {/* Editorial Header */}
      <header className="max-w-5xl mx-auto mb-16">
        <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant/60 mb-6">
          <a className="hover:text-secondary transition-colors" href="#">Archive</a>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <a className="hover:text-secondary transition-colors" href="#">Daily Capsule</a>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-secondary">Current Affairs</span>
        </nav>
        <h1 className="font-headline text-5xl md:text-7xl font-bold text-[#060818] leading-[1.1] mb-8 tracking-tight">
          The Constitutional Implications of Digital Sovereign Identity
        </h1>
        <div className="flex flex-wrap items-center gap-8 border-y border-outline-variant/30 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-xl">gavel</span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Authored By</p>
              <p className="text-sm font-bold">Legal Editorial Board</p>
            </div>
          </div>
          <div className="h-8 w-px bg-outline-variant/30 hidden md:block"></div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">schedule</span>
              <span className="text-sm font-medium">12 Min Read</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">description</span>
              <span className="text-sm font-medium">1,450 Words</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">calendar_today</span>
              <span className="text-sm font-medium">Oct 24, 2023</span>
            </div>
          </div>
        </div>
      </header>

      {/* Two-Column Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Article Content */}
        <article className="lg:col-span-8 space-y-8">
          <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-12 shadow-[0_20px_40px_rgba(25,28,29,0.03)] border border-outline-variant/10">
            <div className="prose prose-slate max-w-none">
              <p className="drop-cap font-headline text-xl md:text-2xl leading-[1.8] text-[#060818] mb-8">
                In an era where the digital footprint often precedes the physical presence, the concept of 'Sovereign Identity' has transcended technical circles to become a cornerstone of modern jurisprudence. The intersection of Article 21 and the right to be forgotten has created a new legal frontier that challenges our traditional understanding of personal liberty and state overreach.
              </p>
              <p className="font-headline text-xl md:text-2xl leading-[1.8] text-[#060818] mb-8">
                Recent judicial pronouncements suggest a shift towards recognizing 'informational self-determination' as a fundamental facet of human dignity. Unlike traditional identity documents issued by a centralized authority, decentralized digital identity frameworks allow individuals to own and control their credentials without relying on third-party intermediaries.
              </p>

              <div className="my-10 pl-6 border-l-4 border-secondary bg-surface-container-low py-6 pr-8 rounded-r-2xl">
                <span className="text-[10px] font-black uppercase tracking-widest text-secondary block mb-2">Legal Definition</span>
                <p className="text-sm font-medium italic leading-relaxed text-on-surface-variant">
                  "Informational Self-Determination refers to the right of an individual to decide for themselves, on the basis of the idea of self-determination, when and within what limits information about their private life should be communicated to others."
                </p>
              </div>

              <p className="font-headline text-xl md:text-2xl leading-[1.8] text-[#060818] mb-8">
                However, this technological liberation brings significant legislative hurdles. How does the state balance its duty of law enforcement with the individual's right to cryptographically-shielded privacy? The Personal Data Protection bill attempts to bridge this gap, but legal scholars argue it leans heavily towards state-sanctioned surveillance under the guise of 'public interest.'
              </p>

              <div className="rounded-2xl overflow-hidden my-12 bg-surface-container-low">
                <div className="w-full h-[400px] bg-gradient-to-br from-primary-container to-[#2a2d4a] flex items-center justify-center">
                  <span className="material-symbols-outlined text-6xl text-white/20">account_balance</span>
                </div>
                <p className="text-xs text-center py-4 text-on-surface-variant italic">Fig 1: The Apex Court has consistently upheld the sanctity of individual privacy in the digital age.</p>
              </div>

              <p className="font-headline text-xl md:text-2xl leading-[1.8] text-[#060818]">
                The core of the CLAT-style inquiry remains: Can a machine-readable code ever truly represent the complex web of rights and obligations inherent in citizenship? As we move towards 'smart' contracts and algorithmic governance, the role of the lawyer shifts from mere interpreter to a critical auditor of digital infrastructure.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-8">
            <button className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
              Previous Article
            </button>
            <button className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors">
              Next: Tort Law Fundamentals
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </article>

        {/* Sidebar Quiz */}
        <aside className="lg:col-span-4 sticky top-24">
          <div className="bg-primary-container text-white rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary-container">verified_user</span>
                <h3 className="font-bold text-lg">Comprehension</h3>
              </div>
              <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full uppercase tracking-widest">Question 1 of 5</span>
            </div>
            <p className="text-lg font-headline leading-relaxed mb-8 text-on-primary-container">
              According to the passage, what is the primary distinction between traditional identity and 'Sovereign Identity'?
            </p>
            <div className="space-y-4">
              {[
                'A. The use of biometrics over physical paper documents.',
                'B. Individual control and ownership without centralized intermediaries.',
                'C. Mandatory state surveillance in public interest.',
                'D. The complete abolition of Article 21 protections.'
              ].map((opt, i) => (
                <label key={i} className="group block cursor-pointer">
                  <input type="radio" name="quiz" className="hidden peer" checked={selectedAnswer === i} onChange={() => setSelectedAnswer(i)} />
                  <div className="bg-white/5 border border-white/10 p-4 rounded-xl peer-checked:bg-secondary-container peer-checked:text-primary-container transition-all group-hover:bg-white/10">
                    <span className="text-sm font-medium">{opt}</span>
                  </div>
                </label>
              ))}
            </div>

            {selectedAnswer === 1 && (
              <div className="mt-8 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-green-400 mt-0.5">info</span>
                  <p className="text-xs text-green-100/80 leading-relaxed">
                    <strong className="text-white block mb-1">Correct!</strong>
                    The passage highlights that decentralized frameworks allow individuals to own their credentials independently of third-party authorities.
                  </p>
                </div>
              </div>
            )}

            <button className="w-full mt-8 bg-secondary py-4 rounded-xl font-bold text-white hover:bg-secondary-container hover:text-primary-container transition-all flex items-center justify-center gap-2 group">
              Next Question
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">trending_flat</span>
            </button>
          </div>

          <div className="mt-8 bg-surface-container-low rounded-3xl p-6 border border-outline-variant/10">
            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">Reading Progress</h4>
            <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden mb-3">
              <div className="h-full bg-secondary w-2/3"></div>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-tighter">
              <span>3 Sections Completed</span>
              <span>67% Done</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}