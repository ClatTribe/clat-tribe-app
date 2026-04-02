import { useAuth } from './AuthContext'
import * as progress from './progress'

export function useProgress() {
  const { user, profile, refreshProfile, earnXP, updateStreak } = useAuth()

  const saveFlashcardProgress = async (flashcardId, status) => {
    if (!user) return null
    const result = await progress.updateFlashcardStatus(user.id, flashcardId, status)
    return result
  }

  const saveQuizResult = async (quizType, score, total, timeTaken, answers) => {
    if (!user) return null
    const result = await progress.saveQuizAttempt(user.id, quizType, score, total, timeTaken, answers)

    // Award XP based on quiz performance
    if (result) {
      const xpReward = Math.round((score / total) * 50) // Up to 50 XP per quiz
      if (xpReward > 0) {
        await earnXP(xpReward, `quiz_${quizType}`)
      }
    }

    return result
  }

  const getQuizHistoryForType = async (quizType) => {
    if (!user) return []
    return await progress.getQuizHistory(user.id, quizType)
  }

  const getFlashcardProgressForUser = async () => {
    if (!user) return []
    return await progress.getFlashcardProgress(user.id)
  }

  const logUserActivity = async (type, xpEarned, metadata) => {
    if (!user) return null
    return await progress.logActivity(user.id, type, xpEarned, metadata)
  }

  const getRecentUserActivity = async (limit = 20) => {
    if (!user) return []
    return await progress.getRecentActivity(user.id, limit)
  }

  return {
    // State
    user,
    profile,

    // Profile management
    refreshProfile,
    earnXP,
    updateStreak,

    // Flashcard operations
    saveFlashcardProgress,
    getFlashcardProgressForUser,

    // Quiz operations
    saveQuizResult,
    getQuizHistoryForType,

    // Activity logging
    logUserActivity,
    getRecentUserActivity
  }
}
