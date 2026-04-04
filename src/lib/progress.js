import { supabase } from './supabase'

// Profile & XP

export async function getProfile(userId) {
  try {
    if (!userId) return null
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }
    return data
  } catch (err) {
    console.error('Exception in getProfile:', err)
    return null
  }
}

export async function addXP(userId, amount, activityType) {
  try {
    if (!userId || !amount || !activityType) return null

    const profile = await getProfile(userId)
    if (!profile) return null

    const newXP = (profile.xp || 0) + amount

    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({ xp: newXP })
      .eq('id', userId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating XP:', updateError)
      return null
    }

    await logActivity(userId, activityType, amount, { source: 'xp_gain' })

    return updatedProfile
  } catch (err) {
    console.error('Exception in addXP:', err)
    return null
  }
}

export async function updateStreak(userId) {
  try {
    if (!userId) return null

    const profile = await getProfile(userId)
    if (!profile) return null

    const today = new Date().toISOString().split('T')[0]
    const lastDate = profile.streak_last_date
      ? new Date(profile.streak_last_date).toISOString().split('T')[0]
      : null

    let newStreak = profile.streak || 0
    let streakLastDate = today

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    if (lastDate === yesterdayStr) {
      newStreak += 1
    } else if (lastDate !== today) {
      newStreak = 1
    }

    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update({
        streak: newStreak,
        streak_last_date: streakLastDate
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating streak:', error)
      return null
    }

    return updatedProfile
  } catch (err) {
    console.error('Exception in updateStreak:', err)
    return null
  }
}

// Flashcard Progress

export async function getFlashcardProgress(userId) {
  try {
    if (!userId) return []
    const { data, error } = await supabase
      .from('user_flashcard_progress')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching flashcard progress:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Exception in getFlashcardProgress:', err)
    return []
  }
}

export async function updateFlashcardStatus(userId, flashcardId, status) {
  try {
    if (!userId || !flashcardId || !status) return null

    const { data: existing } = await supabase
      .from('user_flashcard_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('flashcard_id', flashcardId)
      .single()

    const timesSeenNow = (existing?.times_seen || 0) + 1
    const lastReviewedNow = new Date().toISOString()

    const { data, error } = await supabase
      .from('user_flashcard_progress')
      .upsert({
        user_id: userId,
        flashcard_id: flashcardId,
        status,
        times_seen: timesSeenNow,
        last_reviewed: lastReviewedNow
      }, {
        onConflict: 'user_id,flashcard_id'
      })
      .select()
      .single()

    if (error) {
      console.error('Error updating flashcard status:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Exception in updateFlashcardStatus:', err)
    return null
  }
}

// Quiz Attempts

export async function saveQuizAttempt(userId, quizType, score, total, timeTaken, answers) {
  try {
    if (!userId || !quizType || score === undefined || !total) return null

    const { data, error } = await supabase
      .from('user_quiz_attempts')
      .insert({
        user_id: userId,
        quiz_type: quizType,
        score,
        total,
        time_taken: timeTaken,
        answers: answers || null,
        attempted_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving quiz attempt:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Exception in saveQuizAttempt:', err)
    return null
  }
}

export async function getQuizHistory(userId, quizType) {
  try {
    if (!userId) return []

    let query = supabase
      .from('user_quiz_attempts')
      .select('*')
      .eq('user_id', userId)

    if (quizType) {
      query = query.eq('quiz_type', quizType)
    }

    const { data, error } = await query.order('attempted_at', { ascending: false })

    if (error) {
      console.error('Error fetching quiz history:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Exception in getQuizHistory:', err)
    return []
  }
}

// Activity Log

export async function logActivity(userId, type, xpEarned, metadata) {
  try {
    if (!userId || !type) return null

    const { data, error } = await supabase
      .from('user_activity')
      .insert({
        user_id: userId,
        type,
        xp_earned: xpEarned || 0,
        metadata: metadata || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error logging activity:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('Exception in logActivity:', err)
    return null
  }
}

// Editorials

export async function getEditorialsByDate(date) {
  try {
    const { data, error } = await supabase
      .from('editorials')
      .select('*')
      .eq('date', date)
      .order('source', { ascending: true })

    if (error) {
      console.error('Error fetching editorials:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Exception in getEditorialsByDate:', err)
    return []
  }
}

export async function getEditorialQuestions(editorialId) {
  try {
    if (!editorialId) return []
    const { data, error } = await supabase
      .from('editorial_questions')
      .select('*')
      .eq('editorial_id', editorialId)
      .order('question_number', { ascending: true })

    if (error) {
      console.error('Error fetching editorial questions:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Exception in getEditorialQuestions:', err)
    return []
  }
}

export async function saveEditorialAttempt(userId, editorialId, score, total, answers, timeTaken) {
  try {
    if (!userId || !editorialId) return null
    const { data, error } = await supabase
      .from('user_editorial_attempts')
      .insert({
        user_id: userId,
        editorial_id: editorialId,
        score,
        total,
        answers: answers || null,
        time_taken: timeTaken || 0,
        attempted_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving editorial attempt:', error)
      return null
    }
    return data
  } catch (err) {
    console.error('Exception in saveEditorialAttempt:', err)
    return null
  }
}

export async function getUserEditorialAttempts(userId, editorialId) {
  try {
    if (!userId) return []
    let query = supabase
      .from('user_editorial_attempts')
      .select('*')
      .eq('user_id', userId)

    if (editorialId) {
      query = query.eq('editorial_id', editorialId)
    }

    const { data, error } = await query.order('attempted_at', { ascending: false })

    if (error) {
      console.error('Error fetching editorial attempts:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Exception in getUserEditorialAttempts:', err)
    return []
  }
}

export async function getAvailableEditorialDates(limit = 30) {
  try {
    const { data, error } = await supabase
      .from('editorials')
      .select('date')
      .order('date', { ascending: false })
      .limit(limit * 4) // 4 editorials per day

    if (error) {
      console.error('Error fetching editorial dates:', error)
      return []
    }
    // Deduplicate dates
    const uniqueDates = [...new Set((data || []).map(d => d.date))]
    return uniqueDates.slice(0, limit)
  } catch (err) {
    console.error('Exception in getAvailableEditorialDates:', err)
    return []
  }
}

// Daily News

export async function getDailyNewsByDate(date) {
  try {
    const { data, error } = await supabase
      .from('daily_news')
      .select('*')
      .eq('news_date', date)
      .eq('is_active', true)
      .order('category', { ascending: true })

    if (error) {
      console.error('Error fetching daily news:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Exception in getDailyNewsByDate:', err)
    return []
  }
}

export async function getLatestNewsDate() {
  try {
    const { data, error } = await supabase
      .from('daily_news')
      .select('news_date')
      .eq('is_active', true)
      .order('news_date', { ascending: false })
      .limit(1)

    if (error) {
      console.error('Error fetching latest news date:', error)
      return null
    }
    return data?.[0]?.news_date || null
  } catch (err) {
    console.error('Exception in getLatestNewsDate:', err)
    return null
  }
}

// Daily Mock Tests

export async function getDailyMockTest(date) {
  try {
    const { data, error } = await supabase
      .from('daily_mock_tests')
      .select('*')
      .eq('test_date', date)
      .eq('is_active', true)
      .order('passage_category', { ascending: true })

    if (error) {
      console.error('Error fetching daily mock test:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Exception in getDailyMockTest:', err)
    return []
  }
}

export async function getLatestMockTestDate() {
  try {
    const { data, error } = await supabase
      .from('daily_mock_tests')
      .select('test_date')
      .eq('is_active', true)
      .order('test_date', { ascending: false })
      .limit(1)

    if (error) {
      console.error('Error fetching latest mock test date:', error)
      return null
    }
    return data?.[0]?.test_date || null
  } catch (err) {
    console.error('Exception in getLatestMockTestDate:', err)
    return null
  }
}

export async function getRecentActivity(userId, limit = 20) {
  try {
    if (!userId) return []

    const { data, error } = await supabase
      .from('user_activity')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching recent activity:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Exception in getRecentActivity:', err)
    return []
  }
}
