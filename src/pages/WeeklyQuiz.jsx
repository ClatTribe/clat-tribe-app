import { useState } from 'react'
import { useProgress } from '../lib/useProgress'
import { weeklyQuizzes } from '../data/weeklyQuiz'

export default function WeeklyQuiz() {
  const { earnXP, saveQuizResult } = useProgress()
  const [activeQuizId, setActiveQuizId] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)
  const [completedQuizzes, setCompletedQuizzes] = useState(new Set())

  // Load completed quizzes from localStorage on mount
  useState(() => {
    const saved = localStorage.getItem('completedQuizzes')
    if (saved) {
      setCompletedQuizzes(new Set(JSON.parse(saved)))
    }
  }, [])

  const activeQuiz = weeklyQuizzes.find(q => q.id === activeQuizId)
  const question = activeQuiz?.questions[currentQuestion]
  const totalQuestions = activeQuiz?.questions.length || 0
  const answered = Object.keys(answers).length

  const handleAnswer = (optIndex) => {
    setAnswers({ ...answers, [currentQuestion]: optIndex })
    setShowExplanation(true)
  }

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
    } else {
      setQuizComplete(true)
    }
  }

  const calculateScore = () => {
    let correct = 0
    activeQuiz?.questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) correct++
    })
    return correct
  }

  const handleQuizComplete = async () => {
    const score = calculateScore()
    const xp = score * 5

    // Save to progress
    await saveQuizResult('weekly', score, totalQuestions, 0, answers)
    await earnXP(xp, 'weekly_quiz')

    // Mark quiz as completed
    const updated = new Set(completedQuizzes)
    updated.add(activeQuizId)
    setCompletedQuizzes(updated)
    localStorage.setItem('completedQuizzes', JSON.stringify(Array.from(updated)))
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowExplanation(false)
    setQuizComplete(false)
  }

  const backToSelection = () => {
    setActiveQuizId(null)
    resetQuiz()
  }

  // QUIZ SELECTION VIEW
  if (!activeQuizId) {
    return (
      <div className="pt-6 px-0 md:px-2 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">Smart Learning</p>
            <h1 className="font-headline text-5xl md:text-6xl font-bold text-white">Weekly Quizzes</h1>
            <p className="text-slate-600 mt-4">Test your knowledge across different topics. Complete all 6 quizzes to master CLAT concepts.</p>
          </div>

          {/* Quiz Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {weeklyQuizzes.map((quiz) => {
              const isCompleted = completedQuizzes.has(quiz.id)
              return (
                <button
                  key={quiz.id}
                  onClick={() => setActiveQuizId(quiz.id)}
                  className="text-left bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-lg hover:border-secondary/30 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">{quiz.week}</p>
                      <h3 className="font-headline text-xl font-bold text-[#060818] group-hover:text-secondary transition-colors line-clamp-2">
                        {quiz.title}
                      </h3>
                    </div>
                    {isCompleted && (
                      <span className="material-symbols-outlined text-green-600 text-2xl flex-shrink-0">
                        check_circle
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 font-medium">
                      {quiz.questions.length} Questions
                    </span>
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-secondary transition-colors">
                      arrow_forward
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // QUIZ COMPLETE VIEW
  if (quizComplete) {
    const score = calculateScore()
    const xp = score * 5
    const percentage = Math.round((score / totalQuestions) * 100)

    return (
      <div className="pt-6 px-0 md:px-2 min-h-screen flex items-center justify-center pb-16">
        <div className="max-w-lg w-full mx-auto">
          <div className="bg-white rounded-3xl p-12 shadow-lg border border-slate-100">
            {/* Score Display */}
            <div className="text-center mb-10">
              <div className="mb-6">
                <span className="material-symbols-outlined text-6xl text-secondary block mb-4">
                  {percentage >= 70 ? 'star' : 'emoji_events'}
                </span>
              </div>
              <h2 className="font-headline text-3xl font-bold text-[#060818] mb-2">Quiz Complete!</h2>
              <p className="text-slate-600 mb-6">Great effort on this quiz.</p>
            </div>

            {/* Score Card */}
            <div className="bg-gradient-to-br from-secondary/10 to-secondary-container/10 rounded-2xl p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-1">Your Score</p>
                  <p className="font-headline text-4xl font-bold text-[#060818]">
                    {score}/{totalQuestions}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">Accuracy</p>
                  <p className="font-headline text-4xl font-bold text-secondary">{percentage}%</p>
                </div>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-secondary" style={{ width: `${percentage}%` }}></div>
              </div>
            </div>

            {/* XP Earned */}
            <div className="bg-secondary/10 border border-secondary/20 rounded-2xl p-6 text-center mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">XP Earned</p>
              <p className="font-headline text-5xl font-bold text-secondary">+{xp}</p>
            </div>

            {/* Results Breakdown */}
            <div className="space-y-2 mb-8">
              {activeQuiz?.questions.map((q, idx) => (
                <div key={idx} className={`p-3 rounded-lg flex items-center gap-3 ${
                  answers[idx] === q.correct
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <span className={`material-symbols-outlined text-sm ${
                    answers[idx] === q.correct ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {answers[idx] === q.correct ? 'check_circle' : 'cancel'}
                  </span>
                  <span className={`text-xs font-medium ${
                    answers[idx] === q.correct ? 'text-green-700' : 'text-red-700'
                  }`}>
                    Question {idx + 1}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  handleQuizComplete()
                  backToSelection()
                }}
                className="w-full bg-secondary text-white py-4 rounded-xl font-bold hover:bg-secondary-container hover:text-[#060818] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Back to Quizzes
              </button>
              <button
                onClick={() => {
                  resetQuiz()
                }}
                className="w-full bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ACTIVE QUIZ VIEW
  const isAnswered = answers[currentQuestion] !== undefined
  const isCorrect = isAnswered && answers[currentQuestion] === question?.correct

  return (
    <div className="pt-6 px-0 md:px-2 pb-16">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <button
          onClick={backToSelection}
          className="mb-6 flex items-center gap-2 text-secondary hover:text-secondary-container font-semibold transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">{activeQuiz?.week}</p>
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-white">{activeQuiz?.title}</h1>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-1">Progress</p>
            <p className="font-headline text-3xl font-bold text-secondary">Q {currentQuestion + 1}/{totalQuestions}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary transition-all"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-500 font-medium">Question {currentQuestion + 1} of {totalQuestions}</p>
        </div>
      </div>

      {/* Question Card */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 mb-8">
          {/* Question */}
          <h2 className="font-headline text-2xl md:text-3xl font-bold text-[#060818] mb-8 leading-tight">
            {question?.q}
          </h2>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {question?.opts.map((opt, idx) => {
              const selected = answers[currentQuestion] === idx
              const isCorrectOption = idx === question.correct

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl text-left transition-all border-2 flex items-start gap-4 ${
                    !isAnswered
                      ? 'border-slate-200 bg-white hover:border-secondary/30 hover:bg-secondary/5 cursor-pointer'
                      : selected
                        ? isCorrect
                          ? 'bg-green-50 border-green-500 ring-2 ring-green-300'
                          : 'bg-red-50 border-red-500'
                        : isCorrectOption
                          ? 'bg-green-50 border-green-200'
                          : 'border-slate-200 bg-white opacity-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    selected
                      ? 'border-slate-600 bg-slate-600'
                      : 'border-slate-300'
                  }`}>
                    {selected && <span className="material-symbols-outlined text-white text-sm">check</span>}
                  </div>
                  <span className="font-medium text-slate-800 flex-1">{opt}</span>
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={`p-6 rounded-2xl mb-8 ${
              isCorrect
                ? 'bg-green-50 border border-green-200'
                : 'bg-blue-50 border border-blue-200'
            }`}>
              <div className="flex gap-4">
                <span className={`material-symbols-outlined text-2xl flex-shrink-0 mt-0.5 ${
                  isCorrect ? 'text-green-600' : 'text-blue-600'
                }`}>
                  {isCorrect ? 'check_circle' : 'info'}
                </span>
                <div>
                  <p className={`font-bold mb-2 ${isCorrect ? 'text-green-800' : 'text-blue-800'}`}>
                    {isCorrect ? 'Correct!' : 'Explanation'}
                  </p>
                  <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-blue-700'}`}>
                    {question?.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          {isAnswered && (
            <button
              onClick={handleNext}
              className="w-full bg-secondary text-white py-4 rounded-xl font-bold hover:bg-secondary-container hover:text-[#060818] transition-all flex items-center justify-center gap-2"
            >
              {currentQuestion === totalQuestions - 1 ? 'See Results' : 'Next Question'}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
