import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../lib/useProgress'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, profile, getQuizHistoryForType, getFlashcardProgressForUser, getRecentUserActivity } = useProgress()

  const [quizHistory, setQuizHistory] = useState([])
  const [flashcardData, setFlashcardData] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    let cancelled = false

    async function fetchData() {
      setLoading(true)
      const [quizzes, flashcards, activity] = await Promise.all([
        getQuizHistoryForType(null), // all quiz types
        getFlashcardProgressForUser(),
        getRecentUserActivity(10)
      ])
      if (!cancelled) {
        setQuizHistory(quizzes || [])
        setFlashcardData(flashcards || [])
        setRecentActivity(activity || [])
        setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [user])

  // Compute metrics from real data
  const xp = profile?.xp || 0
  const streak = profile?.streak || 0
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student'

  // Mock score average
  const mockScoreAvg = quizHistory.length > 0
    ? Math.round(quizHistory.reduce((sum, q) => sum + q.score, 0) / quizHistory.length)
    : 0
  const mockScoreTotal = quizHistory.length > 0 ? quizHistory[0].total : 0

  // Flashcards mastered
  const flashcardsMastered = flashcardData.filter(f => f.status === 'mastered').length
  const flashcardsTotal = flashcardData.length

  // Recent quiz performance (last 7 quizzes)
  const recentQuizzes = quizHistory.slice(0, 7)
  const recentAvgPercent = recentQuizzes.length > 0
    ? Math.round(recentQuizzes.reduce((sum, q) => sum + (q.score / q.total) * 100, 0) / recentQuizzes.length)
    : 0

  // Subject-wise progress from quiz types
  const subjectMap = {}
  quizHistory.forEach(q => {
    const type = q.quiz_type || 'General'
    if (!subjectMap[type]) subjectMap[type] = { total: 0, score: 0, count: 0 }
    subjectMap[type].total += q.total
    subjectMap[type].score += q.score
    subjectMap[type].count += 1
  })
  const subjectProgress = Object.entries(subjectMap).map(([name, data]) => ({
    name: name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    value: Math.round((data.score / data.total) * 100)
  }))

  // Progress percentage (based on XP milestones â 1000 XP = 100%)
  const overallProgress = Math.min(Math.round((xp / 1000) * 100), 100)

  if (loading && user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <span className="material-symbols-outlined text-secondary text-4xl animate-spin">progress_activity</span>
          <p className="text-on-surface-variant mt-4 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative rounded-[2rem] p-6 md:p-8 overflow-hidden mb-10 bg-gradient-to-br from-[#060818] to-[#1E293B] shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-secondary text-on-secondary rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">Welcome Back, {displayName}</span>
          <h1 className="font-headline text-3xl md:text-4xl text-white mb-4 leading-tight">
            {overallProgress > 0
              ? `Your journey is ${overallProgress}% strong.`
              : 'Start your CLAT preparation today.'}
          </h1>
          <p className="text-slate-300 text-sm mb-6 max-w-md font-body">
            {quizHistory.length > 0
              ? `You've attempted ${quizHistory.length} quiz${quizHistory.length !== 1 ? 'zes' : ''} and earned ${xp} XP. ${streak > 0 ? `${streak}-day streak going!` : 'Start a streak today!'}`
              : 'Take your first quiz, review flashcards, and build your streak.'}
          </p>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => navigate('/flashcards')} className="bg-secondary text-on-secondary px-8 py-3 rounded-xl font-bold text-sm hover:bg-secondary-container transition-all shadow-[inset_0_-2px_0_rgba(0,0,0,0.1)]">
              RESUME STUDYING
            </button>
            <button onClick={() => navigate('/mocktest')} className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-3 rounded-xl font-bold text-sm hover:bg-white/20 transition-all">
              TAKE MOCK TEST
            </button>
          </div>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]"></div>
      </section>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <MetricCard
          icon="star"
          iconBg="bg-secondary-container/20"
          iconColor="text-secondary"
          badge={xp > 0 ? `+${xp}` : 'â'}
          badgeColor={xp > 0 ? 'text-green-600 bg-green-50' : 'text-slate-400 bg-slate-50'}
          label="Total XP"
          value={xp.toLocaleString()}
          sub={xp > 0 ? 'Keep earning!' : 'Complete activities to earn XP'}
        />
        <MetricCard
          icon="local_fire_department"
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          badge={streak > 0 ? `${streak}d` : 'â'}
          badgeColor={streak > 0 ? 'text-amber-600 bg-amber-50' : 'text-slate-400 bg-slate-50'}
          label="Current Streak"
          value={`${streak} day${streak !== 1 ? 's' : ''}`}
          sub={streak > 0 ? 'Keep the fire burning!' : 'Log in daily to build a streak'}
        />
        <MetricCard
          icon="fact_check"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          badge={quizHistory.length > 0 ? `${quizHistory.length} taken` : 'â'}
          badgeColor={quizHistory.length > 0 ? 'text-blue-600 bg-blue-50' : 'text-slate-400 bg-slate-50'}
          label="Mock Score Avg"
          value={quizHistory.length > 0 ? `${mockScoreAvg}/${mockScoreTotal}` : 'â'}
          sub={quizHistory.length > 0 ? `Across ${quizHistory.length} attempt${quizHistory.length !== 1 ? 's' : ''}` : 'Take a quiz to see your score'}
        />
        <MetricCard
          icon="collections_bookmark"
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          badge={flashcardsMastered > 0 ? `${flashcardsMastered}` : 'â'}
          badgeColor={flashcardsMastered > 0 ? 'text-green-600 bg-green-50' : 'text-slate-400 bg-slate-50'}
          label="Flashcards Mastered"
          value={flashcardsTotal > 0 ? `${flashcardsMastered}/${flashcardsTotal}` : 'â'}
          sub={flashcardsTotal > 0 ? `${Math.round((flashcardsMastered / flashcardsTotal) * 100)}% mastery rate` : 'Start reviewing flashcards'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Activity & Tasks */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-3xl text-on-surface">Recent Activity</h2>
              {recentActivity.length > 5 && (
                <button className="text-secondary font-bold text-xs uppercase tracking-widest hover:underline">View All</button>
              )}
            </div>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.slice(0, 5).map((activity, idx) => (
                  <TaskItem
                    key={activity.id || idx}
                    title={formatActivityType(activity.type)}
                    subtitle={formatActivityTime(activity.created_at)}
                    badge={activity.xp_earned > 0 ? `+${activity.xp_earned} XP` : null}
                    completed={true}
                  />
                ))
              ) : (
                <div className="p-8 bg-surface-container-lowest rounded-2xl border border-outline-variant text-center">
                  <span className="material-symbols-outlined text-on-surface-variant/40 text-4xl mb-3 block">inbox</span>
                  <p className="text-on-surface-variant/60 text-sm">No recent activity yet. Take a quiz or review flashcards to get started!</p>
                </div>
              )}
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
              <h3 className="font-headline text-2xl text-on-surface mb-4 italic">Quick Stats</h3>
              <div className="flex-1 p-5 bg-surface-container-lowest rounded-2xl border-l-4 border-secondary shadow-sm">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Quizzes Taken</span>
                    <span className="font-bold text-on-surface">{quizHistory.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Flashcards Reviewed</span>
                    <span className="font-bold text-on-surface">{flashcardsTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Recent Accuracy</span>
                    <span className="font-bold text-on-surface">{recentAvgPercent > 0 ? `${recentAvgPercent}%` : 'â'}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <span className="material-symbols-outlined text-secondary">trending_up</span>
                <span className="text-xs text-on-surface-variant/60 font-medium">
                  {quizHistory.length > 0 ? 'Based on your real performance data' : 'Stats will appear as you study'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Subject-wise Performance */}
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm border border-outline-variant">
            <h3 className="font-bold text-on-surface text-lg mb-6">Subject Performance</h3>
            {subjectProgress.length > 0 ? (
              <div className="space-y-6">
                {subjectProgress.slice(0, 5).map((subject, idx) => {
                  const colors = ['bg-secondary', 'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-amber-500']
                  const textColors = ['text-secondary', 'text-blue-600', 'text-purple-600', 'text-green-600', 'text-amber-600']
                  return (
                    <ProgressBar
                      key={subject.name}
                      label={subject.name}
                      value={subject.value}
                      color={colors[idx % colors.length]}
                      textColor={textColors[idx % textColors.length]}
                    />
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <span className="material-symbols-outlined text-on-surface-variant/30 text-3xl mb-2 block">bar_chart</span>
                <p className="text-xs text-on-surface-variant/50">Take quizzes in different subjects to see your performance breakdown.</p>
              </div>
            )}
            <button onClick={() => navigate('/analytics')} className="w-full mt-8 py-4 bg-surface-container text-on-surface-variant text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-surface-container-high transition-colors">
              VIEW FULL ANALYTICS
            </button>
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

// Helpers
function formatActivityType(type) {
  if (!type) return 'Activity'
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

function formatActivityTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
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
          <h4 className="font-bold text-on-surface text-sm mb-0.5">{title}</h4>
          <p className="text-xs text-on-surface-variant/60">{subtitle}</p>
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
import { useState, useEffect } from 'react'
import { useProgress } from '../lib/useProgress'

export default function Dashboard() {
  const { user, profile, getQuizHistoryForType, getFlashcardProgressForUser, getRecentUserActivity } = useProgress()

  const [quizHistory, setQuizHistory] = useState([])
  const [flashcardData, setFlashcardData] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    let cancelled = false

    async function fetchData() {
      setLoading(true)
      const [quizzes, flashcards, activity] = await Promise.all([
        getQuizHistoryForType(null), // all quiz types
        getFlashcardProgressForUser(),
        getRecentUserActivity(10)
      ])
      if (!cancelled) {
        setQuizHistory(quizzes || [])
        setFlashcardData(flashcards || [])
        setRecentActivity(activity || [])
        setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [user])

  // Compute metrics from real data
  const xp = profile?.xp || 0
  const streak = profile?.streak || 0
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student'

  // Mock score average
  const mockScoreAvg = quizHistory.length > 0
    ? Math.round(quizHistory.reduce((sum, q) => sum + q.score, 0) / quizHistory.length)
    : 0
  const mockScoreTotal = quizHistory.length > 0 ? quizHistory[0].total : 0

  // Flashcards mastered
  const flashcardsMastered = flashcardData.filter(f => f.status === 'mastered').length
  const flashcardsTotal = flashcardData.length

  // Recent quiz performance (last 7 quizzes)
  const recentQuizzes = quizHistory.slice(0, 7)
  const recentAvgPercent = recentQuizzes.length > 0
    ? Math.round(recentQuizzes.reduce((sum, q) => sum + (q.score / q.total) * 100, 0) / recentQuizzes.length)
    : 0

  // Subject-wise progress from quiz types
  const subjectMap = {}
  quizHistory.forEach(q => {
    const type = q.quiz_type || 'General'
    if (!subjectMap[type]) subjectMap[type] = { total: 0, score: 0, count: 0 }
    subjectMap[type].total += q.total
    subjectMap[type].score += q.score
    subjectMap[type].count += 1
  })
  const subjectProgress = Object.entries(subjectMap).map(([name, data]) => ({
    name: name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    value: Math.round((data.score / data.total) * 100)
  }))

  // Progress percentage (based on XP milestones â 1000 XP = 100%)
  const overallProgress = Math.min(Math.round((xp / 1000) * 100), 100)

  if (loading && user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <span className="material-symbols-outlined text-secondary text-4xl animate-spin">progress_activity</span>
          <p className="text-on-surface-variant mt-4 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative rounded-[2rem] p-8 md:p-12 overflow-hidden mb-10 bg-gradient-to-br from-[#060818] to-[#1E293B] shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block px-3 py-1 bg-secondary text-on-secondary rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">Welcome Back, {displayName}</span>
          <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight">
            {overallProgress > 0
              ? `Your journey is ${overallProgress}% strong.`
              : 'Start your CLAT preparation today.'}
          </h1>
          <p className="text-slate-300 text-lg mb-8 max-w-md font-body">
            {quizHistory.length > 0
              ? `You've attempted ${quizHistory.length} quiz${quizHistory.length !== 1 ? 'zes' : ''} and earned ${xp} XP. ${streak > 0 ? `${streak}-day streak going!` : 'Start a streak today!'}`
              : 'Take your first quiz, review flashcards, and build your streak.'}
          </p>
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
        <MetricCard
          icon="star"
          iconBg="bg-secondary-container/20"
          iconColor="text-secondary"
          badge={xp > 0 ? `+${xp}` : 'â'}
          badgeColor={xp > 0 ? 'text-green-600 bg-green-50' : 'text-slate-400 bg-slate-50'}
          label="Total XP"
          value={xp.toLocaleString()}
          sub={xp > 0 ? 'Keep earning!' : 'Complete activities to earn XP'}
        />
        <MetricCard
          icon="local_fire_department"
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          badge={streak > 0 ? `${streak}d` : 'â'}
          badgeColor={streak > 0 ? 'text-amber-600 bg-amber-50' : 'text-slate-400 bg-slate-50'}
          label="Current Streak"
          value={`${streak} day${streak !== 1 ? 's' : ''}`}
          sub={streak > 0 ? 'Keep the fire burning!' : 'Log in daily to build a streak'}
        />
        <MetricCard
          icon="fact_check"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          badge={quizHistory.length > 0 ? `${quizHistory.length} taken` : 'â'}
          badgeColor={quizHistory.length > 0 ? 'text-blue-600 bg-blue-50' : 'text-slate-400 bg-slate-50'}
          label="Mock Score Avg"
          value={quizHistory.length > 0 ? `${mockScoreAvg}/${mockScoreTotal}` : 'â'}
          sub={quizHistory.length > 0 ? `Across ${quizHistory.length} attempt${quizHistory.length !== 1 ? 's' : ''}` : 'Take a quiz to see your score'}
        />
        <MetricCard
          icon="collections_bookmark"
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          badge={flashcardsMastered > 0 ? `${flashcardsMastered}` : 'â'}
          badgeColor={flashcardsMastered > 0 ? 'text-green-600 bg-green-50' : 'text-slate-400 bg-slate-50'}
          label="Flashcards Mastered"
          value={flashcardsTotal > 0 ? `${flashcardsMastered}/${flashcardsTotal}` : 'â'}
          sub={flashcardsTotal > 0 ? `${Math.round((flashcardsMastered / flashcardsTotal) * 100)}% mastery rate` : 'Start reviewing flashcards'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Activity & Tasks */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-3xl text-on-surface">Recent Activity</h2>
              {recentActivity.length > 5 && (
                <button className="text-secondary font-bold text-xs uppercase tracking-widest hover:underline">View All</button>
              )}
            </div>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.slice(0, 5).map((activity, idx) => (
                  <TaskItem
                    key={activity.id || idx}
                    title={formatActivityType(activity.type)}
                    subtitle={formatActivityTime(activity.created_at)}
                    badge={activity.xp_earned > 0 ? `+${activity.xp_earned} XP` : null}
                    completed={true}
                  />
                ))
              ) : (
                <div className="p-8 bg-surface-container-lowest rounded-2xl border border-outline-variant text-center">
                  <span className="material-symbols-outlined text-on-surface-variant/40 text-4xl mb-3 block">inbox</span>
                  <p className="text-on-surface-variant/60 text-sm">No recent activity yet. Take a quiz or review flashcards to get started!</p>
                </div>
              )}
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
              <h3 className="font-headline text-2xl text-on-surface mb-4 italic">Quick Stats</h3>
              <div className="flex-1 p-5 bg-surface-container-lowest rounded-2xl border-l-4 border-secondary shadow-sm">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Quizzes Taken</span>
                    <span className="font-bold text-on-surface">{quizHistory.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Flashcards Reviewed</span>
                    <span className="font-bold text-on-surface">{flashcardsTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Recent Accuracy</span>
                    <span className="font-bold text-on-surface">{recentAvgPercent > 0 ? `${recentAvgPercent}%` : 'â'}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <span className="material-symbols-outlined text-secondary">trending_up</span>
                <span className="text-xs text-on-surface-variant/60 font-medium">
                  {quizHistory.length > 0 ? 'Based on your real performance data' : 'Stats will appear as you study'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Subject-wise Performance */}
          <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-sm border border-outline-variant">
            <h3 className="font-bold text-on-surface text-lg mb-6">Subject Performance</h3>
            {subjectProgress.length > 0 ? (
              <div className="space-y-6">
                {subjectProgress.slice(0, 5).map((subject, idx) => {
                  const colors = ['bg-secondary', 'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-amber-500']
                  const textColors = ['text-secondary', 'text-blue-600', 'text-purple-600', 'text-green-600', 'text-amber-600']
                  return (
                    <ProgressBar
                      key={subject.name}
                      label={subject.name}
                      value={subject.value}
                      color={colors[idx % colors.length]}
                      textColor={textColors[idx % textColors.length]}
                    />
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <span className="material-symbols-outlined text-on-surface-variant/30 text-3xl mb-2 block">bar_chart</span>
                <p className="text-xs text-on-surface-variant/50">Take quizzes in different subjects to see your performance breakdown.</p>
              </div>
            )}
            <button className="w-full mt-8 py-4 bg-surface-container text-on-surface-variant text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-surface-container-high transition-colors">
              VIEW FULL ANALYTICS
            </button>
          </div>

          {/* Streak Widget */}
          <div className="bg-[#060818] p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-headline text-2xl text-white italic mb-6">Your Journey</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-secondary text-3xl">local_fire_department</span>
                  <div>
                    <p className="text-white font-bold text-2xl">{streak}</p>
                    <p className="text-slate-400 text-xs">Day Streak</p>
                  </div>
                </div>
                <div className="h-px bg-slate-800"></div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-blue-400 text-3xl">star</span>
                  <div>
                    <p className="text-white font-bold text-2xl">{xp.toLocaleString()}</p>
                    <p className="text-slate-400 text-xs">Total XP</p>
                  </div>
                </div>
                <div className="h-px bg-slate-800"></div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-green-400 text-3xl">fact_check</span>
                  <div>
                    <p className="text-white font-bold text-2xl">{quizHistory.length}</p>
                    <p className="text-slate-400 text-xs">Quizzes Completed</p>
                  </div>
                </div>
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

// Helpers
function formatActivityType(type) {
  if (!type) return 'Activity'
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

function formatActivityTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
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
          <h4 className="font-bold text-on-surface text-sm mb-0.5">{title}</h4>
          <p className="text-xs text-on-surface-variant/60">{subtitle}</p>
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
