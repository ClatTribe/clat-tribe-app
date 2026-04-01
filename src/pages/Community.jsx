export default function Community() {
  return (
    <div className="flex gap-10 pt-4">
      {/* Discussion Feed */}
      <section className="flex-1 max-w-3xl">
        {/* Ask a Question */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm mb-10 border border-outline-variant/10">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-secondary-container flex items-center justify-center text-white font-bold text-sm shrink-0">AG</div>
            <div className="flex-1">
              <textarea className="w-full bg-surface-container-low border-none rounded-lg p-4 focus:ring-2 focus:ring-secondary/50 transition-all font-body text-on-surface resize-none" placeholder="Discuss a legal concept or ask a question..." rows="3"></textarea>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <button className="p-2 text-slate-500 hover:bg-surface-container-low rounded-lg transition-all"><span className="material-symbols-outlined">image</span></button>
                  <button className="p-2 text-slate-500 hover:bg-surface-container-low rounded-lg transition-all"><span className="material-symbols-outlined">link</span></button>
                  <button className="p-2 text-slate-500 hover:bg-surface-container-low rounded-lg transition-all"><span className="material-symbols-outlined">list</span></button>
                </div>
                <button className="bg-secondary text-on-secondary px-6 py-2 rounded-lg font-bold text-sm tracking-wide">Start a Discussion</button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          <PostCard
            name="Advait G."
            badge="Top Contributor"
            time="2 hours ago"
            title="The nuances of Article 21 and the evolving 'Right to Privacy'"
            body="With the recent judgements, how do you all perceive the balance between state security and individual privacy? In the context of CLAT 2024, I believe the K.S. Puttaswamy case remains the bedrock. What are your thoughts on the impact of the new DPDP Act on this constitutional right?"
            quote={'"No person shall be deprived of his life or personal liberty except according to procedure established by law." — Article 21, Constitution of India'}
            votes={124}
          />
          <PostCard
            name="Priya S."
            time="5 hours ago"
            title="Clarification needed on 'Doctrine of Eclipse' vs 'Severability'"
            body="I'm getting slightly confused between how these apply to pre-constitutional and post-constitutional laws. Can someone simplify the application of Article 13 in these scenarios?"
            votes={42}
          />
        </div>
      </section>

      {/* Right Sidebar */}
      <aside className="w-80 space-y-8 hidden lg:block">
        {/* Trending */}
        <div className="bg-surface-container-low rounded-xl p-6">
          <h4 className="font-headline text-lg font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
            Trending Topics
          </h4>
          <div className="space-y-4">
            <TrendingItem tag="#ConstitutionalLaw" title="Emergency Provisions & Article 356" />
            <TrendingItem tag="#CurrentAffairs" title="G20 Summit: Legal Implications" />
            <TrendingItem tag="#LegalReasoning" title="Law of Torts: Vicarious Liability" />
            <TrendingItem tag="#MockAnalysis" title="Ailing scores in Logic section" />
          </div>
          <button className="w-full mt-6 text-sm font-bold text-secondary text-center uppercase tracking-widest hover:underline">View All Topics</button>
        </div>

        {/* Top Mentors */}
        <div className="bg-surface-container-low rounded-xl p-6">
          <h4 className="font-headline text-lg font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            Top Mentors
          </h4>
          <div className="space-y-5">
            <MentorItem name="Dr. Rajesh Kumar" role="Constitutional Expert" />
            <MentorItem name="Ananya V." role="Rank 4, CLAT '23" />
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary-container p-8 rounded-xl relative overflow-hidden">
          <div className="relative z-10">
            <h5 className="font-headline text-white text-xl font-bold mb-2 italic">Join the Elite Circle</h5>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">Unlock exclusive study material and private webinars by contributing to the community.</p>
            <button className="bg-amber-600 text-white w-full py-3 rounded-lg font-bold hover:bg-amber-500 transition-all">Go Pro</button>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary opacity-10 rounded-full -mr-16 -mt-16"></div>
        </div>
      </aside>
    </div>
  )
}

function PostCard({ name, badge, time, title, body, quote, votes }) {
  const initials = name.split(' ').map(n => n[0]).join('')
  return (
    <article className="bg-surface-container-lowest rounded-xl p-8 shadow-sm transition-transform hover:scale-[1.005] duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className="flex gap-4 items-center">
          <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold text-slate-600">{initials}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-on-surface">{name}</span>
              {badge && <span className="text-[10px] font-bold uppercase tracking-wider bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full">{badge}</span>}
            </div>
            <span className="text-xs text-slate-400 font-medium">{time}</span>
          </div>
        </div>
        <button className="text-slate-400 hover:text-on-surface"><span className="material-symbols-outlined">more_horiz</span></button>
      </div>
      <div className="space-y-4">
        <h3 className="font-headline text-2xl font-bold leading-snug">{title}</h3>
        <p className="font-body text-slate-600 leading-relaxed">{body}</p>
        {quote && (
          <div className="border-l-4 border-secondary bg-surface-container-highest/30 p-4 rounded-r-lg">
            <p className="text-sm italic font-headline text-slate-700">{quote}</p>
          </div>
        )}
      </div>
      <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-8">
        <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-full">
          <button className="text-slate-500 hover:text-amber-600"><span className="material-symbols-outlined text-xl">arrow_upward</span></button>
          <span className="font-bold text-sm">{votes}</span>
          <button className="text-slate-500 hover:text-amber-600"><span className="material-symbols-outlined text-xl">arrow_downward</span></button>
        </div>
        <button className="flex items-center gap-2 text-slate-600 hover:text-secondary font-bold text-sm transition-all">
          <span className="material-symbols-outlined text-xl">forum</span> Reply
        </button>
        <button className="flex items-center gap-2 text-slate-600 hover:text-secondary font-bold text-sm transition-all">
          <span className="material-symbols-outlined text-xl">share</span> Share
        </button>
      </div>
    </article>
  )
}

function TrendingItem({ tag, title }) {
  return (
    <a className="block group" href="#">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">{tag}</span>
      <span className="text-on-surface font-semibold group-hover:text-secondary transition-colors">{title}</span>
    </a>
  )
}

function MentorItem({ name, role }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2)
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center text-xs font-bold">{initials}</div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-surface-container-low rounded-full"></div>
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-on-surface">{name}</p>
        <p className="text-[10px] text-slate-500 font-medium">{role}</p>
      </div>
      <button className="text-secondary text-xs font-bold uppercase hover:bg-white px-2 py-1 rounded transition-colors">Follow</button>
    </div>
  )
}
