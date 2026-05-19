'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Loader2, ArrowLeft, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setSubmitted(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
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
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: 'rgba(201,168,76,0.07)' }} />
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full blur-[80px] pointer-events-none"
        style={{ background: 'rgba(192,192,192,0.1)' }} />

      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #E2C46E, #C9A84C)', boxShadow: '0 2px 8px rgba(201,168,76,0.3)' }}
            >
              <span className="text-white font-display font-bold text-lg">M</span>
            </div>
            <span className="font-display text-dark text-2xl font-semibold">MyJournal</span>
          </Link>
          <h1 className="font-display text-3xl text-dark font-semibold mb-2">Forgot password?</h1>
          <p className="text-parchment-dim font-body text-sm">
            No worries — we&apos;ll send you a reset link.
          </p>
        </div>

        <div className="card p-8" style={{ borderColor: 'rgba(201,168,76,0.18)' }}>
          {submitted ? (
            /* ── Success state ── */
            <div className="text-center py-4 animate-fade-in">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}
              >
                <Mail size={24} className="text-gold" />
              </div>
              <h2 className="font-display text-xl text-dark font-semibold mb-2">Check your email</h2>
              <p className="text-parchment-dim font-body text-sm leading-relaxed mb-6">
                We sent a reset link to <span className="text-dark font-medium">{email}</span>.
                It expires in 1 hour.
              </p>
              <p className="text-parchment-dim text-xs font-body mb-6">
                Didn&apos;t receive it? Check your spam folder or{' '}
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-gold hover:text-gold-light transition-colors font-medium underline underline-offset-2"
                >
                  try again
                </button>
                .
              </p>
              <Link href="/login" className="btn-ghost text-sm flex items-center justify-center gap-2">
                <ArrowLeft size={15} /> Back to Sign In
              </Link>
            </div>
          ) : (
            /* ── Form ── */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-parchment-muted text-sm font-body mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="input-base glow-gold"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Sending…</>
                  : 'Send Reset Link →'}
              </button>

              <div className="divider" />

              <Link
                href="/login"
                className="flex items-center justify-center gap-2 text-parchment-dim hover:text-dark text-sm font-body transition-colors"
              >
                <ArrowLeft size={15} /> Back to Sign In
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
