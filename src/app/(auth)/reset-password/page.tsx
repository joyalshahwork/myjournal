'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Eye, EyeOff, Loader2, Check, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const RULES = [
  { label: 'At least 8 characters', check: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter',   check: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number',             check: (p: string) => /[0-9]/.test(p) },
]

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [showCf, setShowCf]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [status, setStatus]     = useState<'verifying' | 'ready' | 'invalid'>('verifying')

  useEffect(() => {
    async function consumeTokens() {
      console.log('FULL URL:', window.location.href)
      console.log('SEARCH:', window.location.search)
      console.log('HASH:', window.location.hash)

      const supabase = createClient()

      // ── PKCE flow (default in @supabase/ssr) ──
      // Supabase sends a one-time `?code=xxx` search param after clicking the email link.
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')

      if (code) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
          // Clean the code from the URL so it can't be replayed
          window.history.replaceState(null, '', window.location.pathname)
          setStatus('ready')
          return
        } catch (error) {
          console.error('PKCE ERROR:', error)
          setStatus('invalid')
          return
        }
      }

      // ── Fallback: legacy implicit / hash-fragment flow ──
      // Older Supabase setups put tokens in the URL hash:
      // /reset-password#access_token=xxx&refresh_token=yyy&type=recovery
      const hash = window.location.hash.substring(1) // strip leading #
      const hashParams = new URLSearchParams(hash)

      const accessToken  = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      const type         = hashParams.get('type')

      if (accessToken && refreshToken && type === 'recovery') {
        try {
          const { error } = await supabase.auth.setSession({
            access_token:  accessToken,
            refresh_token: refreshToken,
          })
          if (error) throw error
          // Clear the hash so tokens aren't visible in the address bar
          window.history.replaceState(null, '', window.location.pathname)
          setStatus('ready')
        } catch (error) {
          console.error('HASH FLOW ERROR:', error)
          setStatus('invalid')
        }
      } else {
        // No valid tokens found via either method
        setStatus('invalid')
      }
    }

    consumeTokens()
  }, [])

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    if (!RULES.every(r => r.check(password))) {
      toast.error('Please meet all password requirements')
      return
    }
    if (password !== confirm) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      await supabase.auth.signOut()
      toast.success('Password updated! Please sign in.')
      router.push('/login')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Update failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FFFFFF 0%, #F8F8F8 60%, #F2F2F2 100%)' }}
    >
      {/* Background glows */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: 'rgba(201,168,76,0.07)' }}
      />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[80px] pointer-events-none"
        style={{ background: 'rgba(192,192,192,0.1)' }}
      />

      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #E2C46E, #C9A84C)',
                boxShadow: '0 2px 8px rgba(201,168,76,0.3)',
              }}
            >
              <span className="text-white font-display font-bold text-lg">M</span>
            </div>
            <span className="font-display text-dark text-2xl font-semibold">MyJournal</span>
          </Link>
          <h1 className="font-display text-3xl text-dark font-semibold mb-2">Set new password</h1>
          <p className="text-parchment-dim font-body text-sm">
            Choose something strong that you&apos;ll remember.
          </p>
        </div>

        <div className="card p-8" style={{ borderColor: 'rgba(201,168,76,0.18)' }}>

          {/* ── Verifying ── */}
          {status === 'verifying' && (
            <div className="text-center py-8 animate-fade-in">
              <Loader2 size={28} className="animate-spin text-gold mx-auto mb-4" />
              <p className="text-parchment-dim font-body text-sm">Verifying your reset link…</p>
            </div>
          )}

          {/* ── Invalid / expired link ── */}
          {status === 'invalid' && (
            <div className="text-center py-6 animate-fade-in">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{
                  background: 'rgba(192,57,43,0.08)',
                  border: '1px solid rgba(192,57,43,0.2)',
                }}
              >
                <AlertCircle size={24} className="text-journal-red" />
              </div>
              <h2 className="font-display text-xl text-dark font-semibold mb-2">
                Link expired or invalid
              </h2>
              <p className="text-parchment-dim font-body text-sm leading-relaxed mb-6">
                This reset link has already been used or has expired. Reset links are valid for 1 hour.
              </p>
              <Link href="/forgot-password" className="btn-primary text-sm inline-block">
                Request a new link →
              </Link>
            </div>
          )}

          {/* ── Ready: show form ── */}
          {status === 'ready' && (
            <form onSubmit={handleReset} className="space-y-5 animate-fade-in">

              {/* New password */}
              <div>
                <label className="block text-parchment-muted text-sm font-body mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="input-base glow-gold pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-parchment-dim hover:text-dark transition-colors"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password rules */}
                {password && (
                  <ul className="mt-3 space-y-1">
                    {RULES.map(r => (
                      <li key={r.label} className="flex items-center gap-2 text-xs font-body">
                        <Check
                          size={12}
                          className={r.check(password) ? 'text-gold' : 'text-parchment-dim'}
                        />
                        <span
                          className={r.check(password) ? 'text-parchment-muted' : 'text-parchment-dim'}
                        >
                          {r.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-parchment-muted text-sm font-body mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showCf ? 'text' : 'password'}
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="input-base glow-gold pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCf(!showCf)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-parchment-dim hover:text-dark transition-colors"
                  >
                    {showCf ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirm && password !== confirm && (
                  <p className="mt-2 text-xs font-body text-journal-red">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  loading ||
                  password !== confirm ||
                  !RULES.every(r => r.check(password))
                }
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Updating…
                  </>
                ) : (
                  'Update Password →'
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}