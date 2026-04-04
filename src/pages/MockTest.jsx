import { useState, useEffect } from 'react'
import { mockData } from '../data/mockTest'
import { getDailyMockTest, getLatestMockTestDate } from '../lib/progress'
import { useAuth } from '../lib/AuthContext'

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
  // Auth context
  const { user } = useAuth()

  // State for configuration screen
  const [testType, setTestType] = useState('custom') // 'daily' or 'custom'
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

  // State for daily test
  const [latestTestDate, setLatestTestDate] = useState(null)
  const [dailyTestLoading, setDailyTestLoading] = useState(false)

  // Load latest daily test date on mount
  useEffect(() => {
    const loadLatestDate = async () => {
      const date = await getLatestMockTestDate()
      setLatestTestDate(date)
    }
    loadLatestDate()
  }, [])

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

  const startCustomTest = () => {
    const generatedQuestions = generateTestQuestions()
    setQuestions(generatedQuestions)
    setTimeRemaining(timeLimit * 60)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setMarked(new Set())
    setTestStartTime(new Date())
    setTestState('active')
  }

  const startDailyTest = async () => {
    setDailyTestLoading(true)
    try {
      if (!latestTestDate) {
        console.error('No daily test date available')
        setDailyTestLoading(false)
        return
      }

      const dailyQuestions = await getDailyMockTest(latestTestDate)
      if (dailyQuestions.length === 0) {
        console.error('No questions found for today')
        setDailyTestLoading(false)
        return
      }

      // Transform daily questions to match expected format
      const transformedQuestions = dailyQuestions.map((q, idx) => ({
        id: q.id,
        passageId: q.passage_category,
        passageText: q.passage_text,
        passageCategory: q.passage_category,
        questionText: q.question_text,
        options: q.options,
        correctAnswer: q.correct_answer,
        explanation: q.explanation,
      }))

      setQuestions(transformedQuestions)
      setTimeRemaining(120 * 60) // 2 hours for daily test
      setCurrentQuestionIndex(0)
      setAnswers({})
      setMarked(new Set())
      setTestStartTime(new Date())
      setTestState('active')
    } catch (err) {
      console.error('Error starting daily test:', err)
    } finally {
      setDailyTestLoading(false)
    }
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
          {/* Test Type Selection */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-[1px] bg-secondary"></span>
              <h2 className="font-label text-xs font-bold uppercase tracking-[0.05em] text-secondary">00. Test Type</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Daily Test Card */}
              <button
                onClick={() => setTestType('daily')}
                disabled={!latestTestDate}
                className={`p-8 rounded-xl text-left transition-all duration-300 relative overflow-hidden ${
                  testType === 'daily'
                    ? 'border-2 border-secondary bg-surface-container-lowest'
                    : 'bg-surface-container-low border border-transparent'
                } ${!latestTestDate ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-container-high active:scale-95'}`}
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="material-symbols-outlined text-secondary text-2xl">calendar_today</span>
                      <h3 className="font-headline text-2xl text-primary mt-2 mb-2">Today's CLAT Test</h3>
                      <p className="text-xs text-on-surface-variant font-body mb-4">
                        {latestTestDate ? new Date(latestTestDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Loading...'}
                      </p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${testType === 'daily' ? 'bg-secondary border-secondary' : 'border-outline-variant'}`}>
                      {testType === 'daily' && <span className="material-symbols-outlined text-[16px] text-white">check</span>}
                    </div>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Auto-generated from today's real news articles. 20 questions based on current affairs, legal, and constitutional topics.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded text-xs font-bold">
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    AI-Generated
                  </div>
                </div>
              </button>

              {/* Custom Test Card */}
              <button
                onClick={() => setTestType('custom')}
                className={`p-8 rounded-xl text-left transition-all duration-300 hover:bg-surface-container-high active:scale-95 ${
                  testType === 'custom'
                    ? 'border-2 border-secondary bg-surface-container-lowest'
                    : 'bg-surface-container-low border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="material-symbols-outlined text-secondary text-2xl">tune</span>
                    <h3 className="font-headline text-2xl text-primary mt-2 mb-2">Custom Test</h3>
                    <p className="text-xs text-on-surface-variant font-body mb-4">Build your own</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${testType === 'custom' ? 'bg-secondary border-secondary' : 'border-outline-variant'}`}>
                    {testType === 'custom' && <span className="material-symbols-outlined text-[16px] text-white">check</span>}
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Choose your own subjects, difficulty level, number of questions, and time limit.
                </p>
              </button>
            </div>
          </section>

          {/* Conditional Sections for Custom Test */}
          {testType === 'custom' && (
            <>
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
                    <button onClick={startCustomTest} className="w-full md:w-auto px-10 py-5 bg-secondary text-on-secondary rounded-xl font-bold text-base hover:bg-secondary-container transition-all shadow-lg active:scale-95 group">
                      <span className="flex items-center justify-center gap-2">
                        Start Practice Test
                        <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </span>
                    </button>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Daily Test CTA - shown when daily is selected */}
          {testType === 'daily' && (
            <section className="p-8 md:p-12 rounded-2xl bg-primary-container relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary opacity-5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                    </div>
                    <h3 className="font-headline text-2xl text-white">20 AI-Generated Questions</h3>
                  </div>
                  <p className="text-on-primary-container text-sm max-w-lg leading-relaxed">
                    These questions are automatically generated by our AI based on today's major news stories from <span className="text-secondary-container font-bold">The Hindu and The Indian Express</span>. Perfect for staying current with contemporary affairs.
                  </p>
                </div>
                <button
                  onClick={startDailyTest}
                  disabled={dailyTestLoading || !latestTestDate}
                  className="px-10 py-5 bg-secondary text-on-secondary rounded-xl font-bold text-base hover:bg-secondary-container transition-all shadow-lg active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center gap-2">
                    {dailyTestLoading ? 'Loading...' : 'Start Daily Test'}
                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </span>
                </button>
              </div>
            </section>
          )}
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
      <div className="flex flex-col -m-6 md:-m-10 min-h-[calc(100vh-4rem)]">
        {/* Top Bar */}
        <div className="bg-surface-container-low border-b border-outline-variant px-6 py-4 flex items-center justify-between flex-shrink-0">
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
          <div className="flex-1 overflow-y-auto p-6 md:p-8">
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
          <div className="w-36 bg-surface-container-low border-l border-outline-variant p-4 overflow-y-auto flex-shrink-0 hidden md:block">
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
import { useState, useEffect } from 'react'
import { mockData } from '../data/mockTest'
import { getDailyMockTest, getLatestMockTestDate } from '../lib/progress'
import { useAuth } from '../lib/AuthContext'

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
  // Auth context
  const { user } = useAuth()

  // State for configuration screen
  const [testType, setTestType] = useState('custom') // 'daily' or 'custom'
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

  // State for daily test
  const [latestTestDate, setLatestTestDate] = useState(null)
  const [dailyTestLoading, setDailyTestLoading] = useState(false)

  // Load latest daily test date on mount
  useEffect(() => {
    const loadLatestDate = async () => {
      const date = await getLatestMockTestDate()
      setLatestTestDate(date)
    }
    loadLatestDate()
  }, [])

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

  const startCustomTest = () => {
    const generatedQuestions = generateTestQuestions()
    setQuestions(generatedQuestions)
    setTimeRemaining(timeLimit * 60)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setMarked(new Set())
    setTestStartTime(new Date())
    setTestState('active')
  }

  const startDailyTest = async () => {
    setDailyTestLoading(true)
    try {
      if (!latestTestDate) {
        console.error('No daily test date available')
        setDailyTestLoading(false)
        return
      }

      const dailyQuestions = await getDailyMockTest(latestTestDate)
      if (dailyQuestions.length === 0) {
        console.error('No questions found for today')
        setDailyTestLoading(false)
        return
      }

      // Transform daily questions to match expected format
      const transformedQuestions = dailyQuestions.map((q, idx) => ({
        id: q.id,
        passageId: q.passage_category,
        passageText: q.passage_text,
        passageCategory: q.passage_category,
        questionText: q.question_text,
        options: q.options,
        correctAnswer: q.correct_answer,
        explanation: q.explanation,
      }))

      setQuestions(transformedQuestions)
      setTimeRemaining(120 * 60) // 2 hours for daily test
      setCurrentQuestionIndex(0)
      setAnswers({})
      setMarked(new Set())
      setTestStartTime(new Date())
      setTestState('active')
    } catch (err) {
      console.error('Error starting daily test:', err)
    } finally {
      setDailyTestLoading(false)
    }
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
          {/* Test Type Selection */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-[1px] bg-secondary"></span>
              <h2 className="font-label text-xs font-bold uppercase tracking-[0.05em] text-secondary">00. Test Type</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Daily Test Card */}
              <button
                onClick={() => setTestType('daily')}
                disabled={!latestTestDate}
                className={`p-8 rounded-xl text-left transition-all duration-300 relative overflow-hidden ${
                  testType === 'daily'
                    ? 'border-2 border-secondary bg-surface-container-lowest'
                    : 'bg-surface-container-low border border-transparent'
                } ${!latestTestDate ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-container-high active:scale-95'}`}
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="material-symbols-outlined text-secondary text-2xl">calendar_today</span>
                      <h3 className="font-headline text-2xl text-primary mt-2 mb-2">Today's CLAT Test</h3>
                      <p className="text-xs text-on-surface-variant font-body mb-4">
                        {latestTestDate ? new Date(latestTestDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Loading...'}
                      </p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${testType === 'daily' ? 'bg-secondary border-secondary' : 'border-outline-variant'}`}>
                      {testType === 'daily' && <span className="material-symbols-outlined text-[16px] text-white">check</span>}
                    </div>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    Auto-generated from today's real news articles. 20 questions based on current affairs, legal, and constitutional topics.
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded text-xs font-bold">
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    AI-Generated
                  </div>
                </div>
              </button>

              {/* Custom Test Card */}
              <button
                onClick={() => setTestType('custom')}
                className={`p-8 rounded-xl text-left transition-all duration-300 hover:bg-surface-container-high active:scale-95 ${
                  testType === 'custom'
                    ? 'border-2 border-secondary bg-surface-container-lowest'
                    : 'bg-surface-container-low border border-transparent'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="material-symbols-outlined text-secondary text-2xl">tune</span>
                    <h3 className="font-headline text-2xl text-primary mt-2 mb-2">Custom Test</h3>
                    <p className="text-xs text-on-surface-variant font-body mb-4">Build your own</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${testType === 'custom' ? 'bg-secondary border-secondary' : 'border-outline-variant'}`}>
                    {testType === 'custom' && <span className="material-symbols-outlined text-[16px] text-white">check</span>}
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Choose your own subjects, difficulty level, number of questions, and time limit.
                </p>
              </button>
            </div>
          </section>

          {/* Conditional Sections for Custom Test */}
          {testType === 'custom' && (
            <>
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
                      <span className="ms-3 text-sm font-bold text-white uW&66RG&6¶ær×vFW7B#ä7FfSÂ÷7ãà¢ÂöÆ&VÃà¢Æ'WGFöâöä6Æ6³×·7F'D7W7FöÕFW7GÒ6Æ74æÖSÒ'rÖgVÆÂÖC§rÖWFòÓÓR&r×6V6öæF'FWBÖöâ×6V6öæF'&÷VæFVB×ÂföçBÖ&öÆBFWBÖ&6R÷fW#¦&r×6V6öæF'Ö6öçFæW"G&ç6FöâÖÆÂ6F÷rÖÆr7FfS§66ÆRÓRw&÷W#à¢Ç7â6Æ74æÖSÒ&fÆWFV×2Ö6VçFW"§W7FgÖ6VçFW"vÓ"#à¢7F'B&7F6RFW7@¢Ç7â6Æ74æÖSÒ&ÖFW&Â×7Ö&öÇ2Ö÷WFÆæVBFWBÖÆrw&÷WÖ÷fW#§G&ç6ÆFR×ÓG&ç6Föâ×G&ç6f÷&Ò#æ'&÷uöf÷'v&CÂ÷7ãà¢Â÷7ãà¢Âö'WGFöãà¢ÂöFcà¢ÂöFcà¢Â÷6V7Föãà¢Âóà¢Ð ¢²ò¢FÇFW7B5DÒ6÷vâvVâFÇ26VÆV7FVB¢÷Ð¢·FW7EGRÓÓÒvFÇrbb¢Ç6V7Föâ6Æ74æÖSÒ'ÓÖC§Ó"&÷VæFVBÓ'Â&r×&Ö'Ö6öçFæW"&VÆFfR÷fW&fÆ÷rÖFFVâ#à¢ÆFb6Æ74æÖSÒ&'6öÇWFRF÷Ó&vBÓrÓcBÓcB&r×6V6öæF'÷6GÓR&ÇW"Õ³Ò&÷VæFVBÖgVÆÂ×G&ç6ÆFR×Óó"G&ç6ÆFR×Óó"#ãÂöFcà¢ÆFb6Æ74æÖSÒ&fÆWfÆWÖ6öÂÖC¦fÆW×&÷rÖC¦FV×2Ö6VçFW"§W7FgÖ&WGvVVâvÓ&VÆFfR¢Ó#à¢ÆFb6Æ74æÖSÒ&fÆWÓ#à¢ÆFb6Æ74æÖSÒ&fÆWFV×2Ö6VçFW"vÓBÖ"Ó2#à¢ÆFb6Æ74æÖSÒ'rÓ"Ó"&÷VæFVBÖgVÆÂ&r×6V6öæF'Ö6öçFæW"ó#fÆWFV×2Ö6VçFW"§W7FgÖ6VçFW"#à¢Ç7â6Æ74æÖSÒ&ÖFW&Â×7Ö&öÇ2Ö÷WFÆæVBFWB×6V6öæF'Ö6öçFæW""7GÆS×·²föçEf&Föå6WGFæw3¢"tdÄÂr"×ÓçG&VæFæu÷WÂ÷7ãà¢ÂöFcà¢Æ26Æ74æÖSÒ&föçBÖVFÆæRFWBÓ'ÂFWB×vFR#ã#ÔvVæW&FVBVW7Föç3Âö3à¢ÂöFcà¢Ç6Æ74æÖSÒ'FWBÖöâ×&Ö'Ö6öçFæW"FWB×6ÒÖ×rÖÆrÆVFær×&VÆVB#à¢FW6RVW7Föç2&RWFöÖF6ÆÇvVæW&FVB'÷W"&6VBöâFöFw2Ö¦÷"æWw27F÷&W2g&öÒÇ7â6Æ74æÖSÒ'FWB×6V6öæF'Ö6öçFæW"föçBÖ&öÆB#åFRæGRæBFRæFâW&W73Â÷7ãââW&fV7Bf÷"7Fær7W'&VçBvF6öçFV×÷&'ff'2à¢Â÷à¢ÂöFcà¢Æ'WGFöà¢öä6Æ6³×·7F'DFÇFW7GÐ¢F6&ÆVC×¶FÇFW7DÆöFærÇÂÆFW7EFW7DFFWÐ¢6Æ74æÖSÒ'ÓÓR&r×6V6öæF'FWBÖöâ×6V6öæF'&÷VæFVB×ÂföçBÖ&öÆBFWBÖ&6R÷fW#¦&r×6V6öæF'Ö6öçFæW"G&ç6FöâÖÆÂ6F÷rÖÆr7FfS§66ÆRÓRw&÷WF6&ÆVC¦÷6GÓSF6&ÆVC¦7W'6÷"Öæ÷BÖÆÆ÷vVB ¢à¢Ç7â6Æ74æÖSÒ&fÆWFV×2Ö6VçFW"§W7FgÖ6VçFW"vÓ"#à¢¶FÇFW7DÆöFæròtÆöFærâââr¢u7F'BFÇFW7BwÐ¢Ç7â6Æ74æÖSÒ&ÖFW&Â×7Ö&öÇ2Ö÷WFÆæVBFWBÖÆrw&÷WÖ÷fW#§G&ç6ÆFR×ÓG&ç6Föâ×G&ç6f÷&Ò#æ'&÷uöf÷'v&CÂ÷7ãà¢Â÷7ãà¢Âö'WGFöãà¢ÂöFcà¢Â÷6V7Föãà¢Ð¢ÂöFcà ¢²ò¢fö÷FW"æ÷FR¢÷Ð¢Æ6FR6Æ74æÖSÒ&×BÓ#&÷&FW"ÖÂÓB&÷&FW"×6V6öæF'&r×7W&f6RÖ6öçFæW"ÖÆ÷rÓ&÷VæFVB×"×ÂÖ"Ó"#à¢ÆB6Æ74æÖSÒ&föçBÖÆ&VÂFWB×2föçBÖ&öÆBWW&66RG&6¶ærÕ³ãVVÕÒFWB×6V6öæF'Ö"Ó"#å&ö7F÷"w2æ÷FSÂöCà¢Ç6Æ74æÖSÒ&föçBÖ&öGFWBÖöâ×7W&f6R×f&çBFWB×6ÒFÆ2ÆVFær×&VÆVB#à¢%&W&Föâ2æ÷BFR7Böbç7vW&ærVW7Föç2÷RÇ&VG¶æ÷s²B2FRF66ÆæVBW'7VBöbF÷6RFB7W'&VçFÇW66R÷W"&V6öæærâVç7W&R÷W"7V&¦V7B6VÆV7FöâF&vWG2÷W"Æ÷vW7BW&6VçFÆR&V2f÷"Ö×VÒVff67â ¢Â÷à¢Âö6FSà¢ÂöFcà¢¢Ð ¢bFW7E7FFRÓÓÒv7FfRrbbVW7Föç2æÆVæwFâ°¢6öç7B7W'&VçEÒVW7Föç5¶7W'&VçEVW7FöäæFWÐ¢6öç7Bç7vW&VBÒö&¦V7Bæ¶W2ç7vW'2æÆVæwF¢6öç7B4Ö&¶VBÒÖ&¶VBæ27W'&VçEVW7FöäæFW¢6öç7B4ç7vW&VBÒç7vW'5¶7W'&VçEVW7FöäæFWÒÓÒVæFVfæV@ ¢&WGW&â¢ÆFb6Æ74æÖSÒ&fÆWfÆWÖ6öÂ×67&VVâ&rÖ&6¶w&÷VæB#à¢²ò¢F÷&"¢÷Ð¢ÆFb6Æ74æÖSÒ&&r×7W&f6RÖ6öçFæW"ÖÆ÷r&÷&FW"Ö"&÷&FW"Ö÷WFÆæRÓbÓBfÆWFV×2Ö6VçFW"§W7FgÖ&WGvVVâfÆW×6&æ²Ó#à¢ÆFb6Æ74æÖSÒ&fÆWFV×2Ö6VçFW"vÓ#à¢ÆFb6Æ74æÖSÒ&fÆWFV×2Ö6VçFW"vÓ"#à¢Ç7â6Æ74æÖSÒ&ÖFW&Â×7Ö&öÇ2Ö÷WFÆæVBFWB×6V6öæF'FWBÖÆr#ç66VGVÆSÂ÷7ãà¢Ç7â6Æ74æÖS×¶föçBÖ&öÆBFWBÖÆrG·FÖU&VÖæærÂ3òwFWB×&VBÓSr¢wFWB×6V6öæF'wÖÓà¢¶f÷&ÖEFÖRFÖU&VÖæærÐ¢Â÷7ãà¢ÂöFcà¢ÆFb6Æ74æÖSÒ'FWBÖöâ×7W&f6R×f&çBFWB×6Ò#à¢¶7W'&VçEVW7FöäæFW²Ò÷·VW7Föç2æÆVæwFÐ¢ÂöFcà¢ÆFb6Æ74æÖSÒ'FWBÖöâ×7W&f6R×f&çBFWB×6Ò#à¢¶7W'&VçEç76vT6FVv÷'Ð¢ÂöFcà¢ÂöFcà¢Æ'WGFöà¢öä6Æ6³×²Óâ6WE6÷u7V&ÖD6öæf&ÒG'VRÐ¢6Æ74æÖSÒ'ÓBÓ"&rÖW'&÷"FWBÖöâÖW'&÷"&÷VæFVBÖÆrföçBÖ&öÆBFWB×6Ò÷fW#¦&rÖW'&÷"óG&ç6FöâÖÆÂ7FfS§66ÆRÓR ¢à¢7V&ÖBFW7@¢Âö'WGFöãà¢ÂöFcà ¢ÆFb6Æ74æÖSÒ&fÆWfÆWÓ÷fW&fÆ÷rÖFFVâ#à¢²ò¢Öâ6öçFVçB¢÷Ð¢ÆFb6Æ74æÖSÒ&fÆWÓ÷fW&fÆ÷r×ÖWFòÓ&rÖ&6¶w&÷VæB#à¢²ò¢76vR¢÷Ð¢ÆFb6Æ74æÖSÒ&Ö"ÓÓb&r×7W&f6RÖ6öçFæW"ÖÆ÷r&÷VæFVB×Â#à¢Æ26Æ74æÖSÒ'FWB×2föçBÖ&öÆBWW&66RG&6¶ærÕ³ãVVÕÒFWB×6V6öæF'Ö"Ó2#ç¶7W'&VçEç76vT6FVv÷'ÓÂö3à¢Ç6Æ74æÖSÒ'FWBÖöâ×7W&f6R×f&çBÆVFær×&VÆVBFWB×6Ò#à¢¶7W'&VçEç76vUFWGÐ¢Â÷à¢ÂöFcà ¢²ò¢VW7Föâ¢÷Ð¢ÆFb6Æ74æÖSÒ&Ö"Ó#à¢Æ"6Æ74æÖSÒ'FWB×ÂföçBÖVFÆæRFWB×&Ö'Ö"ÓbÆVFær×&VÆVB#à¢¶7W'&VçEçVW7FöåFWGÐ¢Âö#à ¢²ò¢÷Föç2¢÷Ð¢ÆFb6Æ74æÖSÒ'76R×Ó2#à¢¶7W'&VçEæ÷Föç2æÖ÷FöâÂGÓâ¢ÆÆ&VÀ¢¶W×¶GÐ¢6Æ74æÖS×¶&Æö6²ÓB&÷VæFVBÖÆr&÷&FW"Ó"7W'6÷"×öçFW"G&ç6FöâÖÆÂG°¢ç7vW'5¶7W'&VçEVW7FöäæFWÒÓÓÒG¢òv&÷&FW"×6V6öæF'&r×7W&f6RÖ6öçFæW"ÖÆ÷vW7Bp¢¢v&÷&FW"Ö÷WFÆæR×f&çB&r×7W&f6RÖ6öçFæW"ÖÆ÷r÷fW#¦&r×7W&f6RÖ6öçFæW"ÖvW7Bp¢ÖÐ¢à¢ÆFb6Æ74æÖSÒ&fÆWFV×2×7F'BvÓB#à¢ÆçW@¢GSÒ'&Fò ¢æÖS×¶VW7FöâÒG¶7W'&VçEVW7FöäæFWÖÐ¢fÇVS×¶GÐ¢6V6¶VC×¶ç7vW'5¶7W'&VçEVW7FöäæFWÒÓÓÒGÐ¢öä6ævS×²ÓâæFÆTç7vW"GÐ¢6Æ74æÖSÒ&×BÓ66VçB×6V6öæF' ¢óà¢Ç7â6Æ74æÖSÒ'FWBÖöâ×7W&f6RÆVFær×&VÆVB#à¢¶÷FöçÐ¢Â÷7ãà¢ÂöFcà¢ÂöÆ&VÃà¢Ð¢ÂöFcà¢ÂöFcà ¢²ò¢æfvFöâ'WGFöç2¢÷Ð¢ÆFb6Æ74æÖSÒ&fÆWvÓB×BÓ"#à¢Æ'WGFöà¢öä6Æ6³×¶võFõ&Wf÷W7Ð¢F6&ÆVC×¶7W'&VçEVW7FöäæFWÓÓÒÐ¢6Æ74æÖS×¶ÓbÓ2&÷VæFVBÖÆrföçBÖ&öÆBFWB×6ÒG&ç6FöâÖÆÂG°¢7W'&VçEVW7FöäæFWÓÓÒ ¢òv&r×7W&f6RÖ6öçFæW"ÖÆ÷rFWBÖöâ×7W&f6R×f&çB7W'6÷"Öæ÷BÖÆÆ÷vVBp¢¢v&r×7W&f6RÖ6öçFæW"ÖÆ÷rFWB×6V6öæF'÷fW#¦&r×7W&f6RÖ6öçFæW"ÖvW7Bp¢ÖÐ¢à¢Ç7â6Æ74æÖSÒ&fÆWFV×2Ö6VçFW"vÓ"#à¢Ç7â6Æ74æÖSÒ&ÖFW&Â×7Ö&öÇ2Ö÷WFÆæVBFWBÖÆr#æ6Wg&öåöÆVgCÂ÷7ãà¢&Wf÷W0¢Â÷7ãà¢Âö'WGFöãà ¢Æ'WGFöà¢öä6Æ6³×·FövvÆTÖ&·Ð¢6Æ74æÖS×¶ÓbÓ2&÷VæFVBÖÆrföçBÖ&öÆBFWB×6ÒG&ç6FöâÖÆÂfÆWFV×2Ö6VçFW"vÓ"G°¢4Ö&¶V@¢òv&r×VÆÆ÷rÓSó#FWB×VÆÆ÷rÓC&÷&FW"&÷&FW"×VÆÆ÷rÓSp¢¢v&r×7W&f6RÖ6öçFæW"ÖÆ÷rFWBÖöâ×7W&f6R×f&çB÷fW#¦&r×7W&f6RÖ6öçFæW"ÖvW7Bp¢ÖÐ¢à¢Ç7â6Æ74æÖSÒ&ÖFW&Â×7Ö&öÇ2Ö÷WFÆæVBFWBÖÆr#æfÆsÂ÷7ãà¢¶4Ö&¶VBòtÖ&¶VBr¢tÖ&²wÐ¢Âö'WGFöãà ¢Æ'WGFöà¢öä6Æ6³×¶võFôæWGÐ¢F6&ÆVC×¶7W'&VçEVW7FöäæFWÓÓÒVW7Föç2æÆVæwFÒÐ¢6Æ74æÖS×¶ÓbÓ2&÷VæFVBÖÆrföçBÖ&öÆBFWB×6ÒG&ç6FöâÖÆÂÖÂÖWFòG°¢7W'&VçEVW7FöäæFWÓÓÒVW7Föç2æÆVæwFÒ¢òv&r×7W&f6RÖ6öçFæW"ÖÆ÷rFWBÖöâ×7W&f6R×f&çB7W'6÷"Öæ÷BÖÆÆ÷vVBp¢¢v&r×6V6öæF'FWBÖöâ×6V6öæF'÷fW#¦&r×6V6öæF'Ö6öçFæW"p¢ÖÐ¢à¢Ç7â6Æ74æÖSÒ&fÆWFV×2Ö6VçFW"vÓ"#à¢æW@¢Ç7â6Æ74æÖSÒ&ÖFW&Â×7Ö&öÇ2Ö÷WFÆæVBFWBÖÆr#æ6Wg&öå÷&vCÂ÷7ãà¢Â÷7ãà¢Âö'WGFöãà¢ÂöFcà¢ÂöFcà ¢²ò¢VW7FöâÆWGFR6FV&"¢÷Ð¢ÆFb6Æ74æÖSÒ'rÓ3"&r×7W&f6RÖ6öçFæW"ÖÆ÷r&÷&FW"ÖÂ&÷&FW"Ö÷WFÆæRÓB÷fW&fÆ÷r×ÖWFòfÆW×6&æ²Ó#à¢Æ26Æ74æÖSÒ'FWB×2föçBÖ&öÆBWW&66RG&6¶ærÕ³ãVVÕÒFWB×6V6öæF'Ö"ÓB#åVW7Föç3Âö3à¢ÆFb6Æ74æÖSÒ&w&Bw&BÖ6öÇ2Ó2vÓ"#à¢·VW7Föç2æÖòÂGÓâ°¢6öç7B4ç7rÒç7vW'5¶GÒÓÒVæFVfæV@¢6öç7B4Ö&²ÒÖ&¶VBæ2G¢6öç7B47W'&VçBÒGÓÓÒ7W'&VçEVW7FöäæFW ¢&WGW&â¢Æ'WGFöà¢¶W×¶GÐ¢öä6Æ6³×²ÓâvõFõVW7FöâGÐ¢6Æ74æÖS×¶rÖgVÆÂ7V7B×7V&R&÷VæFVBFWB×2föçBÖ&öÆBfÆWFV×2Ö6VçFW"§W7FgÖ6VçFW"G&ç6FöâÖÆÂG°¢47W'&Vç@¢òv&r×6V6öæF'FWBÖöâ×6V6öæF'&ærÓ"&ær×6V6öæF'p¢¢4ç7rbb4Ö&°¢òv&r×VÆÆ÷rÓSó3FWB×VÆÆ÷rÓC&÷&FW"&÷&FW"×VÆÆ÷rÓSp¢¢4ç7p¢òv&rÖw&VVâÓSó3FWBÖw&VVâÓC&÷&FW"&÷&FW"Öw&VVâÓSp¢¢v&r×7W&f6RÖ6öçFæW"ÖvW7BFWBÖöâ×7W&f6R×f&çBp¢ÖÐ¢à¢¶G²Ð¢Âö'WGFöãà¢¢ÒÐ¢ÂöFcà¢ÆFb6Æ74æÖSÒ&×BÓb76R×Ó"FWBÕ³ÒFWBÖöâ×7W&f6R×f&çB#à¢ÆFb6Æ74æÖSÒ&fÆWFV×2Ö6VçFW"vÓ"#à¢ÆFb6Æ74æÖSÒ'rÓ2Ó2&÷VæFVB&rÖw&VVâÓSó3&÷&FW"&÷&FW"Öw&VVâÓS#ãÂöFcà¢Ç7ãäç7vW&VCÂ÷7ãà¢ÂöFcà¢ÆFb6Æ74æÖSÒ&fÆWFV×2Ö6VçFW"vÓ"#à¢ÆFb6Æ74æÖSÒ'rÓ2Ó2&÷VæFVB&r×VÆÆ÷rÓSó3&÷&FW"&÷&FW"×VÆÆ÷rÓS#ãÂöFcà¢Ç7ãäÖ&¶VCÂ÷7ãà¢ÂöFcà¢ÆFb6Æ74æÖSÒ&fÆWFV×2Ö6VçFW"vÓ"#à¢ÆFb6Æ74æÖSÒ'rÓ2Ó2&÷VæFVB&r×7W&f6RÖ6öçFæW"ÖvW7B#ãÂöFcà¢Ç7ãäæ÷Bç7vW&VCÂ÷7ãà¢ÂöFcà¢ÂöFcà¢ÂöFcà¢ÂöFcà ¢²ò¢7V&ÖB6öæf&ÖFöâFÆör¢÷Ð¢·6÷u7V&ÖD6öæf&Òbb¢ÆFb6Æ74æÖSÒ&fVBç6WBÓ&rÖ&Æ6²óSfÆWFV×2Ö6VçFW"§W7FgÖ6VçFW"¢ÓS#à¢ÆFb6Æ74æÖSÒ&&r×7W&f6RÖ6öçFæW"&÷VæFVBÓ'ÂÓÖ×rÖÖBrÖgVÆÂ×ÓB#à¢Æ"6Æ74æÖSÒ'FWBÓ'ÂföçBÖVFÆæRFWB×&Ö'Ö"ÓB#å7V&ÖBFW7CóÂö#à¢Ç6Æ74æÖSÒ'FWBÖöâ×7W&f6R×f&çBÖ"Ó"#à¢÷RfRç7vW&VBÇ7â6Æ74æÖSÒ'FWB×6V6öæF'föçBÖ&öÆB#ç¶ç7vW&VGÓÂ÷7ãâ÷WBöbÇ7â6Æ74æÖSÒ'FWB×6V6öæF'föçBÖ&öÆB#ç·VW7Föç2æÆVæwFÓÂ÷7ãâVW7Föç2à¢Â÷à¢Ç6Æ74æÖSÒ'FWBÖöâ×7W&f6R×f&çBÖ"Ób#à¢FÖR&VÖææs¢Ç7â6Æ74æÖSÒ'FWB×6V6öæF'föçBÖ&öÆB#ç¶f÷&ÖEFÖRFÖU&VÖæærÓÂ÷7ãà¢Â÷à¢ÆFb6Æ74æÖSÒ&fÆWvÓB#à¢Æ'WGFöà¢öä6Æ6³×²Óâ6WE6÷u7V&ÖD6öæf&ÒfÇ6RÐ¢6Æ74æÖSÒ&fÆWÓÓBÓ2&r×7W&f6RÖ6öçFæW"ÖÆ÷vW7B&÷&FW"&÷&FW"Ö÷WFÆæR&÷VæFVBÖÆrföçBÖ&öÆBFWBÖöâ×7W&f6R÷fW#¦&r×7W&f6RÖ6öçFæW"ÖvW7BG&ç6FöâÖÆÂ ¢à¢6öçFçVRFW7@¢Âö'WGFöãà¢Æ'WGFöà¢öä6Æ6³×·7V&ÖEFW7GÐ¢6Æ74æÖSÒ&fÆWÓÓBÓ2&rÖW'&÷"FWBÖöâÖW'&÷"&÷VæFVBÖÆrföçBÖ&öÆB÷fW#¦&rÖW'&÷"óG&ç6FöâÖÆÂ7FfS§66ÆRÓR ¢à¢7V&ÖBæ÷p¢Âö'WGFöãà¢ÂöFcà¢ÂöFcà¢ÂöFcà¢Ð¢ÂöFcà¢¢Ð ¢bFW7E7FFRÓÓÒw&W7VÇG2rbbVW7Föç2æÆVæwFâ°¢6öç7B²6÷'&V7D6÷VçBÂ67W&7ÂFÖUF¶VâÒÒ6Æ7VÆFU&W7VÇG2¢6öç7BV&æVBÒÖFæÖâS²ÖFæfÆö÷"6÷'&V7D6÷VçB¢RÂ# ¢&WGW&â¢ÆFb6Æ74æÖSÒ&Ö×rÓGÂ×ÖWFòBÓ""Ó"#à¢²ò¢Fö7Bæ÷Ff6Föâ¢÷Ð¢ÆFb6Æ74æÖSÒ&fVBF÷Ób&vBÓb&rÖw&VVâÓSó#&÷&FW"&÷&FW"Öw&VVâÓSFWBÖw&VVâÓCÓbÓB&÷VæFVBÖÆrföçBÖ&öÆBFWB×6ÒæÖFR×VÇ6R¢ÓS#à¢Ç7â6Æ74æÖSÒ&fÆWFV×2Ö6VçFW"vÓ"#à¢Ç7â6Æ74æÖSÒ&ÖFW&Â×7Ö&öÇ2Ö÷WFÆæVB#æ6V6µö6&6ÆSÂ÷7ãà¢··V&æVGÒV&æVB¢Â÷7ãà¢ÂöFcà ¢²ò¢VFW"¢÷Ð¢ÆFb6Æ74æÖSÒ'FWBÖ6VçFW"Ö"Ó"#à¢Æ6Æ74æÖSÒ&föçBÖVFÆæRFWBÓWÂÖC§FWBÓgÂFWB×&Ö'Ö"ÓB#åFW7B6ö×ÆWFSÂöà¢Ç6Æ74æÖSÒ'FWBÖöâ×7W&f6R×f&çBFWBÖÆr#äÆWBw2&WfWr÷W"W&f÷&Öæ6SÂ÷à¢ÂöFcà ¢²ò¢66÷&R6V7Föâ¢÷Ð¢Ç6V7Föâ6Æ74æÖSÒ&Ö"Ó"ÓÖC§Ó"&r×&Ö'Ö6öçFæW"&÷VæFVBÓ'Â&VÆFfR÷fW&fÆ÷rÖFFVâ#à¢ÆFb6Æ74æÖSÒ&'6öÇWFRF÷Ó&vBÓrÓcBÓcB&r×6V6öæF'÷6GÓR&ÇW"Õ³Ò&÷VæFVBÖgVÆÂ×G&ç6ÆFR×Óó"G&ç6ÆFR×Óó"#ãÂöFcà¢ÆFb6Æ74æÖSÒ'&VÆFfR¢Ó#à¢ÆFb6Æ74æÖSÒ&w&Bw&BÖ6öÇ2ÓÖC¦w&BÖ6öÇ2Ó2vÓÖ"Ó#à¢²ò¢66÷&R¢÷Ð¢ÆFb6Æ74æÖSÒ'FWBÖ6VçFW"#à¢ÆFb6Æ74æÖSÒ'FWBÓWÂföçBÖVFÆæRFWB×6V6öæF'Ö"Ó"#ç¶6÷'&V7D6÷VçGÓÂöFcà¢ÆFb6Æ74æÖSÒ'FWBÖöâ×&Ö'Ö6öçFæW"FWB×6Ò#ä÷WBöb·VW7Föç2æÆVæwFÒ6÷'&V7CÂöFcà¢ÂöFcà ¢²ò¢67W&7¢÷Ð¢ÆFb6Æ74æÖSÒ'FWBÖ6VçFW"#à¢ÆFb6Æ74æÖS×¶FWBÓWÂföçBÖVFÆæRÖ"Ó"G¶67W&7ãÒsòwFWBÖw&VVâÓCr¢67W&7ãÒSòwFWB×VÆÆ÷rÓCr¢wFWB×&VBÓCwÖÓà¢¶67W&7ÒP¢ÂöFcà¢ÆFb6Æ74æÖSÒ'FWBÖöâ×&Ö'Ö6öçFæW"FWB×6Ò#ä67W&7ÂöFcà¢ÆFb6Æ74æÖSÒ&×BÓ2rÖgVÆÂ&r×vFRó&÷VæFVBÖgVÆÂÓ"÷fW&fÆ÷rÖFFVâ#à¢ÆF`¢6Æ74æÖS×¶ÖgVÆÂG&ç6FöâÖÆÂG¶67W&7ãÒsòv&rÖw&VVâÓCr¢67W&7ãÒSòv&r×VÆÆ÷rÓCr¢v&r×&VBÓCwÖÐ¢7GÆS×·²vGF¢G¶67W&7ÒV×Ð¢ãÂöFcà¢ÂöFcà¢ÂöFcà ¢²ò¢FÖR¢÷Ð¢ÆFb6Æ74æÖSÒ'FWBÖ6VçFW"#à¢ÆFb6Æ74æÖSÒ'FWBÓWÂföçBÖVFÆæRFWB×6V6öæF'Ö"Ó"#ç´ÖFæfÆö÷"FÖUF¶VâòcÓÂöFcà¢ÆFb6Æ74æÖSÒ'FWBÖöâ×&Ö'Ö6öçFæW"FWB×6Ò#äÖçWFW2F¶VãÂöFcà¢ÆFb6Æ74æÖSÒ'FWB×2FWBÖöâ×&Ö'Ö6öçFæW"ós×BÓ#à¢·FÖUF¶VâRcÒ6V6öæG0¢ÂöFcà¢ÂöFcà¢ÂöFcà¢ÂöFcà¢Â÷6V7Föãà ¢²ò¢7FG2w&B¢÷Ð¢Ç6V7Föâ6Æ74æÖSÒ&w&Bw&BÖ6öÇ2Ó"ÖC¦w&BÖ6öÇ2ÓBvÓBÖ"Ó"#à¢ÆFb6Æ74æÖSÒ'Ób&r×7W&f6RÖ6öçFæW"ÖÆ÷r&÷VæFVB×ÂFWBÖ6VçFW"#à¢ÆFb6Æ74æÖSÒ'FWBÓ'ÂföçBÖ&öÆBFWB×6V6öæF'Ö"Ó#ç¶ç7vW&VGÓÂöFcà¢ÆFb6Æ74æÖSÒ'FWB×2FWBÖöâ×7W&f6R×f&çBföçBÖÆ&VÂWW&66RG&6¶ær×vFR#äç7vW&VCÂöFcà¢ÂöFcà¢ÆFb6Æ74æÖSÒ'Ób&r×7W&f6RÖ6öçFæW"ÖÆ÷r&÷VæFVB×ÂFWBÖ6VçFW"#à¢ÆFb6Æ74æÖSÒ'FWBÓ'ÂföçBÖ&öÆBFWB×VÆÆ÷rÓCÖ"Ó#ç¶Ö&¶VBç6¦WÓÂöFcà¢ÆFb6Æ74æÖSÒ'FWB×2FWBÖöâ×7W&f6R×f&çBföçBÖÆ&VÂWW&66RG&6¶ær×vFR#äÖ&¶VCÂöFcà¢ÂöFcà¢ÆFb6Æ74æÖSÒ'Ób&r×7W&f6RÖ6öçFæW"ÖÆ÷r&÷VæFVB×ÂFWBÖ6VçFW"#à¢ÆFb6Æ74æÖSÒ'FWBÓ'ÂföçBÖ&öÆBFWBÖöâ×7W&f6R×f&çBÖ"Ó#ç·VW7Föç2æÆVæwFÒç7vW&VGÓÂöFcà¢ÆFb6Æ74æÖSÒ'FWB×2FWBÖöâ×7W&f6R×f&çBföçBÖÆ&VÂWW&66RG&6¶ær×vFR#åVæç7vW&VCÂöFcà¢ÂöFcà¢ÆFb6Æ74æÖSÒ'Ób&r×7W&f6RÖ6öçFæW"ÖÆ÷r&÷VæFVB×ÂFWBÖ6VçFW"#à¢ÆFb6Æ74æÖSÒ'FWBÓ'ÂföçBÖ&öÆBFWBÖw&VVâÓCÖ"Ó#â··V&æVGÒÂöFcà¢ÆFb6Æ74æÖSÒ'FWB×2FWBÖöâ×7W&f6R×f&çBföçBÖÆ&VÂWW&66RG&6¶ær×vFR#äV&æVCÂöFcà¢ÂöFcà¢Â÷6V7Föãà ¢²ò¢VW7Föâ&WfWr¢÷Ð¢Ç6V7Föâ6Æ74æÖSÒ&Ö"Ó"#à¢ÆFb6Æ74æÖSÒ&fÆWFV×2Ö6VçFW"vÓ2Ö"Ó#à¢Ç7â6Æ74æÖSÒ'rÓÕ³Ò&r×6V6öæF'#ãÂ÷7ãà¢Æ"6Æ74æÖSÒ&föçBÖÆ&VÂFWB×2föçBÖ&öÆBWW&66RG&6¶ærÕ³ãVVÕÒFWB×6V6öæF'#åVW7Föâ&WfWsÂö#à¢ÂöFcà ¢ÆFb6Æ74æÖSÒ'76R×Ób#à¢·VW7Föç2æÖÂGÓâ°¢6öç7BW6W$ç7vW"Òç7vW'5¶GÐ¢6öç7B46÷'&V7BÒW6W$ç7vW"ÓÓÒæ6÷'&V7Dç7vW ¢6öç7Bv4Ö&¶VBÒÖ&¶VBæ2G ¢&WGW&â¢ÆF`¢¶W×¶GÐ¢6Æ74æÖS×¶Ób&÷VæFVB×Â&÷&FW"Ó"G°¢46÷'&V7@¢òv&÷&FW"Öw&VVâÓSóS&rÖw&VVâÓSóp¢¢v&÷&FW"×&VBÓSóS&r×&VBÓSóp¢ÖÐ¢à¢ÆFb6Æ74æÖSÒ&fÆWFV×2×7F'BvÓBÖ"ÓB#à¢ÆFb6Æ74æÖS×¶fÆW×6&æ²ÓrÓÓ&÷VæFVBÖgVÆÂfÆWFV×2Ö6VçFW"§W7FgÖ6VçFW"FWB×6ÒföçBÖ&öÆBG¶46÷'&V7Bòv&rÖw&VVâÓSFWB×vFRr¢v&r×&VBÓSFWB×vFRwÖÓà¢¶46÷'&V7Bò~)É2r¢~)ÉrwÐ¢ÂöFcà¢ÆFb6Æ74æÖSÒ&fÆWÓ#à¢Æ26Æ74æÖSÒ'FWBÖöâ×7W&f6RÖ"Ó"ÆVFær×&VÆVB#ç·çVW7FöåFWGÓÂö3à¢·v4Ö&¶VBbb¢ÆFb6Æ74æÖSÒ&æÆæRÖfÆWFV×2Ö6VçFW"vÓ"Ó2Ó&r×VÆÆ÷rÓSó#FWB×VÆÆ÷rÓC&÷VæFVBFWB×2föçBÖ&öÆBÖ"Ó2#à¢Ç7â6Æ74æÖSÒ&ÖFW&Â×7Ö&öÇ2Ö÷WFÆæVBFWB×6Ò#æfÆsÂ÷7ãà¢Ö&¶V@¢ÂöFcà¢Ð¢ÂöFcà¢ÂöFcà ¢ÆFb6Æ74æÖSÒ&ÖÂÓ"76R×Ó2#à¢ÆFcà¢Ç6Æ74æÖSÒ'FWB×2FWBÖöâ×7W&f6R×f&çBföçBÖ&öÆBÖ"Ó#å÷W"ç7vW#£Â÷à¢Ç6Æ74æÖS×¶FWB×6ÒG¶46÷'&V7BòwFWBÖw&VVâÓCr¢wFWB×&VBÓCwÖÓà¢·W6W$ç7vW"ÓÒVæFVfæVBòæ÷Föç5·W6W$ç7vW%Ò¢tæ÷Bç7vW&VBwÐ¢Â÷à¢ÂöFcà ¢²46÷'&V7Bbb¢ÆFcà¢Ç6Æ74æÖSÒ'FWB×2FWBÖöâ×7W&f6R×f&çBföçBÖ&öÆBÖ"Ó#ä6÷'&V7Bç7vW#£Â÷à¢Ç6Æ74æÖSÒ'FWB×6ÒFWBÖw&VVâÓC#ç·æ÷Föç5·æ6÷'&V7Dç7vW%×ÓÂ÷à¢ÂöFcà¢Ð ¢ÆFcà¢Ç6Æ74æÖSÒ'FWB×2FWBÖöâ×7W&f6R×f&çBföçBÖ&öÆBÖ"Ó#äWÆæFöã£Â÷à¢Ç6Æ74æÖSÒ'FWB×6ÒFWBÖöâ×7W&f6R×f&çBÆVFær×&VÆVB#ç·æWÆæFöçÓÂ÷à¢ÂöFcà¢ÂöFcà¢ÂöFcà¢¢ÒÐ¢ÂöFcà¢Â÷6V7Föãà ¢²ò¢5D'WGFöç2¢÷Ð¢Ç6V7Föâ6Æ74æÖSÒ&fÆWvÓB§W7FgÖ6VçFW"#à¢Æ'WGFöà¢öä6Æ6³×·&WF¶UFW7GÐ¢6Æ74æÖSÒ'ÓÓB&r×6V6öæF'FWBÖöâ×6V6öæF'&÷VæFVB×ÂföçBÖ&öÆB÷fW#¦&r×6V6öæF'Ö6öçFæW"G&ç6FöâÖÆÂ6F÷rÖÆr7FfS§66ÆRÓR ¢à¢Ç7â6Æ74æÖSÒ&fÆWFV×2Ö6VçFW"vÓ"#à¢Ç7â6Æ74æÖSÒ&ÖFW&Â×7Ö&öÇ2Ö÷WFÆæVB#ç&W7F'EöÇCÂ÷7ãà¢&WF¶RFW7@¢Â÷7ãà¢Âö'WGFöãà¢Æ'WGFöà¢öä6Æ6³×¶võFôF6&ö&GÐ¢6Æ74æÖSÒ'ÓÓB&r×7W&f6RÖ6öçFæW"ÖÆ÷rFWB×6V6öæF'&÷VæFVB×ÂföçBÖ&öÆB÷fW#¦&r×7W&f6RÖ6öçFæW"ÖvW7BG&ç6FöâÖÆÂ7FfS§66ÆRÓR ¢à¢Ç7â6Æ74æÖSÒ&fÆWFV×2Ö6VçFW"vÓ"#à¢Ç7â6Æ74æÖSÒ&ÖFW&Â×7Ö&öÇ2Ö÷WFÆæVB#æöÖSÂ÷7ãà¢&6²FòF6&ö&@¢Â÷7ãà¢Âö'WGFöãà¢Â÷6V7Föãà¢ÂöFcà¢¢Ð ¢&WGW&âçVÆÀ§Ð
