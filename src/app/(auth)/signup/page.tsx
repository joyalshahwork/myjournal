'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Eye, EyeOff, Loader2, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const RULES = [
  { label: 'At least 8 characters', check: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter',   check: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number',             check: (p: string) => /[0-9]/.test(p) },
]

export default function SignupPage() {
  const router = useRouter()
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (!RULES.every(r => r.check(password))) {
      toast.error('Please meet all password requirements')
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      })
      if (error) throw error
      if (data.user) {
        // Create profile row
        await supabase.from('profiles').insert({ id: data.user.id, name, email })
        // Create streak row
        await supabase.from('streaks').insert({ user_id: data.user.id, current_streak: 0, longest_streak: 0 })
      }
      toast.success('Account created! Welcome to MyJournal 🎉')
      router.push('/dashboard')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Signup failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #FFFFFF 0%, #F8F8F8 60%, #F2F2F2 100%)' }}>
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <span className="text-white font-display font-bold text-lg">M</span>
            </div>
            <span className="font-display text-parchment text-2xl font-semibold">MyJournal</span>
          </Link>
          <h1 className="font-display text-3xl text-parchment font-semibold mb-2">Begin your journey</h1>
          <p className="text-parchment-dim font-body text-sm">Free forever. No credit card required.</p>
        </div>

        <div className="card border-gold/10 p-8">
          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-parchment-muted text-sm font-body mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
                required
                className="input-base glow-gold"
              />
            </div>

            <div>
              <label className="block text-parchment-muted text-sm font-body mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-base glow-gold"
              />
            </div>

            <div>
              <label className="block text-parchment-muted text-sm font-body mb-2">Password</label>
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-parchment-dim hover:text-parchment transition-colors"
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
                      <span className={r.check(password) ? 'text-parchment-muted' : 'text-parchment-dim'}>
                        {r.label}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p className="text-parchment-dim text-xs font-body">
              By signing up, you commit to writing every day. Miss a day — your streak resets. That&apos;s the deal. 🔥
            </p>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account…</> : 'Create Account →'}
            </button>
          </form>

          <div className="divider" />

          <p className="text-center text-parchment-dim text-sm font-body">
            Already have an account?{' '}
            <Link href="/login" className="text-gold hover:text-gold-light transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
