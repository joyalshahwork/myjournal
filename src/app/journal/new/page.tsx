'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { ArrowLeft, Loader2, Save, ChevronRight, ChevronLeft } from 'lucide-react'
import { MOOD_MAP } from '@/utils/helpers'
import toast from 'react-hot-toast'

const STEPS = [
  {
    id: 'memory',
    title: "I'll remember today by…",
    subtitle: 'One sentence that captures the essence of this day.',
    placeholder: 'Today was the day I finally…',
    multiline: false,
  },
  {
    id: 'gratitude',
    title: 'Gratitude',
    subtitle: 'What has Mother Nature given you today — big or small?',
    placeholder: 'I am grateful for the morning light, for…',
    multiline: true,
  },
  {
    id: 'situation',
    title: 'What I asked for & what I received',
    subtitle: 'What did you ask from the universe? What situations is life giving you to become that?',
    placeholder: 'I asked to become more courageous. Today I faced…',
    multiline: true,
  },
  {
    id: 'reflection',
    title: 'Reflection',
    subtitle: 'What did you learn? What would you do differently?',
    placeholder: 'Looking back at today, I realize…',
    multiline: true,
  },
]

export default function NewJournalPage() {
  const router = useRouter()
  const [step, setStep]       = useState(0)
  const [saving, setSaving]   = useState(false)
  const [mood, setMood]       = useState('')
  const [answers, setAnswers] = useState<Record<string, string>>({
    memory: '', gratitude: '', situation: '', reflection: '',
  })

  const currentStep = STEPS[step]
  const isLast      = step === STEPS.length - 1
  const progress    = ((step + 1) / STEPS.length) * 100

  function handleNext() {
    if (!answers[currentStep.id].trim()) {
      toast.error('Please write something before continuing')
      return
    }
    setStep(s => s + 1)
  }

  async function handleSave() {
    if (!answers[currentStep.id].trim()) {
      toast.error('Please complete this section')
      return
    }
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not logged in')

      // Save journal entry
      const { error: entryError } = await supabase.from('journal_entries').insert({
        user_id:    user.id,
        memory:     answers.memory,
        gratitude:  answers.gratitude,
        situation:  answers.situation,
        reflection: answers.reflection,
        entry:      answers.memory,
        mood:       mood || null,
      })
      if (entryError) throw entryError

      // Update streak
      const today = new Date().toISOString().split('T')[0]
      const { data: streak } = await supabase.from('streaks').select('*').eq('user_id', user.id).single()

      if (streak) {
        const lastDate    = streak.last_entry_date
        const yesterday   = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yStr        = yesterday.toISOString().split('T')[0]
        const newStreak   = lastDate === today ? streak.current_streak
                          : lastDate === yStr  ? streak.current_streak + 1
                          : 1
        const longest     = Math.max(newStreak, streak.longest_streak)
        await supabase.from('streaks').update({
          current_streak: newStreak,
          longest_streak: longest,
          last_entry_date: today,
        }).eq('user_id', user.id)
      }

      toast.success('Entry saved! Streak updated 🔥')
      router.push('/journal')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save'
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-gold/4 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-2xl">
        {/* Back link */}
        <Link href="/journal" className="inline-flex items-center gap-2 text-parchment-dim hover:text-parchment font-body text-sm mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Journal
        </Link>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-parchment-dim text-xs font-body">Step {step + 1} of {STEPS.length}</p>
            <p className="text-gold text-xs font-body font-medium">{Math.round(progress)}% complete</p>
          </div>
          <div className="w-full h-1 bg-ink-50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-dark to-gold-light rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="card border-gold/15 p-8 animate-slide-up" key={step}>
          <div className="mb-6">
            <p className="text-gold text-xs font-body uppercase tracking-widest mb-2">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <h1 className="font-display text-3xl text-parchment font-semibold mb-2">{currentStep.title}</h1>
            <p className="text-parchment-dim font-body text-sm">{currentStep.subtitle}</p>
          </div>

          {currentStep.multiline ? (
            <textarea
              value={answers[currentStep.id]}
              onChange={e => setAnswers(a => ({ ...a, [currentStep.id]: e.target.value }))}
              placeholder={currentStep.placeholder}
              rows={6}
              className="input-base glow-gold resize-none leading-relaxed"
            />
          ) : (
            <input
              type="text"
              value={answers[currentStep.id]}
              onChange={e => setAnswers(a => ({ ...a, [currentStep.id]: e.target.value }))}
              placeholder={currentStep.placeholder}
              className="input-base glow-gold"
            />
          )}

          {/* Mood selector (last step) */}
          {isLast && (
            <div className="mt-6">
              <p className="text-parchment-muted text-sm font-body mb-3">How are you feeling overall?</p>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(MOOD_MAP).map(([key, { emoji, label }]) => (
                  <button
                    key={key}
                    onClick={() => setMood(key)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-body transition-all duration-200 ${
                      mood === key
                        ? 'border-gold/50 bg-gold/15 text-parchment'
                        : 'border-white/10 text-parchment-dim hover:border-white/20'
                    }`}
                  >
                    {emoji} {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="btn-ghost py-2 px-4 text-sm flex items-center gap-2 disabled:opacity-30"
            >
              <ChevronLeft size={16} /> Back
            </button>

            {isLast ? (
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary flex items-center gap-2"
              >
                {saving
                  ? <><Loader2 size={16} className="animate-spin" /> Saving…</>
                  : <><Save size={16} /> Save Entry</>}
              </button>
            ) : (
              <button onClick={handleNext} className="btn-primary flex items-center gap-2">
                Continue <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Word count */}
        <p className="text-center text-parchment-dim text-xs font-body mt-4">
          {answers[currentStep.id].split(/\s+/).filter(Boolean).length} words
        </p>
      </div>
    </div>
  )
}
