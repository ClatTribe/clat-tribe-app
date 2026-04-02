export default function Dashboard() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative rounded-[2rem] p-8 md:p-12 overflow-hidden mb-10 bg-gradient-to-br from-[#060818] to-[#1E293B] shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-secondary text-on-secondary rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">Welcome Back, Counselor</span>
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">Your path to NLSIU is 64% complete.</h1>
          <p className="text-slate-300 text-lg mb-8 max-w-md font-body">Focus on Logical Reasoning today. You have 3 pending mocks and a constitutional brief to review.</p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-secondary text-on-secondary px-8 py-4 rounded-xl font-bold text-sm hover:bg-secondary-container transition-all shadow-[inset_0_-2px_0_rgba(0,0,0,0.1)]">
              RESUME STUDYING
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-sm hover:bg-white/20 transition-all">
              VIEW CALENDAR
            </button>
          </div>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]"></div>
      </section>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <MetricCard icon="timer" iconBg="bg-secondary-container/20" iconColor="text-secondary" badge="+12%" badgeColor="text-green-600 bg-green-50" label="Study Hours" value="42.5h" sub="v/s 38h last week" />
        <MetricCard icon="fact_check" iconBg="bg-blue-100" iconColor="text-blue-600" badge="On Track" badgeColor="text-slate-400 bg-slate-50" label="Mock Score Avg" value="88/120" sub="Target: 105+" />
        <MetricCard icon="psychology" iconBg="bg-purple-100" iconColor="text-purple-600" badge="+5" badgeColor="text-green-600 bg-green-50" label="Logic Accuracy" value="92%" sub="Peak performance" />
        <MetricCard icon="trending_up" iconBg="bg-amber-100" iconColor="text-amber-600" badge="Rank #12" badgeColor="text-amber-600 bg-amber-50" label="Global Percentile" value="99.2" sub="Top 1% of Tribe" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Checklist & Daily Tasks */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-3xl text-on-surface">Today's Mandate</h2>
              <button className="text-secondary font-bold text-xs uppercase tracking-widest hover:underline">View All Tasks</button>
            </div>
            <div className="space-y-4">
              <TaskItem title="Analyze Supreme Court Judgment on Privacy" subtitle="Section: Legal Reasoning • 15 mins left" badge="URGENT" completed={false} />
              <TaskItem title="Daily Logic Mock Test 04" subtitle="Section: Logical Reasoning • Completed" badge="+50 XP" completed={true} />
              <TaskItem title="Solve 20 Critical Reasoning Passages" subtitle="Section: English • Starts at 4:00 PM" completed={false} />
            </div>
          </div>

          {/* Content Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-[#181a2b] p-8 flex flex-col justify-end group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-[#060818] to-transparent"></div>
              <div className="relative z-10">
                <p className="text-secondary-container text-xs font-bold uppercase tracking-widest mb-2">Featured Course</p>
                <h3 className="font-headline text-2xl text-white mb-4 italic">Tort Law: The Essential Masterclass</h3>
                <button className="text-white flex items-center text-sm font-bold group-hover:translate-x-2 transition-transform">
                  Explore Library <span className="material-symbols-outlined ml-2">arrow_forward</span>
                </button>
              </div>
            </div>
            <div className="bg-surface-container-low rounded-3xl p-8 flex flex-col">
              <h3 className="font-headline text-2xl text-on-surface mb-4 italic">Legal Annotation</h3>
              <div className="flex-1 p-5 bg-surface-container-lowest rounded-2xl border-l-4 border-secondary shadow-sm">
                <p className="font-headline text-lg text-on-surface-variant mb-4 italic leading-relaxed">"Stare decisis is at the heart of our system of justice. It promotes the evenhanded, predictable, and consistent development of legal principles..."</p>
                <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest">— Justice Samuel Alito</p>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-surface-container-low bg-slate-300"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-surface-container-low bg-slate-400"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-surface-container-low bg-slate-800 flex items-center justify-center text-[10px] text-white font-bold">+12</div>
                </div>
                <span className="text-xs text-on-surface-variant/60 font-medium">Discussing this now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm border border-outline-variant">
            <h3 className="font-bold text-on-surface text-lg mb-6">Weekly Performance</h3>
            <div className="space-y-6">
              <ProgressBar label="Legal Aptitude" value={88} color="bg-secondary" textColor="text-secondary" />
              <ProgressBar label="Current Affairs" value={62} color="bg-blue-500" textColor="text-blue-600" />
              <ProgressBar label="Logical Reasoning" value={94} color="bg-purple-500" textColor="text-purple-600" />
            </div>
            <button className="w-full mt-8 py-4 bg-surface-container text-on-surface-variant text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-surface-container-high transition-colors">
              DOWNLOAD FULL REPORT
            </button>
          </div>

          <div className="bg-[#060818] p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-headline text-2xl text-white italic mb-6">Tribe Headlines</h3>
              <div className="space-y-6">
                <article className="group cursor-pointer">
                  <p className="text-secondary text-[10px] font-bold uppercase tracking-widest mb-1">Breaking</p>
                  <h4 className="text-white text-sm font-bold group-hover:text-secondary-container transition-colors">CLAT 2025: Notification Released. Everything you need to know.</h4>
                  <p className="text-slate-500 text-[10px] mt-2 italic">Read by 4,200 candidates</p>
                </article>
                <div className="h-px bg-slate-800"></div>
                <article className="group cursor-pointer">
                  <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1">Scholarship</p>
                  <h4 className="text-white text-sm font-bold group-hover:text-blue-300 transition-colors">Applications open for Tribal Excellence Grant 2024.</h4>
                  <p className="text-slate-500 text-[10px] mt-2 italic">3 days left to apply</p>
                </article>
              </div>
            </div>
          </div>

          <div className="bg-secondary-container/10 p-6 rounded-[2rem] border-2 border-dashed border-secondary/20 flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-secondary text-4xl mb-3">rocket_launch</span>
            <h4 className="font-bold text-on-surface text-sm mb-2">Upgrade to Elite Tribe</h4>
            <p className="text-xs text-on-surface-variant/60 mb-4 leading-relaxed">Unlock 1-on-1 mentorship with NLU alumni and adaptive mock testing.</p>
            <button className="bg-primary-container text-on-primary px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform active:scale-95">
              UPGRADE NOW
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function MetricCard({ icon, iconBg, iconColor, badge, badgeColor, label, value, sub }) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] shadow-sm border border-outline-variant">
      <div className="flex justify-between items-start mb-4">
        <span className={`p-2 ${iconBg} rounded-lg`}>
          <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
        </span>
        <span className={`text-[10px] font-bold ${badgeColor} px-2 py-1 rounded`}>{badge}</span>
      </div>
      <p className="text-on-surface-variant/60 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
      <h3 className="text-3xl font-bold text-on-surface">{value}</h3>
      <p className="text-[10px] text-on-surface-variant/40 mt-2">{sub}</p>
    </div>
  )
}

function TaskItem({ title, subtitle, badge, completed }) {
  if (completed) {
    return (
      <div className="flex items-center p-5 bg-surface-container-lowest border border-secondary/10 rounded-2xl shadow-sm">
        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center mr-5 shadow-lg shadow-secondary/20">
          <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-on-surface-variant/50 text-sm mb-0.5 line-through decoration-outline-variant">{title}</h4>
          <p className="text-xs text-on-surface-variant/30">{subtitle}</p>
        </div>
        {badge && <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-bold">{badge}</span>}
      </div>
    )
  }
  return (
    <div className="group flex items-center p-5 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant hover:border-secondary/30 transition-all">
      <button className="w-6 h-6 rounded-full border-2 border-outline-variant flex items-center justify-center mr-5 group-hover:border-secondary transition-colors">
        <span className="material-symbols-outlined text-transparent group-hover:text-secondary/50 text-sm">check</span>
      </button>
      <div className="flex-1">
        <h4 className="font-bold text-on-surface text-sm mb-0.5">{title}</h4>
        <p className="text-xs text-on-surface-variant/60">{subtitle}</p>
      </div>
      {badge && <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant/60 rounded-lg text-[10px] font-bold">{badge}</span>}
    </div>
  )
}

function ProgressBar({ label, value, color, textColor }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-on-surface-variant/60 mb-2">
        <span>{label}</span>
        <span className={textColor}>{value}%</span>
      </div>
      <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
        <div className={`${color} h-full rounded-full`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  )
}
export default function Dashboard() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative rounded-[2rem] p-8 md:p-12 overflow-hidden mb-10 bg-gradient-to-br from-[#060818] to-[#1E293B] shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-secondary text-on-secondary rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">Welcome Back, Counselor</span>
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">Your path to NLSIU is 64% complete.</h1>
          <p className="text-slate-300 text-lg mb-8 max-w-md font-body">Focus on Logical Reasoning today. You have 3 pending mocks and a constitutional brief to review.</p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-secondary text-on-secondary px-8 py-4 rounded-xl font-bold text-sm hover:bg-secondary-container transition-all shadow-[inset_0_-2px_0_rgba(0,0,0,0.1)]">
              RESUME STUDYING
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-sm hover:bg-white/20 transition-all">
              VIEW CALENDAR
            </button>
          </div>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]"></div>
      </section>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <MetricCard icon="timer" iconBg="bg-secondary-container/20" iconColor="text-secondary" badge="+12%" badgeColor="text-green-600 bg-green-50" label="Study Hours" value="42.5h" sub="v/s 38h last week" />
        <MetricCard icon="fact_check" iconBg="bg-blue-100" iconColor="text-blue-600" badge="On Track" badgeColor="text-slate-400 bg-slate-50" label="Mock Score Avg" value="88/120" sub="Target: 105+" />
        <MetricCard icon="psychology" iconBg="bg-purple-100" iconColor="text-purple-600" badge="+5" badgeColor="text-green-600 bg-green-50" label="Logic Accuracy" value="92%" sub="Peak performance" />
        <MetricCard icon="trending_up" iconBg="bg-amber-100" iconColor="text-amber-600" badge="Rank #12" badgeColor="text-amber-600 bg-amber-50" label="Global Percentile" value="99.2" sub="Top 1% of Tribe" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Checklist & Daily Tasks */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-3xl text-[#060818]">Today's Mandate</h2>
              <button className="text-secondary font-bold text-xs uppercase tracking-widest hover:underline">View All Tasks</button>
            </div>
            <div className="space-y-4">
              <TaskItem title="Analyze Supreme Court Judgment on Privacy" subtitle="Section: Legal Reasoning • 15 mins left" badge="URGENT" completed={false} />
              <TaskItem title="Daily Logic Mock Test 04" subtitle="Section: Logical Reasoning • Completed" badge="+50 XP" completed={true} />
              <TaskItem title="Solve 20 Critical Reasoning Passages" subtitle="Section: English • Starts at 4:00 PM" completed={false} />
            </div>
          </div>

          {/* Content Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-[#181a2b] p-8 flex flex-col justify-end group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-[#060818] to-transparent"></div>
              <div className="relative z-10">
                <p className="text-secondary-container text-xs font-bold uppercase tracking-widest mb-2">Featured Course</p>
                <h3 className="font-headline text-2xl text-white mb-4 italic">Tort Law: The Essential Masterclass</h3>
                <button className="text-white flex items-center text-sm font-bold group-hover:translate-x-2 transition-transform">
                  Explore Library <span className="material-symbols-outlined ml-2">arrow_forward</span>
                </button>
              </div>
            </div>
            <div className="bg-surface-container-low rounded-3xl p-8 flex flex-col">
              <h3 className="font-headline text-2xl text-[#060818] mb-4 italic">Legal Annotation</h3>
              <div className="flex-1 p-5 bg-white rounded-2xl border-l-4 border-secondary shadow-sm">
                <p className="font-headline text-lg text-slate-700 mb-4 italic leading-relaxed">"Stare decisis is at the heart of our system of justice. It promotes the evenhanded, predictable, and consistent development of legal principles..."</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">— Justice Samuel Alito</p>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-surface-container-low bg-slate-300"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-surface-container-low bg-slate-400"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-surface-container-low bg-slate-800 flex items-center justify-center text-[10px] text-white font-bold">+12</div>
                </div>
                <span className="text-xs text-slate-500 font-medium">Discussing this now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="font-bold text-[#060818] text-lg mb-6">Weekly Performance</h3>
            <div className="space-y-6">
              <ProgressBar label="Legal Aptitude" value={88} color="bg-secondary" textColor="text-secondary" />
              <ProgressBar label="Current Affairs" value={62} color="bg-blue-500" textColor="text-blue-600" />
              <ProgressBar label="Logical Reasoning" value={94} color="bg-purple-500" textColor="text-purple-600" />
            </div>
            <button className="w-full mt-8 py-4 bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-colors">
              DOWNLOAD FULL REPORT
            </button>
          </div>

          <div className="bg-[#060818] p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-headline text-2xl text-white italic mb-6">Tribe Headlines</h3>
              <div className="space-y-6">
                <article className="group cursor-pointer">
                  <p className="text-secondary text-[10px] font-bold uppercase tracking-widest mb-1">Breaking</p>
                  <h4 className="text-white text-sm font-bold group-hover:text-secondary-container transition-colors">CLAT 2025: Notification Released. Everything you need to know.</h4>
                  <p className="text-slate-500 text-[10px] mt-2 italic">Read by 4,200 candidates</p>
                </article>
                <div className="h-px bg-slate-800"></div>
                <article className="group cursor-pointer">
                  <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-1">Scholarship</p>
                  <h4 className="text-white text-sm font-bold group-hover:text-blue-300 transition-colors">Applications open for Tribal Excellence Grant 2024.</h4>
                  <p className="text-slate-500 text-[10px] mt-2 italic">3 days left to apply</p>
                </article>
              </div>
            </div>
          </div>

          <div className="bg-secondary-container/10 p-6 rounded-[2rem] border-2 border-dashed border-secondary/20 flex flex-col items-center text-center">
            <span className="material-symbols-outlined text-secondary text-4xl mb-3">rocket_launch</span>
            <h4 className="font-bold text-[#060818] text-sm mb-2">Upgrade to Elite Tribe</h4>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">Unlock 1-on-1 mentorship with NLU alumni and adaptive mock testing.</p>
            <button className="bg-[#060818] text-white px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform active:scale-95">
              UPGRADE NOW
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function MetricCard({ icon, iconBg, iconColor, badge, badgeColor, label, value, sub }) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-[1.5rem] shadow-sm border border-slate-100">
      <div className="flex justify-between items-start mb-4">
        <span className={`p-2 ${iconBg} rounded-lg`}>
          <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
        </span>
        <span className={`text-[10px] font-bold ${badgeColor} px-2 py-1 rounded`}>{badge}</span>
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
      <h3 className="text-3xl font-bold text-[#060818]">{value}</h3>
      <p className="text-[10px] text-slate-400 mt-2">{sub}</p>
    </div>
  )
}

function TaskItem({ title, subtitle, badge, completed }) {
  if (completed) {
    return (
      <div className="flex items-center p-5 bg-white border border-secondary/10 rounded-2xl shadow-sm">
        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center mr-5 shadow-lg shadow-secondary/20">
          <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-slate-400 text-sm mb-0.5 line-through decoration-slate-300">{title}</h4>
          <p className="text-xs text-slate-300">{subtitle}</p>
        </div>
        {badge && <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-bold">{badge}</span>}
      </div>
    )
  }
  return (
    <div className="group flex items-center p-5 bg-surface-container-lowest rounded-2xl shadow-sm border border-slate-100 hover:border-secondary/30 transition-all">
      <button className="w-6 h-6 rounded-full border-2 border-slate-200 flex items-center justify-center mr-5 group-hover:border-secondary transition-colors">
        <span className="material-symbols-outlined text-transparent group-hover:text-secondary/50 text-sm">check</span>
      </button>
      <div className="flex-1">
        <h4 className="font-bold text-slate-800 text-sm mb-0.5">{title}</h4>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>
      {badge && <span className="px-3 py-1 bg-surface-container-low text-slate-500 rounded-lg text-[10px] font-bold">{badge}</span>}
    </div>
  )
}

function ProgressBar({ label, value, color, textColor }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
        <span>{label}</span>
        <span className={textColor}>{value}%</span>
      </div>
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div className={`${color} h-full rounded-full`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  )
}
