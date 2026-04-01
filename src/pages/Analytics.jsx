import { useState } from 'react'

export default function Analytics() {
  const [hoveredDay, setHoveredDay] = useState(null)

  // Generate random heatmap data (12 weeks × 7 days)
  const generateHeatmap = () => {
    const data = []
    for (let week = 0; week < 12; week++) {
      for (let day = 0; day < 7; day++) {
        const intensity = Math.floor(Math.random() * 5) // 0-4 levels
        data.push({
          week,
          day,
          intensity,
          date: new Date(2026, 2, 1 + week * 7 + day).toLocaleDateString()
        })
      }
    }
    return data
  }

  const heatmapData = generateHeatmap()

  const getHeatColor = (intensity) => {
    const colors = [
      'bg-slate-100',      // 0: No activity
      'bg-green-200',      // 1: Light
      'bg-green-400',      // 2: Medium
      'bg-green-600',      // 3: Heavy
      'bg-green-800'       // 4: Very Heavy
    ]
    return colors[intensity]
  }

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const weekLabels = Array.from({ length: 12 }, (_, i) => `W${i + 1}`)

  const subjects = [
    { name: 'Polity', progress: 88, color: 'bg-secondary' },
    { name: 'Legal', progress: 75, color: 'bg-blue-500' },
    { name: 'Economy', progress: 62, color: 'bg-purple-500' },
    { name: 'Current Affairs', progress: 92, color: 'bg-green-500' },
    { name: 'Logical Reasoning', progress: 78, color: 'bg-amber-500' }
  ]

  const leaderboard = [
    { rank: 1, name: 'Arjun Verma', xp: 4250, streak: 42 },
    { rank: 2, name: 'Priya Sharma', xp: 4120, streak: 38 },
    { rank: 3, name: 'You', xp: 3890, streak: 28 },
    { rank: 4, name: 'Rohan Patel', xp: 3650, streak: 21 },
    { rank: 5, name: 'Divya Menon', xp: 3420, streak: 19 }
  ]

  const weeklyData = [
    { week: 'Mon', score: 65 },
    { week: 'Tue', score: 78 },
    { week: 'Wed', score: 72 },
    { week: 'Thu', score: 85 },
    { week: 'Fri', score: 88 },
    { week: 'Sat', score: 92 },
    { week: 'Sun', score: 70 }
  ]

  // Normalize for SVG
  const maxScore = 100
  const svgHeight = 200
  const svgWidth = 400
  const points = weeklyData.map((d, i) => {
    const x = (i / (weeklyData.length - 1)) * svgWidth
    const y = svgHeight - (d.score / maxScore) * svgHeight
    return `${x},${y}`
  }).join(' ')

  const stats = [
    { label: 'Articles Read', value: 42, icon: 'article' },
    { label: 'Flashcards Mastered', value: 128, icon: 'collections_bookmark' },
    { label: 'Mock Avg Score', value: '88/120', icon: 'fact_check' },
    { label: 'Current Streak', value: '28 days', icon: 'local_fire_department' }
  ]

  return (
    <div className="pt-6 px-0 md:px-2 pb-16">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">Your Progress</p>
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-[#060818]">Analytics Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <span className="material-symbols-outlined text-secondary text-2xl">{stat.icon}</span>
              <span className="text-[10px] font-bold bg-secondary/10 text-secondary px-2 py-1 rounded">
                This month
              </span>
            </div>
            <p className="text-slate-600 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="font-headline text-3xl font-bold text-[#060818]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-12">
        <h3 className="font-headline text-2xl font-bold text-[#060818] mb-6">12-Week Learning Heatmap</h3>
        <p className="text-sm text-slate-600 mb-6">Your activity over the past 12 weeks. Darker greens indicate more learning activity.</p>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto">
          <div className="inline-block">
            {/* Day Labels */}
            <div className="flex gap-1 mb-2">
              <div className="w-16"></div>
              {dayLabels.map((day, idx) => (
                <div key={idx} className="w-8 h-8 flex items-center justify-center text-[10px] font-bold text-slate-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Heatmap Rows */}
            {weekLabels.map((week, weekIdx) => (
              <div key={week} className="flex gap-1 mb-2">
                <div className="w-16 text-[10px] font-bold text-slate-500 flex items-center">{week}</div>
                {dayLabels.map((_, dayIdx) => {
                  const cell = heatmapData.find(d => d.week === weekIdx && d.day === dayIdx)
                  return (
                    <div
                      key={`${weekIdx}-${dayIdx}`}
                      className={`w-8 h-8 rounded-md cursor-pointer transition-all hover:ring-2 hover:ring-secondary ${
                        cell ? getHeatColor(cell.intensity) : 'bg-slate-100'
                      }`}
                      title={cell?.date || ''}
                      onMouseEnter={() => setHoveredDay(`${weekIdx}-${dayIdx}`)}
                      onMouseLeave={() => setHoveredDay(null)}
                    ></div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 flex items-center gap-8">
          <span className="text-xs text-slate-600 font-medium">Less</span>
          {[0, 1, 2, 3, 4].map((intensity) => (
            <div key={intensity} className={`w-4 h-4 rounded-sm ${getHeatColor(intensity)}`}></div>
          ))}
          <span className="text-xs text-slate-600 font-medium">More</span>
        </div>
      </div>

      {/* Subject Progress & Weekly Chart */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Subject Progress */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h3 className="font-headline text-2xl font-bold text-[#060818] mb-8">Subject-wise Progress</h3>
          <div className="space-y-6">
            {subjects.map((subject, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-800">{subject.name}</span>
                  <span className={`text-sm font-bold ${subject.color} text-white px-3 py-1 rounded-full bg-opacity-80`}>
                    {subject.progress}%
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${subject.color} rounded-full transition-all`}
                    style={{ width: `${subject.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Performance Chart */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h3 className="font-headline text-2xl font-bold text-[#060818] mb-8">Weekly Performance</h3>
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
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
              ))}

              {/* Line Chart */}
              <polyline
                points={points}
                fill="none"
                stroke="#855300"
                strokeWidth="3"
              />

              {/* Data Points */}
              {weeklyData.map((d, i) => {
                const x = (i / (weeklyData.length - 1)) * svgWidth
                const y = svgHeight - (d.score / maxScore) * svgHeight
                return (
                  <circle
                    key={`point-${i}`}
                    cx={x}
                    cy={y}
                    r="5"
                    fill="#fea619"
                    stroke="#855300"
                    strokeWidth="2"
                  />
                )
              })}
            </svg>
          </div>

          {/* Day Labels */}
          <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-500">
            {weeklyData.map((d) => (
              <span key={d.week}>{d.week}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <h3 className="font-headline text-2xl font-bold text-[#060818] mb-8">Leaderboard</h3>

        <div className="space-y-3">
          {leaderboard.map((user, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                user.name === 'You'
                  ? 'bg-secondary/10 border-secondary'
                  : 'bg-slate-50 border-slate-200 hover:border-secondary/30'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                  idx === 0 ? 'bg-amber-500' :
                  idx === 1 ? 'bg-slate-400' :
                  idx === 2 ? 'bg-orange-600' :
                  'bg-slate-300'
                }`}>
                  {user.rank}
                </div>
                <div>
                  <p className={`font-bold ${user.name === 'You' ? 'text-secondary' : 'text-slate-800'}`}>
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">local_fire_department</span>
                    {user.streak} day streak
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-secondary text-lg">{user.xp}</p>
                <p className="text-xs text-slate-500 font-medium">XP</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
