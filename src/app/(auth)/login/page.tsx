'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      toast.success('Welcome back!')
      router.push('/dashboard')
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-gold/4 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center">
              <span className="text-gold font-display font-bold text-lg">M</span>
            </div>
            <span className="font-display text-parchment text-2xl font-semibold">MyJournal</span>
          </Link>
          <h1 className="font-display text-3xl text-parchment font-semibold mb-2">Welcome back</h1>
          <p className="text-parchment-dim font-body text-sm">Your journal has been waiting for you.</p>
        </div>

        {/* Form card */}
        <div className="card border-gold/10 p-8">
          <form onSubmit={handleLogin} className="space-y-5">
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
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-gold hover:text-gold-light text-xs font-body transition-colors">
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : 'Sign In →'}
            </button>
          </form>

          <div className="divider" />

          <p className="text-center text-parchment-dim text-sm font-body">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-gold hover:text-gold-light transition-colors font-medium">
              Start your journey
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
