'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Plus, Loader2, Trash2 } from 'lucide-react'
import { EXPENSE_CATEGORIES, getCategoryDetails, formatCurrency, formatDate } from '@/utils/helpers'
import Sidebar from '@/components/layout/Sidebar'
import toast from 'react-hot-toast'

interface Expense {
  id: string; category: string; amount: number; note: string | null; created_at: string
}

export default function ExpensesPage() {
  const [expenses, setExpenses]     = useState<Expense[]>([])
  const [streak, setStreak]         = useState<Record<string, unknown> | null>(null)
  const [profile, setProfile]       = useState<Record<string, unknown> | null>(null)
  const [category, setCategory]     = useState(EXPENSE_CATEGORIES[0].id)
  const [amount, setAmount]         = useState('')
  const [note, setNote]             = useState('')
  const [loading, setLoading]       = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter]         = useState('all')

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const [expRes, streakRes, profileRes] = await Promise.all([
      supabase.from('expenses').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('streaks').select('*').eq('user_id', user.id).single(),
      supabase.from('profiles').select('name').eq('id', user.id).single(),
    ])
    setExpenses(expRes.data ?? [])
    setStreak(streakRes.data)
    setProfile(profileRes.data)
    setLoading(false)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) { toast.error('Enter a valid amount'); return }
    setSubmitting(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not logged in')
      const { data, error } = await supabase.from('expenses').insert({
        user_id: user.id, category, amount: amt, note: note || null,
      }).select().single()
      if (error) throw error
      setExpenses(prev => [data as Expense, ...prev])
      setAmount(''); setNote('')
      toast.success('Expense added!')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to add')
    } finally { setSubmitting(false) }
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('expenses').delete().eq('id', id)
    setExpenses(prev => prev.filter(e => e.id !== id))
    toast.success('Expense removed')
  }

  const filtered = filter === 'all' ? expenses : expenses.filter(e => e.category === filter)
  const total    = filtered.reduce((s, e) => s + e.amount, 0)

  if (loading) return <LoadingState />

  return (
    <div className="min-h-screen bg-ink flex">
      <Sidebar streakCount={Number(streak?.current_streak ?? 0)} userName={String(profile?.name ?? '')} />

      <main className="flex-1 ml-64 p-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-4xl text-parchment font-semibold mb-1">Expense Tracker</h1>
          <p className="text-parchment-dim font-body text-sm">Know where every rupee goes.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up">

          {/* ── Add expense form ── */}
          <div className="lg:col-span-1">
            <div className="card border-gold/15">
              <h2 className="font-display text-parchment text-xl font-semibold mb-5">Add Expense</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                {/* Category */}
                <div>
                  <label className="block text-parchment-muted text-sm font-body mb-2">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {EXPENSE_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs font-body transition-all duration-200 ${
                          category === cat.id
                            ? 'border-gold/50 bg-gold/10 text-parchment'
                            : 'border-white/10 text-parchment-dim hover:border-white/20'
                        }`}
                      >
                        <span className="text-lg">{cat.emoji}</span>
                        <span className="leading-tight text-center">{cat.label.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-parchment-muted text-sm font-body mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                    required
                    className="input-base glow-gold"
                  />
                </div>

                {/* Note */}
                <div>
                  <label className="block text-parchment-muted text-sm font-body mb-2">Note (optional)</label>
                  <input
                    type="text"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="e.g. Lunch at work"
                    className="input-base glow-gold"
                  />
                </div>

                <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
                  {submitting ? <><Loader2 size={16} className="animate-spin" /> Adding…</> : <><Plus size={16} /> Add Expense</>}
                </button>
              </form>
            </div>

            {/* Total card */}
            <div className="card border-gold/20 bg-gradient-to-br from-gold/8 to-transparent mt-5">
              <p className="text-parchment-dim text-xs font-body uppercase tracking-wider mb-1">Total shown</p>
              <p className="font-display text-3xl text-gold font-bold">{formatCurrency(total)}</p>
              <p className="text-parchment-dim text-xs font-body mt-1">{filtered.length} transactions</p>
            </div>
          </div>

          {/* ── Expense list ── */}
          <div className="lg:col-span-2 card border-gold/10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-parchment text-xl font-semibold">All Expenses</h2>
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="bg-ink-50 border border-white/10 rounded-xl px-3 py-2 text-parchment-muted text-sm font-body focus:outline-none focus:border-gold/30"
              >
                <option value="all">All categories</option>
                {EXPENSE_CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
                ))}
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-5xl block mb-3">💸</span>
                <p className="text-parchment-dim font-body">No expenses here yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(expense => {
                  const cat = getCategoryDetails(expense.category)
                  return (
                    <div key={expense.id} className="flex items-center justify-between p-4 rounded-xl bg-ink-50/50 border border-white/5 hover:border-white/10 transition-all group">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                          style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}30` }}
                        >
                          {cat.emoji}
                        </div>
                        <div>
                          <p className="text-parchment text-sm font-body font-medium">{cat.label}</p>
                          <p className="text-parchment-dim text-xs font-body">
                            {formatDate(expense.created_at)} {expense.note && `· ${expense.note}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-body font-semibold text-parchment">{formatCurrency(expense.amount)}</span>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="opacity-0 group-hover:opacity-100 text-parchment-dim hover:text-journal-red transition-all p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-ink flex items-center justify-center">
      <Loader2 size={32} className="text-gold animate-spin" />
    </div>
  )
}
