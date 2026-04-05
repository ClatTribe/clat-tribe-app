import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../lib/AuthContext'
import {
  getEditorialsByDate,
  getEditorialQuestions,
  saveEditorialAttempt,
  getUserEditorialAttempts,
  getAvailableEditorialDates,
  addXP,
  logActivity
} from '../lib/progress'

// -- Helpers --------------------------------------------------

function formatDateISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatDateDisplay(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function isToday(dateStr) {
  return dateStr === formatDateISO(new Date())
}

// -- Main Component -------------------------------------------

export default function Article() {
  const { user, profile, refreshProfile } = useAuth()

  // Date state
  const [selectedDate, setSelectedDate] = useState(formatDateISO(new Date()))
  const [availableDates, setAvailableDates] = useState([])
  const [showDatePicker, setShowDatePicker] = useState(false)

  // Editorial state
  const [editorials, setEditorials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // View state
  const [activeView, setActiveView] = useState('list') // 'list' | 'reading' | 'quiz' | 'results'
  const [selectedEditorial, setSelectedEditorial] = useState(null)
  const [questions, setQuestions] = useState([])

  // Quiz state
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [quizStartTime, setQuizStartTime] = useState(null)
  const [previousAttempts, setPreviousAttempts] = useState([])

  // Toast
  const [toast, setToast] = useState(null)

  // -- Load available dates ---------------------------------
  useEffect(() => {
    async function loadDates() {
      const dates = await getAvailableEditorialDates(30)
      setAvailableDates(dates)
    }
    loadDates()
  }, [])

  // -- Load editorials for selected date --------------------
  useEffect(() => {
    async function loadEditorials() {
      setLoading(true)
      setError(null)
      try {
        const data = await getEditorialsByDate(selectedDate)
        setEditorials(data)
        if (data.length === 0 && !isToday(selectedDate)) {
          setError('No editorials available for this date.')
        } else if (data.length === 0) {
          setError('Today\'s editorials are being generated. Check back soon!')
        }
      } catch (err) {
        setError('Failed to load editorials.')
      }
      setLoading(false)
    }
    loadEditorials()
    setActiveView('list')
    setSelectedEditorial(null)
  }, [selectedDate])

  // -- Open an editorial ------------------------------------
  const openEditorial = useCallback(async (editorial) => {
    setSelectedEditorial(editorial)
    setActiveView('reading')
    setAnswers({})
    setSubmitted(false)
    setScore(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Load questions
    const qs = await getEditorialQuestions(editorial.id)
    setQuestions(qs)

    // Load previous attempts
    if (user) {
      const attempts = await getUserEditorialAttempts(user.id, editorial.id)
      setPreviousAttempts(attempts)
    }
  }, [user])

  // -- Start Quiz ------------------------------------------
  const startQuiz = () => {
    setActiveView('quiz')
    setAnswers({})
    setSubmitted(false)
    setScore(0)
    setQuizStartTime(Date.now())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // -- Handle answer selection ------------------------------
  const handleAnswer = (qIndex, option) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [qIndex]: option }))
  }

  // -- Submit quiz ------------------------------------------
  const submitQuiz = async () => {
    if (submitted) return

    let correct = 0
    questions.forEach((q, i) => {
      if (answers[i] === q.correct_option) correct++
    })

    setScore(correct)
    setSubmitted(true)
    setActiveView('results')

    const timeTaken = quizStartTime ? Math.round((Date.now() - quizStartTime) / 1000) : 0
    const xpEarned = correct * 5

    if (user) {
      await saveEditorialAttempt(user.id, selectedEditorial.id, correct, questions.length, answers, timeTaken)
      if (xpEarned > 0) {
        await addXP(user.id, xpEarned, 'editorial_quiz')
        await logActivity(user.id, 'editorial_quiz', xpEarned, {
          editorial_id: selectedEditorial.id,
          score: correct,
          total: questions.length,
          source: selectedEditorial.source
        })
        refreshProfile?.()
      }
    }

    showToast(`+${xpEarned} XP earned!`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // -- Navigation helpers -----------------------------------
  const goBack = () => {
    if (activeView === 'results' || activeView === 'quiz') {
      setActiveView('reading')
    } else {
      setActiveView('list')
      setSelectedEditorial(null)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateDate = (direction) => {
    const d = new Date(selectedDate + 'T00:00:00')
    d.setDate(d.getDate() + direction)
    const newDate = formatDateISO(d)
    const today = formatDateISO(new Date())
    if (newDate > today) return
    setSelectedDate(newDate)
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  // -- Source badge color -----------------------------------
  const sourceBadge = (source) => {
    if (source === 'The Hindu') return 'bg-blue-500/15 text-blue-400 border-blue-500/30'
    return 'bg-orange-500/15 text-orange-400 border-orange-500/30'
  }

  const sourceIcon = (source) => {
    return source === 'The Hindu' ? 'newspaper' : 'article'
  }

  // -- RENDER -------------------------------------------------

  // Toast notification
  const ToastEl = toast && (
    <div className="fixed top-6 right-6 bg-secondary text-on-secondary px-6 py-4 rounded-2xl shadow-lg z-50 flex items-center gap-3 animate-pulse">
      <span className="material-symbols-outlined">check_circle</span>
      <span className="font-bold">{toast}</span>
    </div>
  )

  // ---------------------------------------------------------
  // LIST VIEW -- Date picker + 4 editorial cards
  // ---------------------------------------------------------
  if (activeView === 'list') {
    return (
      <div className="pt-4 px-2 md:px-4 max-w-6xl mx-auto">
        {ToastEl}

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-8 h-[1px] bg-secondary"></span>
            <span className="font-label text-xs font-bold uppercase tracking-[0.05em] text-secondary">Daily Editorials</span>
          </div>
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-on-surface mb-2">
            Editorial Analysis
          </h1>
          <p className="text-on-surface-variant text-sm max-w-2xl">
            Curated editorials from The Hindu & The Indian Express with 10 passage-based MCQs each. New editorials every day.
          </p>
        </header>

        {/* Date Navigation */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <button
            onClick={() => navigateDate(-1)}
            className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center hover:bg-surface-container-highest transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">chevron_left</span>
          </button>

          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-low rounded-xl hover:bg-surface-container-highest transition-colors"
          >
            <span className="material-symbols-outlined text-secondary text-sm">calendar_today</span>
            <span className="font-bold text-sm text-on-surface">
              {isToday(selectedDate) ? 'Today' : formatDateDisplay(selectedDate)}
            </span>
            <span className="material-symbols-outlined text-on-surface-variant text-sm">expand_more</span>
          </button>

          <button
            onClick={() => navigateDate(1)}
            disabled={isToday(selectedDate)}
            className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center hover:bg-surface-container-highest transition-colors disabled:opacity-30"
          >
            <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
          </button>

          {!isToday(selectedDate) && (
            <button
              onClick={() => setSelectedDate(formatDateISO(new Date()))}
              className="px-4 py-2.5 bg-secondary/10 text-secondary rounded-xl text-xs font-bold hover:bg-secondary/20 transition-colors"
            >
              Jump to Today
            </button>
          )}
        </div>

        {/* Date Picker Dropdown */}
        {showDatePicker && (
          <div className="mb-8 p-4 bg-surface-container-low rounded-2xl border border-surface-container-highest">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">Available Dates</p>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {availableDates.map(date => (
                <button
                  key={date}
                  onClick={() => { setSelectedDate(date); setShowDatePicker(false) }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    date === selectedDate
                      ? 'bg-secondary text-on-secondary'
                      : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-highest'
                  }`}
                >
                  {isToday(date) ? 'Today' : formatDateShort(date)}
                </button>
              ))}
              {availableDates.length === 0 && (
                <p className="text-on-surface-variant text-sm">No previous editorials yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-secondary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4 block">article</span>
            <p className="text-on-surface-variant">{error}</p>
          </div>
        )}

        {/* Editorial Cards */}
        {!loading && editorials.length > 0 && (
          <>
            {/* Group by source */}
            {['The Hindu', 'The Indian Express'].map(source => {
              const sourceEditorials = editorials.filter(e => e.source === source)
              if (sourceEditorials.length === 0) return null
              return (
                <section key={source} className="mb-10">
                  <div className="flex items-center gap-3 mb-5">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${sourceBadge(source)}`}>
                      {source}
                    </span>
                    <span className="flex-1 h-[1px] bg-surface-container-highest"></span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sourceEditorials.map(editorial => (
                      <button
                        key={editorial.id}
                        onClick={() => openEditorial(editorial)}
                        className="text-left p-6 bg-surface-container-lowest rounded-2xl border border-surface-container-highest hover:border-secondary/40 hover:shadow-lg transition-all group"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                            <span className="material-symbols-outlined text-secondary">{sourceIcon(source)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary block mb-1">
                              {editorial.category}
                            </span>
                            <h3 className="font-headline text-lg font-bold text-on-surface leading-snug line-clamp-2 group-hover:text-secondary transition-colors">
                              {editorial.title}
                            </h3>
                          </div>
                        </div>
                        <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2 mb-4">
                          {editorial.summary}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">schedule</span>
                            {editorial.read_time_minutes} min
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">description</span>
                            {editorial.word_count?.toLocaleString()} words
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">quiz</span>
                            10 MCQs
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )
            })}
          </>
        )}
      </div>
    )
  }

  // ---------------------------------------------------------
  // READING VIEW -- Full editorial + "Attempt Questions" CTA
  // ---------------------------------------------------------
  if (activeView === 'reading' && selectedEditorial) {
    return (
      <div className="pt-4 px-2 md:px-4 max-w-5xl mx-auto">
        {ToastEl}

        {/* Back button */}
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-secondary transition-colors mb-6"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          All Editorials
        </button>

        {/* Editorial Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${sourceBadge(selectedEditorial.source)}`}>
              {selectedEditorial.source}
            </span>
            <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-surface-container-low text-on-surface-variant">
              {selectedEditorial.category}
            </span>
          </div>

          <h1 className="font-headline text-4xl md:text-5xl font-bold text-on-surface leading-[1.1] mb-6 tracking-tight">
            {selectedEditorial.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 border-y border-surface-container-highest py-5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-sm">schedule</span>
              <span className="text-sm font-medium text-on-surface-variant">{selectedEditorial.read_time_minutes} Min Read</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-sm">description</span>
              <span className="text-sm font-medium text-on-surface-variant">{selectedEditorial.word_count?.toLocaleString()} Words</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-sm">calendar_today</span>
              <span className="text-sm font-medium text-on-surface-variant">{formatDateDisplay(selectedEditorial.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-sm">quiz</span>
              <span className="text-sm font-medium text-on-surface-variant">10 MCQs</span>
            </div>
          </div>
        </header>

        {/* Editorial Content */}
        <article className="mb-12">
          <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-10 border border-surface-container-highest">
            <div className="prose prose-slate max-w-none">
              {selectedEditorial.content.split('\n\n').map((para, i) => (
                <p key={i} className="font-headline text-lg md:text-xl leading-[1.9] text-on-surface mb-6 last:mb-0">
                  {i === 0 ? (
                    <>
                      <span className="drop-cap">{para.charAt(0)}</span>
                      {para.slice(1)}
                    </>
                  ) : para}
                </p>
              ))}
            </div>
          </div>
        </article>

        {/* Previous Attempts */}
        {previousAttempts.length > 0 && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
              <span className="text-sm font-bold text-green-400">Previously Attempted</span>
            </div>
            <p className="text-xs text-on-surface-variant">
              Best score: {Math.max(...previousAttempts.map(a => a.score))}/{previousAttempts[0]?.total || 10} &middot; Attempted {previousAttempts.length} time{previousAttempts.length > 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Attempt Questions CTA */}
        <div className="flex gap-4 justify-center mb-12">
          <button
            onClick={startQuiz}
            className="px-8 py-4 bg-secondary text-on-secondary rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 flex items-center gap-3"
          >
            <span className="material-symbols-outlined">quiz</span>
            {previousAttempts.length > 0 ? 'Reattempt Questions' : 'Attempt 10 MCQs'}
            <span className="text-xs opacity-80">(+50 XP)</span>
          </button>
          <button
            onClick={goBack}
            className="px-6 py-4 bg-surface-container-low text-on-surface-variant rounded-xl font-bold hover:bg-surface-container-highest transition-all"
          >
            Back to List
          </button>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------
  // QUIZ VIEW -- 10 MCQs, one at a time or scrollable
  // ---------------------------------------------------------
  if (activeView === 'quiz' && selectedEditorial) {
    const answeredCount = Object.keys(answers).length
    const allAnswered = answeredCount === questions.length

    return (
      <div className="pt-4 px-2 md:px-4 max-w-4xl mx-auto">
        {ToastEl}

        {/* Quiz Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-secondary transition-colors mb-2"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Editorial
            </button>
            <h2 className="font-headline text-xl font-bold text-on-surface">{selectedEditorial.title}</h2>
            <p className="text-xs text-on-surface-variant mt-1">{selectedEditorial.source} &middot; {selectedEditorial.category}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-secondary/10 rounded-xl">
              <span className="text-sm font-bold text-secondary">{answeredCount}/{questions.length}</span>
              <span className="text-xs text-on-surface-variant ml-1">answered</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-surface-container-low rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-secondary rounded-full transition-all duration-300"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-10">
          {questions.map((q, idx) => (
            <div key={q.id} className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container-highest">
              <p className="font-bold text-on-surface mb-5 leading-relaxed">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-secondary/10 text-secondary text-sm font-bold mr-3">
                  {idx + 1}
                </span>
                {q.question_text}
              </p>

              <div className="space-y-3">
                {[
                  { key: 'A', text: q.option_a },
                  { key: 'B', text: q.option_b },
                  { key: 'C', text: q.option_c },
                  { key: 'D', text: q.option_d },
                ].map(opt => {
                  const isSelected = answers[idx] === opt.key
                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleAnswer(idx, opt.key)}
                      disabled={submitted}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-secondary bg-secondary/10'
                          : 'border-surface-container-highest bg-surface-container-lowest hover:border-secondary/30'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        isSelected
                          ? 'bg-secondary border-secondary text-on-secondary'
                          : 'border-on-surface-variant/30 text-on-surface-variant'
                      }`}>
                        {opt.key}
                      </span>
                      <span className="text-sm text-on-surface">{opt.text}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mb-12">
          <button
            onClick={submitQuiz}
            disabled={!allAnswered || submitted}
            className={`px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all ${
              allAnswered && !submitted
                ? 'bg-secondary text-on-secondary hover:shadow-lg active:scale-95'
                : 'bg-surface-container-low text-on-surface-variant/50 cursor-not-allowed'
            }`}
          >
            <span className="material-symbols-outlined">send</span>
            Submit Answers
            {!allAnswered && <span className="text-xs">({questions.length - answeredCount} remaining)</span>}
          </button>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------
  // RESULTS VIEW -- Score + Review with correct/incorrect
  // ---------------------------------------------------------
  if (activeView === 'results' && selectedEditorial) {
    const percentage = Math.round((score / questions.length) * 100)

    return (
      <div className="pt-4 px-2 md:px-4 max-w-4xl mx-auto">
        {ToastEl}

        {/* Score Card */}
        <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-12 border border-surface-container-highest mb-10 text-center">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
            percentage >= 70 ? 'bg-green-500/15' : percentage >= 40 ? 'bg-yellow-500/15' : 'bg-red-500/15'
          }`}>
            <span className={`text-4xl font-bold ${
              percentage >= 70 ? 'text-green-400' : percentage >= 40 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {score}
            </span>
          </div>

          <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">
            {percentage >= 70 ? 'Excellent!' : percentage >= 40 ? 'Good Effort!' : 'Keep Practicing!'}
          </h2>
          <p className="text-on-surface-variant mb-4">
            You scored {score} out of {questions.length} ({percentage}%)
          </p>
          <p className="text-sm text-secondary font-bold">+{score * 5} XP earned</p>

          <div className="flex items-center gap-4 justify-center mt-6 text-sm text-on-surface-variant">
            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${sourceBadge(selectedEditorial.source)}`}>
              {selectedEditorial.source}
            </span>
            <span>{selectedEditorial.category}</span>
          </div>
        </div>

        {/* Question Review */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-[1px] bg-secondary"></span>
          <h3 className="font-label text-xs font-bold uppercase tracking-[0.05em] text-secondary">Answer Review</h3>
        </div>

        <div className="space-y-5 mb-10">
          {questions.map((q, idx) => {
            const userAnswer = answers[idx]
            const isCorrect = userAnswer === q.correct_option
            const optionMap = { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d }

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border-2 ${
                  isCorrect ? 'border-green-500/40 bg-green-500/5' : 'border-red-500/40 bg-red-500/5'
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                    isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {isCorrect ? '\u2713' : '\u2717'}
                  </div>
                  <p className="text-on-surface font-medium leading-relaxed text-sm">{q.question_text}</p>
                </div>

                <div className="ml-10 space-y-2 text-sm">
                  <div>
                    <span className="text-on-surface-variant font-bold text-xs">Your Answer: </span>
                    <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                      ({userAnswer}) {optionMap[userAnswer]}
                    </span>
                  </div>
                  {!isCorrect && (
                    <div>
                      <span className="text-on-surface-variant font-bold text-xs">Correct Answer: </span>
                      <span className="text-green-400">({q.correct_option}) {optionMap[q.correct_option]}</span>
                    </div>
                  )}
                  <div className="mt-2 p-3 bg-surface-container-low rounded-xl">
                    <span className="text-on-surface-variant font-bold text-xs block mb-1">Explanation:</span>
                    <span className="text-on-surface-variant text-xs leading-relaxed">{q.explanation}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mb-12">
          <button
            onClick={startQuiz}
            className="px-6 py-3 bg-secondary text-on-secondary rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">restart_alt</span>
            Reattempt
          </button>
          <button
            onClick={() => { setActiveView('reading'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="px-6 py-3 bg-surface-container-low text-on-surface-variant rounded-xl font-bold hover:bg-surface-container-highest transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">article</span>
            Re-read Editorial
          </button>
          <button
            onClick={() => { setActiveView('list'); setSelectedEditorial(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="px-6 py-3 bg-surface-container-low text-on-surface-variant rounded-xl font-bold hover:bg-surface-container-highest transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">list</span>
            All Editorials
          </button>
        </div>
      </div>
    )
  }

  // Fallback
  return null
}
