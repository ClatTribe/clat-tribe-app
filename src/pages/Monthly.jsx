import { useState } from 'react'
import { moData } from '../data/monthlyMcqs'

export default function Monthly() {
  const [answers, setAnswers] = useState({})

  const handleAnswer = (qIdx, optIdx) => {
    setAnswers({ ...answers, [qIdx]: optIdx })
  }

  const calculateScore = () => {
    let correct = 0
    moData.questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) correct++
    })
    return correct
  }

  const score = calculateScore()
  const allAnswered = Object.keys(answers).length === moData.questions.length
  const percentage = allAnswered ? Math.round((score / moData.questions.length) * 100) : 0

  return (
    <div className="pt-6 px-0 md:px-2 pb-16">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">Monthly Revision</p>
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-[#060818] mb-4">
          {moData.month} &mdash; Monthly Revision
        </h1>
        <p className="text-slate-600 text-lg mb-8">
          Solve all {moData.questions.length} questions to complete your monthly revision. Track your progress below.
        </p>

        {/* Progress Bar */}
        {allAnswered && (
          <div className="bg-gradient-to-r from-secondary/10 to-secondary-container/10 rounded-2xl p-6 border border-secondary/20">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-slate-800">Overall Score</span>
              <span className="text-3xl font-bold text-secondary">{score}/{moData.questions.length}</span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-secondary" style={{ width: `${percentage}%` }}></div>
            </div>
            <p className="mt-3 text-sm text-slate-600 text-center font-medium">{percentage}% Accuracy</p>
          </div>
        )}
      </div>

      {/* MCQ Cards Grid */}
      <div className="max-w-5xl mx-auto space-y-8">
        {moData.questions.map((q, qIdx) => {
          const isAnswered = answers[qIdx] !== undefined
          const isCorrect = isAnswered && answers[qIdx] === q.correct

          return (
            <div key={q.id} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              {/* Question Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-secondary px-3 py-1 rounded-full bg-secondary/10 inline-block mb-3">
                    {q.category}
                  </span>
                  <h3 className="font-headline text-lg font-bold text-slate-800">
                    Q{qIdx + 1}. {q.q}
                  </h3>
                </div>
                {isAnswered && (
                  <span className={`material-symbols-outlined flex-shrink-0 ${
                    isCorrect ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isCorrect ? 'check_circle' : 'cancel'}
                  </span>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {q.opts.map((opt, optIdx) => {
                  const selected = answers[qIdx] === optIdx
                  const isCorrectOption = optIdx === q.correct

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleAnswer(qIdx, optIdx)}
                      className={`w-full p-4 rounded-xl text-left transition-all border-2 flex items-start gap-4 ${
                        !isAnswered
                          ? 'border-slate-200 bg-white hover:border-secondary/30 hover:bg-secondary/5 cursor-pointer'
                          : selected
                            ? isCorrect
                              ? 'bg-green-50 border-green-500'
                              : 'bg-red-50 border-red-500'
                            : isCorrectOption
                              ? 'bg-green-50 border-green-200'
                              : 'border-slate-200 bg-white'
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
              {isAnswered && (
                <div className={`p-4 rounded-xl ${
                  isCorrect
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-amber-50 border border-amber-200'
                }`}>
                  <p className={`text-sm ${isCorrect ? 'text-green-800' : 'text-amber-800'}`}>
                    <strong className="block mb-1">{isCorrect ? 'Correct!' : 'Explanation:'}</strong>
                    {q.explanation}
import { moData } from '../data/monthlyMcqs'

export default function Monthly() {
  const [answers, setAnswers] = useState({})

  const handleAnswer = (qIdx, optIdx) => {
    setAnswers({ ...answers, [qIdx]: optIdx })
  }

  const calculateScore = () => {
    let correct = 0
    moData.questions.forEach((q, idx) => {
      if (answers[idx] === q.correct) correct++
    })
    return correct
  }

  const score = calculateScore()
  const allAnswered = Object.keys(answers).length === moData.questions.length
  const percentage = allAnswered ? Math.round((score / moData.questions.length) * 100) : 0

  return (
    <div className="pt-6 px-0 md:px-2 pb-16">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">Monthly Revision</p>
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-[#060818] mb-4">
          {moData.month} &mdash; Monthly Revision
        </h1>
        <p className="text-slate-600 text-lg mb-8">
          Solve all {moData.questions.length} questions to complete your monthly revision. Track your progress below.
        </p>

        {/* Progress Bar */}
        {allAnswered && (
          <div className="bg-gradient-to-r from-secondary/10 to-secondary-container/10 rounded-2xl p-6 border border-secondary/20">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-slate-800">Overall Score</span>
              <span className="text-3xl font-bold text-secondary">{score}/{moData.questions.length}</span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-secondary" style={{ width: `${percentage}%` }}></div>
            </div>
            <p className="mt-3 text-sm text-slate-600 text-center font-medium">{percentage}% Accuracy</p>
          </div>
        )}
      </div>

      {/* MCQ Cards Grid */}
      <div className="max-w-5xl mx-auto space-y-8">
        {moData.questions.map((q, qIdx) => {
          const isAnswered = answers[qIdx] !== undefined
          const isCorrect = isAnswered && answers[qIdx] === q.correct

          return (
            <div key={q.id} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              {/* Question Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-secondary px-3 py-1 rounded-full bg-secondary/10 inline-block mb-3">
                    {q.category}
                  </span>
                  <h3 className="font-headline text-lg font-bold text-slate-800">
                    Q{qIdx + 1}. {q.q}
                  </h3>
                </div>
                {isAnswered && (
                  <span className={`material-symbols-outlined flex-shrink-0 ${
                    isCorrect ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isCorrect ? 'check_circle' : 'cancel'}
                  </span>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {q.opts.map((opt, optIdx) => {
                  const selected = answers[qIdx] === optIdx
                  const isCorrectOption = optIdx === q.correct

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleAnswer(qIdx, optIdx)}
                      className={`w-full p-4 rounded-xl text-left transition-all border-2 flex items-start gap-4 ${
                        !isAnswered
                          ? 'border-slate-200 bg-white hover:border-secondary/30 hover:bg-secondary/5 cursor-pointer'
                          : selected
                            ? isCorrect
                              ? 'bg-green-50 border-green-500'
                              : 'bg-red-50 border-red-500'
                            : isCorrectOption
                              ? 'bg-green-50 border-green-200'
                              : 'border-slate-200 bg-white'
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
              {isAnswered && (
                <div className={`p-4 rounded-xl ${
                  isCorrect
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-amber-50 border border-amber-200'
                }`}>
                  <p className={`text-sm ${isCorrect ? 'text-green-800' : 'text-amber-800'}`}>
                    <strong className="block mb-1">{isCorrect ? 'Correct!' : 'Explanation:'}</strong>
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Final Score Card */}
      {allAnswered && (
        <div className="max-w-5xl mx-auto mt-16 bg-gradient-to-br from-secondary/20 to-secondary-container/20 rounded-3xl p-8 md:p-12 border-2 border-secondary/30">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-secondary block mb-4">celebration</span>
            <h3 className="font-headline text-3xl font-bold text-[#060818] mb-2">March Revision Complete!</h3>
            <p className="text-slate-600 mb-8">You've completed your monthly MCQ revision.</p>
            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
              <div className="bg-white rounded-xl p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-1">Questions</p>
                <p className="font-headline text-2xl font-bold text-[#060818]">{moData.questions.length}</p>
              </div>
              <div className="bg-white rounded-xl p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-1">Correct</p>
                <p className="font-headline text-2xl font-bold text-green-600">{score}</p>
              </div>
              <div className="bg-white rounded-xl p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">Score</p>
                <p className="font-headline text-2xl font-bold text-secondary">{percentage}%</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
