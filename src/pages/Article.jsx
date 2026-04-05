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
