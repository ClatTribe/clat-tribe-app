import { useState, useEffect, useMemo } from 'react'
import { useProgress } from '../lib/useProgress'

export default function Analytics() {
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
        getQuizHistoryForType(null),
        getFlashcardProgressForUser(),
        getRecentUserActivity(100) // Get more for heatmap
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

  // Computed stats
  const xp = profile?.xp || 0
  const streak = profile?.streak || 0
  const flashcardsMastered = flashcardData.filter(f => f.status === 'mastered').length
  const mockAvg = quizHistory.length > 0
    ? `${Math.round(quizHistory.reduce((s, q) => s + q.score, 0) / quizHistory.length)}/${quizHistory[0]?.total || 0}`
    : 'â'

  const stats = [
    { label: 'Quizzes Taken', value: quizHistory.length, icon: 'article' },
    { label: 'Flashcards Mastered', value: flashcardsMastered, icon: 'collections_bookmark' },
    { label: 'Mock Avg Score', value: mockAvg, icon: 'fact_check' },
    { label: 'Current Streak', value: streak > 0 ? `${streak} days` : '0', icon: 'local_fire_department' }
  ]

  // Build heatmap from real activity data (last 12 weeks)
  const heatmapData = useMemo(() => {
    const data = []
    const now = new Date()
    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - 83) // 12 weeks back

    // Count activities per day
    const activityByDate = {}
    recentActivity.forEach(a => {
      const d = new Date(a.created_at).toISOString().split('T')[0]
      activityByDate[d] = (activityByDate[d] || 0) + 1
    })

    for (let week = 0; week < 12; week++) {
      for (let day = 0; day < 7; day++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + week * 7 + day)
        const dateStr = date.toISOString().split('T')[0]
        const count = activityByDate[dateStr] || 0

        // Map activity count to intensity (0-4)
        let intensity = 0
        if (count >= 5) intensity = 4
        else if (count >= 3) intensity = 3
        else if (count >= 2) intensity = 2
        else if (count >= 1) intensity = 1

        data.push({ week, day, intensity, date: date.toLocaleDateString(), count })
      }
    }
    return data
  }, [recentActivity])

  // Subject-wise progress from quiz types
  const subjects = useMemo(() => {
    const map = {}
    quizHistory.forEach(q => {
      const type = q.quiz_type || 'General'
      if (!map[type]) map[type] = { total: 0, score: 0 }
      map[type].total += q.total
      map[type].score += q.score
    })
    const colors = ['bg-secondary', 'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-amber-500']
    return Object.entries(map).map(([name, data], idx) => ({
      name: name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      progress: Math.round((data.score / data.total) * 100),
      color: colors[idx % colors.length]
    }))
  }, [quizHistory])

  // Weekly performance from last 7 quiz attempts
  const weeklyData = useMemo(() => {
    if (quizHistory.length === 0) return []
    const last7 = quizHistory.slice(0, 7).reverse()
    return last7.map((q, i) => ({
      label: new Date(q.attempted_at).toLocaleDateString('en-US', { weekday: 'short' }),
      score: Math.round((q.score / q.total) * 100)
    }))
  }, [quizHistory])

  // SVG chart for weekly data
  const svgHeight = 200
  const svgWidth = 400
  const points = weeklyData.map((d, i) => {
    const x = weeklyData.length > 1 ? (i / (weeklyData.length - 1)) * svgWidth : svgWidth / 2
    const y = svgHeight - (d.score / 100) * svgHeight
    return `${x},${y}`
  }).join(' ')

  const getHeatColor = (intensity) => {
    const colors = [
      'bg-surface-container-high',  // 0: No activity
      'bg-green-200',               // 1: Light
      'bg-green-400',               // 2: Medium
      'bg-green-600',               // 3: Heavy
      'bg-green-800'                // 4: Very Heavy
    ]
    return colors[intensity]
  }

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const weekLabels = Array.from({ length: 12 }, (_, i) => `W${i + 1}`)

  if (loading && user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <span className="material-symbols-outlined text-secondary text-4xl animate-spin">progress_activity</span>
          <p className="text-on-surface-variant mt-4 font-medium">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-6 px-0 md:px-2 pb-16">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">Your Progress</p>
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-on-surface">Analytics Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant">
            <div className="flex items-center justify-between mb-4">
              <span className="material-symbols-outlined text-secondary text-2xl">{stat.icon}</span>
              <span className="text-[10px] font-bold bg-secondary/10 text-secondary px-2 py-1 rounded">
                This month
              </span>
            </div>
            <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="font-headline text-3xl font-bold text-on-surface">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className="max-w-5xl mx-auto bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant mb-12">
        <h3 className="font-headline text-2xl font-bold text-on-surface mb-6">12-Week Activity Heatmap</h3>
        <p className="text-sm text-on-surface-variant mb-6">
          {recentActivity.length > 0
            ? 'Your activity over the past 12 weeks. Darker greens indicate more activity that day.'
            : 'Complete quizzes, review flashcards, and earn XP to fill up your heatmap!'}
        </p>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto">
          <div className="inline-block">
            {/* Day Labels */}
            <div className="flex gap-1 mb-2">
              <div className="w-16"></div>
              {dayLabels.map((day, idx) => (
                <div key={idx} className="w-8 h-8 flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
                  {day}
                </div>
              ))}
            </div>

            {/* Heatmap Rows */}
            {weekLabels.map((week, weekIdx) => (
              <div key={week} className="flex gap-1 mb-2">
                <div className="w-16 text-[10px] font-bold text-on-surface-variant flex items-center">{week}</div>
                {dayLabels.map((_, dayIdx) => {
                  const cell = heatmapData.find(d => d.week === weekIdx && d.day === dayIdx)
                  return (
                    <div
                      key={`${weekIdx}-${dayIdx}`}
                      className={`w-8 h-8 rounded-md cursor-pointer transition-all hover:ring-2 hover:ring-secondary ${
                        cell ? getHeatColor(cell.intensity) : 'bg-surface-container-high'
                      }`}
                      title={cell ? `${cell.date} â ${cell.count} activit${cell.count !== 1 ? 'ies' : 'y'}` : ''}
                    ></div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex items-center gap-8">
          <span className="text-xs text-on-surface-variant font-medium">Less</span>
          {[0, 1, 2, 3, 4].map((intensity) => (
            <div key={intensity} className={`w-4 h-4 rounded-sm ${getHeatColor(intensity)}`}></div>
          ))}
          <span className="text-xs text-on-surface-variant font-medium">More</span>
        </div>
      </div>

      {/* Subject Progress & Weekly Chart */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Subject Progress */}
        <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant">
          <h3 className="font-headline text-2xl font-bold text-on-surface mb-8">Subject-wise Progress</h3>
          {subjects.length > 0 ? (
            <div className="space-y-6">
              {subjects.map((subject, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-on-surface">{subject.name}</span>
                    <span className={`text-sm font-bold text-white px-3 py-1 rounded-full ${subject.color}`}>
                      {subject.progress}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className={`h-full ${subject.color} rounded-full transition-all`}
                      style={{ width: `${subject.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-on-surface-variant/30 text-4xl mb-3 block">bar_chart</span>
              <p className="text-sm text-on-surface-variant/50">Take quizzes in different subjects to see your progress here.</p>
            </div>
          )}
        </div>

        {/* Weekly Performance Chart */}
        <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant">
          <h3 className="font-headline text-2xl font-bold text-on-surface mb-8">Recent Quiz Performance</h3>
          {weeklyData.length > 0 ? (
            <>
              <div className="flex items-end justify-between h-48">
                <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="flex-1">
                  {/* Grid Lines */}
                  {[0, 25, 50, 75, 100].map((val) => (
                    <line
                      key={`grid-${val}`}
                      x1="0"
                      y1={svgHeight - (val / 100) * svgHeight}
                      x2={svgWidth}
                      y2={svgHeight - (val / 100) * svgHeight}
                      stroke="var(--color-outline-variant)"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Line Chart */}
                  <polyline
                    points={points}
                    fill="none"
                    stroke="var(--color-secondary)"
                    strokeWidth="3"
                  />

                  {/* Data Points */}
                  {weeklyData.map((d, i) => {
                    const x = weeklyData.length > 1 ? (i / (weeklyData.length - 1)) * svgWidth : svgWidth / 2
                    const y = svgHeight - (d.score / 100) * svgHeight
                    return (
                      <circle
                        key={`point-${i}`}
                        cx={x}
                        cy={y}
                        r="5"
                        fill="var(--color-secondary-container)"
                        stroke="var(--color-secondary)"
                        strokeWidth="2"
                      />
                    )
                  })}
                </svg>
              </div>
              <div className="flex justify-between mt-4 text-[10px] font-bold text-on-surface-variant">
                {weeklyData.map((d, i) => (
                  <span key={i}>{d.label}</span>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-on-surface-variant/30 text-4xl mb-3 block">show_chart</span>
              <p className="text-sm text-on-surface-variant/50">Complete quizzes to see your performance trend here.</p>
            </div>
          )}
        </div>
      </div>

      {/* XP & Streak Summary */}
      <div className="max-w-5xl mx-auto bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-outline-variant">
        <h3 className="font-headline text-2xl font-bold text-on-surface mb-8">Your Summary</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-surface-container rounded-2xl">
            <span className="material-symbols-outlined text-secondary text-4xl mb-3 block">star</span>
            <p className="font-headline text-4xl font-bold text-on-surface mb-1">{xp.toLocaleString()}</p>
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Total XP</p>
          </div>
          <div className="text-center p-6 bg-surface-container rounded-2xl">
            <span className="material-symbols-outlined text-amber-500 text-4xl mb-3 block">local_fire_department</span>
            <p className="font-headline text-4xl font-bold text-on-surface mb-1">{streak}</p>
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Day Streak</p>
          </div>
          <div className="text-center p-6 bg-surface-container rounded-2xl">
            <span className="material-symbols-outlined text-green-500 text-4xl mb-3 block">emoji_events</span>
            <p className="font-headline text-4xl font-bold text-on-surface mb-1">{quizHistory.length}</p>
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Quizzes Completed</p>
          </div>
        </div>
      </div>
    </div>
  )
}
