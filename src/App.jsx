import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Article from './pages/Article'
import Highlights from './pages/Highlights'
import Flashcards from './pages/Flashcards'
import Analytics from './pages/Analytics'
import MockTest from './pages/MockTest'
import WeeklyQuiz from './pages/WeeklyQuiz'
import Flowcharts from './pages/Flowcharts'
import Monthly from './pages/Monthly'
import StaticGk from './pages/StaticGk'
import LegalCA from './pages/LegalCA'
import PersonsInNews from './pages/PersonsInNews'
import ActsAndBills from './pages/ActsAndBills'
import Indices from './pages/Indices'
import PYQBank from './pages/PYQBank'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/article" element={<Article />} />
          <Route path="/highlights" element={<Highlights />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/mocktest" element={<MockTest />} />
          <Route path="/weeklyquiz" element={<WeeklyQuiz />} />
          <Route path="/flowcharts" element={<Flowcharts />} />
          <Route path="/monthly" element={<Monthly />} />
          <Route path="/staticgk" element={<StaticGk />} />
          <Route path="/legalca" element={<LegalCA />} />
          <Route path="/persons" element={<PersonsInNews />} />
          <Route path="/acts" element={<ActsAndBills />} />
          <Route path="/indices" element={<Indices />} />
          <Route path="/pyq" element={<PYQBank />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
