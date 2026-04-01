import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { signUp, signIn, signInWithGoogle } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAuth = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }
        const { error } = await signUp(email, password)
        if (error) throw error
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setError('')
    setLoading(true)
    try {
      const { error } = await signInWithGoogle()
      if (error) throw error
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Google sign-in failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side Hero - Desktop Only */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#060818] via-[#1a1f3a] to-primary-container flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Ambient decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-secondary opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-container opacity-5 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center max-w-md">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-white font-newsreader tracking-tight mb-2">
              CLAT Tribe
            </h1>
            <p className="text-lg text-secondary-container font-manrope font-medium">
              The 1-Stop CLAT GK Platform
            </p>
          </div>

          <p className="text-on-surface-variant text-base font-manrope mb-12 leading-relaxed">
            Master every topic with our curated GK capsules, smart flashcards, and legal current affairs. Join thousands of successful CLAT aspirants.
          </p>

          <div className="space-y-6">
            <div className="flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-secondary-container text-2xl">
                verified
              </span>
              <p className="text-white font-manrope text-sm">
                Join 10,000+ CLAT aspirants
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-secondary-container text-2xl">
                trending_up
              </span>
              <p className="text-white font-manrope text-sm">
                95% improvement in 60 days
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-secondary-container text-2xl">
                star_rate
              </span>
              <p className="text-white font-manrope text-sm">
                Trusted by top law colleges
              </p>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white border-opacity-10">
            <p className="text-xs text-on-surface-variant font-manrope uppercase tracking-widest">
              Crack CLAT with Confidence
            </p>
          </div>
        </div>
      </div>

      {/* Right Side Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12">
        {/* Mobile Header */}
        <div className="lg:hidden text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-black font-newsreader mb-2">
            CLAT Tribe
          </h1>
          <p className="text-sm text-on-surface-variant font-manrope">
            The 1-Stop CLAT GK Platform
          </p>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-black font-newsreader mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-sm text-on-surface-variant font-manrope">
              {isSignUp
                ? 'Join CLAT Tribe to access premium GK content'
                : 'Sign in to access your learning dashboard'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-manrope flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                {error}
              </p>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleAuth} className="space-y-5 mb-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2 font-manrope">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-lg border border-secondary border-opacity-20 bg-surface focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent font-manrope text-sm transition-all placeholder:text-on-surface-variant placeholder:text-opacity-60"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-black mb-2 font-manrope">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg border border-secondary border-opacity-20 bg-surface focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent font-manrope text-sm transition-all placeholder:text-on-surface-variant placeholder:text-opacity-60"
              />
            </div>

            {/* Confirm Password Field - Sign Up Only */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-semibold text-black mb-2 font-manrope">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-secondary border-opacity-20 bg-surface focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent font-manrope text-sm transition-all placeholder:text-on-surface-variant placeholder:text-opacity-60"
                />
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-black to-black hover:opacity-90 disabled:opacity-50 text-white font-semibold rounded-lg transition-all duration-200 font-manrope flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">
                    {isSignUp ? 'person_add' : 'login'}
                  </span>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-secondary bg-opacity-20"></div>
            <span className="text-xs text-on-surface-variant font-manrope uppercase">Or</span>
            <div className="flex-1 h-px bg-secondary bg-opacity-20"></div>
          </div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            type="button"
            className="w-full py-3 px-4 border-2 border-secondary border-opacity-20 hover:bg-secondary hover:bg-opacity-5 disabled:opacity-50 text-black font-semibold rounded-lg transition-all duration-200 font-manrope flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Toggle Sign In / Sign Up */}
          <div className="mt-8 text-center">
            <p className="text-sm text-on-surface-variant font-manrope">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError('')
                  setEmail('')
                  setPassword('')
                  setConfirmPassword('')
                }}
                className="font-semibold text-secondary hover:text-secondary hover:underline transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Create Account'}
              </button>
            </p>
          </div>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-secondary border-opacity-10 flex justify-center gap-6">
            <button className="text-xs text-on-surface-variant hover:text-black transition-colors font-manrope">
              Privacy Policy
            </button>
            <button className="text-xs text-on-surface-variant hover:text-black transition-colors font-manrope">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
