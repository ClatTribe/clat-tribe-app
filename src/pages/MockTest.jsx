import { useState, useEffect } from 'react'
import { mockData } from '../data/mockTest'

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
  // State for configuration screen
  const [questionCount, setQuestionCount] = useState(20)
  const [difficulty, setDifficulty] = useState('Beginner')
  const [selectedSubjects, setSelectedSubjects] = useState(['Legal Aptitude', 'English Proficiency'])
  const [adaptive, setAdaptive] = useState(true)
  const [timeLimit, setTimeLimit] = useState(60)

  // State for test flow
  const [testState, setTestState] = useState('config') // 'config', 'active', 'results'
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [marked, setMarked] = useState(new Set())
  const [testStartTime, setTestStartTime] = useState(null)
  const [testEndTime, setTestEndTime] = useState(null)
  const [questions, setQuestions] = useState([])
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)

  const toggleSubject = (name) => {
    setSelectedSubjects(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    )
  }

  const generateTestQuestions = () => {
    const allQuestions = []
    mockData.passages.forEach((passage, passageIndex) => {
      passage.qs.forEach((q, qIndex) => {
        allQuestions.push({
          id: `${passageIndex}-${qIndex}`,
          passageId: passageIndex,
          passageText: passage.text,
          passageCategory: passage.category,
          questionText: q.q,
          options: q.opts,
          correctAnswer: q.c,
          explanation: q.e,
        })
      })
    })
    return allQuestions.slice(0, questionCount)
  }

  const startTest = () => {
    const generatedQuestions = generateTestQuestions()
    setQuestions(generatedQuestions)
    setTimeRemaining(timeLimit * 60)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setMarked(new Set())
    setTestStartTime(new Date())
    setTestState('active')
  }

  const submitTest = () => {
    setTestEndTime(new Date())
    setTestState('results')
    setShowSubmitConfirm(false)
  }

  const handleAnswer = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }))
  }

  const toggleMark = () => {
    setMarked(prev => {
      const newSet = new Set(prev)
      if (newSet.has(currentQuestionIndex)) {
        newSet.delete(currentQuestionIndex)
      } else {
        newSet.add(currentQuestionIndex)
      }
      return newSet
    })
  }

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index)
  }

  const retakeTest = () => {
    setTestState('config')
    setAnswers({})
    setMarked(new Set())
  }

  const goToDashboard = () => {
    setTestState('config')
    setAnswers({})
    setMarked(new Set())
  }

  // Timer effect
  useEffect(() => {
    if (testState !== 'active') return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setTestEndTime(new Date())
          setTestState('results')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [testState])

  // Calculate results
  const calculateResults = () => {
    let correctCount = 0
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correctCount++
      }
    })
    const accuracy = ((correctCount / questions.length) * 100).toFixed(1)
    const timeTaken = testStartTime && testEndTime
      ? Math.floor((testEndTime - testStartTime) / 1000)
      : 0
    return { correctCount, accuracy, timeTaken }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (testState === 'config') {
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
                    <span className="text-secondary font-bold text-sm">{timeLimit} Minutes</span>
                  </div>
                  <input
                    className="w-full h-1.5 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-secondary"
                    max="180"
                    min="30"
                    type="range"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(Number(e.target.value))}
                  />
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
                <button onClick={startTest} className="w-full md:w-auto px-10 py-5 bg-secondary text-on-secondary rounded-xl font-bold text-base hover:bg-secondary-container transition-all shadow-lg active:scale-95 group">
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

  if (testState === 'active' && questions.length > 0) {
    const currentQ = questions[currentQuestionIndex]
    const answered = Object.keys(answers).length
    const isMarked = marked.has(currentQuestionIndex)
    const isAnswered = answers[currentQuestionIndex] !== undefined

    return (
      <div className="fixed inset-0 bg-[#0a0a14] flex flex-col">
        {/* Top Bar */}
        <div className="bg-surface-container-low border-b border-outline px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-lg">schedule</span>
              <span className={`font-bold text-lg ${timeRemaining < 300 ? 'text-red-500' : 'text-secondary'}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            <div className="text-on-surface-variant text-sm">
              Q {currentQuestionIndex + 1}/{questions.length}
            </div>
            <div className="text-on-surface-variant text-sm">
              {currentQ.passageCategory}
            </div>
          </div>
          <button
            onClick={() => setShowSubmitConfirm(true)}
            className="px-4 py-2 bg-error text-on-error rounded-lg font-bold text-sm hover:bg-error/90 transition-all active:scale-95"
          >
            Submit Test
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {/* Passage */}
            <div className="mb-8 p-6 bg-surface-container-low rounded-xl">
              <h3 className="text-xs font-bold uppercase tracking-[0.05em] text-secondary mb-3">{currentQ.passageCategory}</h3>
              <p className="text-on-surface-variant leading-relaxed text-sm">
                {currentQ.passageText}
              </p>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-xl font-headline text-primary mb-6 leading-relaxed">
                {currentQ.questionText}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {currentQ.options.map((option, idx) => (
                  <label
                    key={idx}
                    className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      answers[currentQuestionIndex] === idx
                        ? 'border-secondary bg-surface-container-lowest'
                        : 'border-outline-variant bg-surface-container-low hover:bg-surface-container-highest'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        name={`question-${currentQuestionIndex}`}
                        value={idx}
                        checked={answers[currentQuestionIndex] === idx}
                        onChange={() => handleAnswer(idx)}
                        className="mt-1 accent-secondary"
                      />
                      <span className="text-on-surface leading-relaxed">
                        {option}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-12">
              <button
                onClick={goToPrevious}
                disabled={currentQuestionIndex === 0}
                className={`px-6 py-3 rounded-lg font-bold text-sm transition-all ${
                  currentQuestionIndex === 0
                    ? 'bg-surface-container-low text-on-surface-variant cursor-not-allowed'
                    : 'bg-surface-container-low text-secondary hover:bg-surface-container-highest'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">chevron_left</span>
                  Previous
                </span>
              </button>

              <button
                onClick={toggleMark}
                className={`px-6 py-3 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                  isMarked
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-highest'
                }`}
              >
                <span className="material-symbols-outlined text-lg">flag</span>
                {isMarked ? 'Marked' : 'Mark'}
              </button>

              <button
                onClick={goToNext}
                disabled={currentQuestionIndex === questions.length - 1}
                className={`px-6 py-3 rounded-lg font-bold text-sm transition-all ml-auto ${
                  currentQuestionIndex === questions.length - 1
                    ? 'bg-surface-container-low text-on-surface-variant cursor-not-allowed'
                    : 'bg-secondary text-on-secondary hover:bg-secondary-container'
                }`}
              >
                <span className="flex items-center gap-2">
                  Next
                  <span className="material-symbols-outlined text-lg">chevron_right</span>
                </span>
              </button>
            </div>
          </div>

          {/* Question Palette Sidebar */}
          <div className="w-32 bg-surface-container-low border-l border-outline p-4 overflow-y-auto">
            <h3 className="text-xs font-bold uppercase tracking-[0.05em] text-secondary mb-4">Questions</h3>
            <div className="grid grid-cols-3 gap-2">
              {questions.map((_, idx) => {
                const isAnsw = answers[idx] !== undefined
                const isMark = marked.has(idx)
                const isCurrent = idx === currentQuestionIndex

                return (
                  <button
                    key={idx}
                    onClick={() => goToQuestion(idx)}
                    className={`w-full aspect-square rounded text-xs font-bold flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-secondary text-on-secondary ring-2 ring-secondary'
                        : isAnsw && isMark
                        ? 'bg-yellow-500/30 text-yellow-400 border border-yellow-500'
                        : isAnsw
                        ? 'bg-green-500/30 text-green-400 border border-green-500'
                        : 'bg-surface-container-highest text-on-surface-variant'
                    }`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>
            <div className="mt-6 space-y-2 text-[10px] text-on-surface-variant">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500/30 border border-green-500"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-500/30 border border-yellow-500"></div>
                <span>Marked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-surface-container-highest"></div>
                <span>Not Answered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Confirmation Dialog */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-surface-container rounded-2xl p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-headline text-primary mb-4">Submit Test?</h2>
              <p className="text-on-surface-variant mb-2">
                You have answered <span className="text-secondary font-bold">{answered}</span> out of <span className="text-secondary font-bold">{questions.length}</span> questions.
              </p>
              <p className="text-on-surface-variant mb-6">
                Time remaining: <span className="text-secondary font-bold">{formatTime(timeRemaining)}</span>
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="flex-1 px-4 py-3 bg-surface-container-lowest border border-outline rounded-lg font-bold text-on-surface hover:bg-surface-container-highest transition-all"
                >
                  Continue Test
                </button>
                <button
                  onClick={submitTest}
                  className="flex-1 px-4 py-3 bg-error text-on-error rounded-lg font-bold hover:bg-error/90 transition-all active:scale-95"
                >
                  Submit Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (testState === 'results' && questions.length > 0) {
    const { correctCount, accuracy, timeTaken } = calculateResults()
    const xpEarned = Math.min(50 + Math.floor(correctCount * 5), 200)

    return (
      <div className="max-w-4xl mx-auto pt-12 pb-12">
        {/* Toast Notification */}
        <div className="fixed top-6 right-6 bg-green-500/20 border border-green-500 text-green-400 px-6 py-4 rounded-lg font-bold text-sm animate-pulse z-50">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined">check_circle</span>
            +{xpEarned} XP earned!
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-headline text-5xl md:text-6xl text-primary mb-4">Test Complete</h1>
          <p className="text-on-surface-variant text-lg">Let's review your performance</p>
        </div>

        {/* Score Section */}
        <section className="mb-12 p-8 md:p-12 bg-primary-container rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary opacity-5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {/* Score */}
              <div className="text-center">
                <div className="text-5xl font-headline text-secondary mb-2">{correctCount}</div>
                <div className="text-on-primary-container text-sm">Out of {questions.length} correct</div>
              </div>

              {/* Accuracy */}
              <div className="text-center">
                <div className={`text-5xl font-headline mb-2 ${accuracy >= 70 ? 'text-green-400' : accuracy >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {accuracy}%
                </div>
                <div className="text-on-primary-container text-sm">Accuracy</div>
                <div className="mt-3 w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all ${accuracy >= 70 ? 'bg-green-400' : accuracy >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`}
                    style={{ width: `${accuracy}%` }}
                  ></div>
                </div>
              </div>

              {/* Time */}
              <div className="text-center">
                <div className="text-5xl font-headline text-secondary mb-2">{Math.floor(timeTaken / 60)}</div>
                <div className="text-on-primary-container text-sm">Minutes taken</div>
                <div className="text-xs text-on-primary-container/70 mt-1">
                  {timeTaken % 60} seconds
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="p-6 bg-surface-container-low rounded-xl text-center">
            <div className="text-2xl font-bold text-secondary mb-1">{answered}</div>
            <div className="text-xs text-on-surface-variant font-label uppercase tracking-wide">Answered</div>
          </div>
          <div className="p-6 bg-surface-container-low rounded-xl text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{marked.size}</div>
            <div className="text-xs text-on-surface-variant font-label uppercase tracking-wide">Marked</div>
          </div>
          <div className="p-6 bg-surface-container-low rounded-xl text-center">
            <div className="text-2xl font-bold text-on-surface-variant mb-1">{questions.length - answered}</div>
            <div className="text-xs text-on-surface-variant font-label uppercase tracking-wide">Unanswered</div>
          </div>
          <div className="p-6 bg-surface-container-low rounded-xl text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">+{xpEarned} XP</div>
            <div className="text-xs text-on-surface-variant font-label uppercase tracking-wide">Earned</div>
          </div>
        </section>

        {/* Question Review */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-[1px] bg-secondary"></span>
            <h2 className="font-label text-xs font-bold uppercase tracking-[0.05em] text-secondary">Question Review</h2>
          </div>

          <div className="space-y-6">
            {questions.map((q, idx) => {
              const userAnswer = answers[idx]
              const isCorrect = userAnswer === q.correctAnswer
              const wasMarked = marked.has(idx)

              return (
                <div
                  key={idx}
                  className={`p-6 rounded-xl border-2 ${
                    isCorrect
                      ? 'border-green-500/50 bg-green-500/10'
                      : 'border-red-500/50 bg-red-500/10'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                      {isCorrect ? '✓' : '✗'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-on-surface mb-2 leading-relaxed">{q.questionText}</h3>
                      {wasMarked && (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-bold mb-3">
                          <span className="material-symbols-outlined text-sm">flag</span>
                          Marked
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="ml-12 space-y-3">
                    <div>
                      <p className="text-xs text-on-surface-variant font-bold mb-1">Your Answer:</p>
                      <p className={`text-sm ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                        {userAnswer !== undefined ? q.options[userAnswer] : 'Not answered'}
                      </p>
                    </div>

                    {!isCorrect && (
                      <div>
                        <p className="text-xs text-on-surface-variant font-bold mb-1">Correct Answer:</p>
                        <p className="text-sm text-green-400">{q.options[q.correctAnswer]}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-on-surface-variant font-bold mb-1">Explanation:</p>
                      <p className="text-sm text-on-surface-variant leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* CTA Buttons */}
        <section className="flex gap-4 justify-center">
          <button
            onClick={retakeTest}
            className="px-8 py-4 bg-secondary text-on-secondary rounded-xl font-bold hover:bg-secondary-container transition-all shadow-lg active:scale-95"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined">restart_alt</span>
              Retake Test
            </span>
          </button>
          <button
            onClick={goToDashboard}
            className="px-8 py-4 bg-surface-container-low text-secondary rounded-xl font-bold hover:bg-surface-container-highest transition-all active:scale-95"
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined">home</span>
              Back to Dashboard
            </span>
          </button>
        </section>
      </div>
    )
  }

  return null
}
