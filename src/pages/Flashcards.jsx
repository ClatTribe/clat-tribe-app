import { useState, useEffect } from 'react'
import { useProgress } from '../lib/useProgress'
import { flashcards, flashcardCategories } from '../data/flashcards'

export default function Flashcards() {
  const { saveFlashcardProgress, earnXP } = useProgress()
  const [activeCategory, setActiveCategory] = useState('all')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [mastered, setMastered] = useState(new Set())
  const [review, setReview] = useState(new Set())
  const [sessionComplete, setSessionComplete] = useState(false)
  const [totalMastered, setTotalMastered] = useState(0)
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, mastered: 0, toReview: 0 })

  const filteredCards = activeCategory === 'all'
    ? flashcards
    : flashcards.filter(card => card.cat === activeCategory)

  const currentCard = filteredCards[currentIndex]
  const totalCards = filteredCards.length

  // Load mastered cards from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('masteredCards')
    if (saved) {
      setTotalMastered(JSON.parse(saved).length)
    }
  }, [])

  const handleKnew = async () => {
    const updated = new Set(mastered).add(currentCard.q)
    setMastered(updated)

    // Save to progress and earn XP
    await saveFlashcardProgress(currentCard.q || currentIndex, 'mastered')
    await earnXP(2, 'flashcard_mastered')

    // Update session stats
    setSessionStats({
      reviewed: sessionStats.reviewed + 1,
      mastered: sessionStats.mastered + 1,
      toReview: sessionStats.toReview
    })

    // Update total mastered in localStorage
    const allMastered = JSON.parse(localStorage.getItem('masteredCards') || '[]')
    if (!allMastered.includes(currentCard.q)) {
      allMastered.push(currentCard.q)
      localStorage.setItem('masteredCards', JSON.stringify(allMastered))
      setTotalMastered(allMastered.length)
    }

    moveNext()
  }

  const handleReview = async () => {
    const updated = new Set(review).add(currentCard.q)
    setReview(updated)

    // Save to progress
    await saveFlashcardProgress(currentCard.q || currentIndex, 'review')

    // Update session stats
    setSessionStats({
      reviewed: sessionStats.reviewed + 1,
      mastered: sessionStats.mastered,
      toReview: sessionStats.toReview + 1
    })

    moveNext()
  }

  const moveNext = () => {
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    } else {
      setSessionComplete(true)
    }
  }

  const resetSession = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setMastered(new Set())
    setReview(new Set())
    setSessionComplete(false)
    setSessionStats({ reviewed: 0, mastered: 0, toReview: 0 })
  }

  const switchCategory = (catId) => {
    setActiveCategory(catId)
    setCurrentIndex(0)
    setIsFlipped(false)
    setMastered(new Set())
    setReview(new Set())
    setSessionComplete(false)
    setSessionStats({ reviewed: 0, mastered: 0, toReview: 0 })
  }

  if (!currentCard) return null

  if (sessionComplete) {
    return (
      <div className="pt-6 px-0 md:px-2 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white rounded-3xl p-12 shadow-lg border border-slate-100 text-center">
            <div className="mb-8">
              <span className="material-symbols-outlined text-6xl text-secondary block mb-4">celebration</span>
              <h2 className="font-headline text-3xl font-bold text-[#060818] mb-2">Session Complete!</h2>
              <p className="text-slate-600 text-sm">Great job reviewing these flashcards.</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 mb-8 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Cards Reviewed</span>
                <span className="font-bold text-2xl text-[#060818]">{totalCards}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 pt-4">
                <span className="text-slate-600 font-medium">Mastered This Session</span>
                <span className="font-bold text-2xl text-green-600">{mastered.size}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 pt-4">
                <span className="text-slate-600 font-medium">Review Again</span>
                <span className="font-bold text-2xl text-amber-600">{review.size}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 pt-4">
                <span className="text-slate-600 font-medium">Total Mastered (All Time)</span>
                <span className="font-bold text-2xl text-blue-600">{totalMastered + mastered.size}</span>
              </div>
            </div>

            <button
              onClick={resetSession}
              className="w-full bg-secondary text-white py-4 rounded-xl font-bold hover:bg-secondary-container hover:text-[#060818] transition-all"
            >
              Start New Session
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-6 px-0 md:px-2 min-h-screen pb-16">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">Smart Learning</p>
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-white mb-8">Flashcards</h1>

        {/* Category Chips */}
        <div className="flex flex-wrap gap-3">
          {flashcardCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => switchCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                activeCategory === cat.id
                  ? 'bg-secondary text-white shadow-lg'
                  : 'bg-surface-container-low text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Session Stats Bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-secondary/10 to-secondary-container/10 rounded-2xl p-6 border border-secondary/20">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">Reviewed</p>
              <p className="font-headline text-2xl font-bold text-[#060818]">{sessionStats.reviewed}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-green-600 mb-1">Mastered</p>
              <p className="font-headline text-2xl font-bold text-green-600">{sessionStats.mastered}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-1">Review</p>
              <p className="font-headline text-2xl font-bold text-amber-600">{sessionStats.toReview}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">All Time</p>
              <p className="font-headline text-2xl font-bold text-blue-600">{totalMastered + mastered.size}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-slate-600">
            {currentIndex + 1} of {totalCards}
          </span>
          <span className="text-xs font-bold text-secondary">
            {Math.round(((currentIndex + 1) / totalCards) * 100)}% Complete
          </span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-secondary transition-all"
            style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* 3D Flip Card */}
      <div className="max-w-2xl mx-auto mb-12">
        <div
          className="h-80 cursor-pointer perspective"
          onClick={() => setIsFlipped(!isFlipped)}
          style={{ perspective: '1000px' }}
        >
          <div
            className="relative w-full h-full transition-transform duration-500 rounded-3xl shadow-lg"
            style={{
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Front - Question */}
            <div
              className="absolute w-full h-full bg-gradient-to-br from-secondary to-secondary-container rounded-3xl p-8 flex flex-col items-center justify-center text-white text-center"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <span className="material-symbols-outlined text-4xl mb-4 opacity-50">help</span>
              <p className="font-headline text-2xl md:text-3xl leading-tight mb-4">
                {currentCard.q}
              </p>
              <p className="text-sm opacity-75">Click to reveal answer</p>
            </div>

            {/* Back - Answer */}
            <div
              className="absolute w-full h-full bg-gradient-to-br from-secondary-container to-secondary-container/80 rounded-3xl p-8 flex flex-col items-center justify-center text-slate-800 text-center"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <span className="material-symbols-outlined text-4xl mb-4 opacity-50 text-green-600">check_circle</span>
              <p className="font-headline text-lg md:text-xl leading-relaxed">
                {currentCard.a}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4 mb-16">
        <button
          onClick={handleReview}
          className="bg-amber-50 border-2 border-amber-200 text-amber-700 py-4 rounded-2xl font-bold hover:bg-amber-100 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">refresh</span>
          Review Again
        </button>
        <button
          onClick={handleKnew}
          className="bg-green-50 border-2 border-green-200 text-green-700 py-4 rounded-2xl font-bold hover:bg-green-100 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">check</span>
          I Knew This
        </button>
      </div>
    </div>
  )
}
