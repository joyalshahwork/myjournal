'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

const QUOTES = [
  'Write. Reflect. Grow.',
  'Your story, every day.',
  'The journal that grows with you.',
]

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-ink flex flex-col relative overflow-hidden">

      {/* ── Background gradients ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gold/4 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gold/2 rounded-full blur-[140px]" />
      </div>

      {/* ── Nav ── */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gold/20 border border-gold/30 flex items-center justify-center">
            <span className="text-gold text-sm font-display font-bold">M</span>
          </div>
          <span className="font-display text-parchment text-xl font-semibold tracking-wide">MyJournal</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-parchment-muted hover:text-parchment font-body text-sm transition-colors">
            Signs in
          </Link>
          <Link href="/signup" className="btn-primary text-sm py-2 px-5">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="inline-flex items-center gap-2 border border-gold/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
          <span className="text-gold text-xs font-body font-medium tracking-widest uppercase">Stage 1 — MVP</span>
        </div>

        <h1 className="font-display text-6xl md:text-8xl font-bold leading-none mb-6 animate-slide-up">
          <span className="text-parchment">Your </span>
          <em className="text-gold-gradient not-italic">story</em>
          <br />
          <span className="text-parchment">deserves </span>
          <span className="text-parchment-muted">pages.</span>
        </h1>

        <p className="text-parchment-muted font-body text-lg md:text-xl max-w-2xl leading-relaxed mb-10 animate-slide-up delay-100">
          MyJournal is the only app for ambitious people. Write daily. Track your money. 
          Stay consistent. Let AI remind you of who you are becoming.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up delay-200">
          <Link href="/signup" className="btn-primary text-base px-8 py-3.5 animate-pulse-gold">
            Start Journaling Today →
          </Link>
          <Link href="/login" className="btn-ghost text-base">
            I already have an account
          </Link>
        </div>

        {/* Stat bar */}
        <div className="mt-20 flex items-center gap-12 animate-fade-in delay-400">
          {[
            { num: '4', label: 'Core Features' },
            { num: '∞', label: 'Entries Forever' },
            { num: '100%', label: 'Free — Always' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl text-gold font-bold">{s.num}</p>
              <p className="text-parchment-dim text-sm font-body mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features grid ── */}
      <section className="relative z-10 max-w-6xl mx-auto w-full px-6 pb-24">
        <div className="divider" />
        <h2 className="font-display text-3xl text-center text-parchment mb-12">
          Everything you need. <em className="text-gold">Nothing you don't.</em>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="card hover:border-gold/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-gold-md group"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-display text-parchment text-lg font-semibold mb-2 group-hover:text-gold transition-colors">
                {f.title}
              </h3>
              <p className="text-parchment-dim text-sm font-body leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── The Promise ── */}
      <section className="relative z-10 max-w-3xl mx-auto text-center px-6 pb-24">
        <div className="card border-gold/20 p-10">
          <p className="font-display text-xl text-parchment-muted italic leading-relaxed mb-4">
            &ldquo;This reminds me of what you wrote about courage in June...&rdquo;
          </p>
          <p className="text-parchment-dim text-sm font-body">
            — Your AI memory companion, coming in Phase 2
          </p>
          <div className="divider" />
          <p className="text-parchment-dim text-xs font-body">
            Built with ❤️ by <span className="text-gold">Joyal Chirag Shah</span> &amp; <span className="text-gold">Devarsh Dharmesh Shah</span>
            <br />
            Questions? <a href="mailto:joyal.journal@gmail.com" className="text-gold hover:text-gold-light underline underline-offset-2">joyal.journal@gmail.com</a>
          </p>
        </div>
      </section>
    </main>
  )
}

const FEATURES = [
  {
    icon: '📓',
    title: 'Daily Journaling',
    desc: 'Guided prompts for gratitude, memory, and reflection. Miss a day — your streak resets. Stay accountable.',
  },
  {
    icon: '💸',
    title: 'Expense Tracker',
    desc: 'Log every rupee. Beautiful pie charts show exactly where your money went each month.',
  },
  {
    icon: '📊',
    title: 'Monthly Budget',
    desc: 'Plan rent, bills, SIPs, and investments. Know your numbers before the month starts.',
  },
  {
    icon: '🔥',
    title: 'Streak System',
    desc: 'Your consistency is your identity. Build a writing habit that makes you proud.',
  },
]
