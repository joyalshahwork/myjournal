'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'
import { EXPENSE_CATEGORIES, getCategoryDetails, formatCurrency } from '@/utils/helpers'
import Sidebar from '@/components/layout/Sidebar'
import { Loader2 } from 'lucide-react'
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns'

interface Expense {
  id: string; category: string; amount: number; created_at: string
}

export default function AnalyticsPage() {
  const [expenses, setExpenses]   = useState<Expense[]>([])
  const [streak, setStreak]       = useState<Record<string, unknown> | null>(null)
  const [profile, setProfile]     = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading]     = useState(true)
  const [activeMonth, setActiveMonth] = useState(0) // 0 = current, 1 = last month, etc.

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const [expRes, streakRes, profileRes] = await Promise.all([
      supabase.from('expenses').select('*').eq('user_id', user.id),
      supabase.from('streaks').select('*').eq('user_id', user.id).single(),
      supabase.from('profiles').select('name').eq('id', user.id).single(),
    ])
    setExpenses(expRes.data ?? [])
    setStreak(streakRes.data)
    setProfile(profileRes.data)
    setLoading(false)
  }

  // Filter expenses for selected month
  const targetDate   = subMonths(new Date(), activeMonth)
  const monthStart   = startOfMonth(targetDate)
  const monthEnd     = endOfMonth(targetDate)
  const monthLabel   = format(targetDate, 'MMMM yyyy')

  const monthExpenses = expenses.filter(e => {
    const d = new Date(e.created_at)
    return d >= monthStart && d <= monthEnd
  })

  // Category breakdown for pie chart
  const categoryTotals = EXPENSE_CATEGORIES.map(cat => {
    const total = monthExpenses.filter(e => e.category === cat.id).reduce((s, e) => s + e.amount, 0)
    return { name: cat.label, value: total, color: cat.color, emoji: cat.emoji }
  }).filter(c => c.value > 0)

  // Last 6 months for bar chart
  const barData = Array.from({ length: 6 }, (_, i) => {
    const d     = subMonths(new Date(), 5 - i)
    const start = startOfMonth(d)
    const end   = endOfMonth(d)
    const total = expenses
      .filter(e => new Date(e.created_at) >= start && new Date(e.created_at) <= end)
      .reduce((s, e) => s + e.amount, 0)
    return { month: format(d, 'MMM'), amount: total }
  })

  const grandTotal = monthExpenses.reduce((s, e) => s + e.amount, 0)

  if (loading) return (
    <div className="min-h-screen bg-ink flex items-center justify-center">
      <Loader2 size={32} className="text-gold animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen bg-ink flex">
      <Sidebar streakCount={Number(streak?.current_streak ?? 0)} userName={String(profile?.name ?? '')} />

      <main className="flex-1 ml-64 p-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-4xl text-parchment font-semibold mb-1">Analytics</h1>
          <p className="text-parchment-dim font-body text-sm">Your money story at a glance.</p>
        </div>

        {/* Month selector */}
        <div className="flex gap-2 mb-8 animate-slide-up">
          {[0, 1, 2].map(m => (
            <button
              key={m}
              onClick={() => setActiveMonth(m)}
              className={`px-4 py-2 rounded-xl font-body text-sm transition-all duration-200 ${
                activeMonth === m
                  ? 'bg-gold/20 border border-gold/30 text-gold'
                  : 'border border-white/10 text-parchment-dim hover:border-white/20'
              }`}
            >
              {format(subMonths(new Date(), m), 'MMMM')}
            </button>
          ))}
        </div>

        {monthExpenses.length === 0 ? (
          <div className="card text-center py-16 animate-fade-in">
            <span className="text-5xl block mb-4">📊</span>
            <h2 className="font-display text-2xl text-parchment mb-2">No data for {monthLabel}</h2>
            <p className="text-parchment-dim font-body text-sm">Start adding expenses to see your analytics.</p>
          </div>
        ) : (
          <div className="space-y-6 animate-slide-up delay-100">

            {/* Summary row */}
            <div className="grid grid-cols-3 gap-5">
              <div className="card border-gold/20 bg-gradient-to-br from-gold/8 to-transparent">
                <p className="text-parchment-dim text-xs uppercase tracking-wider font-body mb-2">Total Spent</p>
                <p className="font-display text-3xl text-gold font-bold">{formatCurrency(grandTotal)}</p>
                <p className="text-parchment-dim text-xs font-body mt-1">{monthLabel}</p>
              </div>
              <div className="card">
                <p className="text-parchment-dim text-xs uppercase tracking-wider font-body mb-2">Top Category</p>
                {categoryTotals[0] && (
                  <>
                    <p className="font-display text-2xl text-parchment font-semibold">
                      {categoryTotals.sort((a,b) => b.value - a.value)[0].emoji}{' '}
                      {categoryTotals.sort((a,b) => b.value - a.value)[0].name.split(' ')[0]}
                    </p>
                    <p className="text-parchment-dim text-xs font-body mt-1">
                      {formatCurrency(categoryTotals.sort((a,b) => b.value - a.value)[0].value)}
                    </p>
                  </>
                )}
              </div>
              <div className="card">
                <p className="text-parchment-dim text-xs uppercase tracking-wider font-body mb-2">Transactions</p>
                <p className="font-display text-3xl text-parchment font-semibold">{monthExpenses.length}</p>
                <p className="text-parchment-dim text-xs font-body mt-1">this month</p>
              </div>
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie chart */}
              <div className="card">
                <h2 className="font-display text-parchment text-xl font-semibold mb-5">Spending Breakdown</h2>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={categoryTotals}
                      cx="50%" cy="50%"
                      innerRadius={70} outerRadius={110}
                      paddingAngle={3} dataKey="value"
                    >
                      {categoryTotals.map((entry, i) => (
                        <Cell key={i} fill={entry.color} opacity={0.85} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#1E1C1A', border: '1px solid rgba(212,168,83,0.2)', borderRadius: '12px', color: '#F5F0E8' }}
                      formatter={(value: number) => [formatCurrency(value), '']}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {categoryTotals.sort((a,b) => b.value - a.value).map(cat => (
                    <div key={cat.name} className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                      <span className="text-parchment-dim text-xs font-body truncate">{cat.name.split(' ')[0]}</span>
                      <span className="text-parchment text-xs font-body ml-auto">{Math.round((cat.value/grandTotal)*100)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bar chart: 6 months */}
              <div className="card">
                <h2 className="font-display text-parchment text-xl font-semibold mb-5">Last 6 Months</h2>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" tick={{ fill: '#8A8278', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#8A8278', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: '#1E1C1A', border: '1px solid rgba(212,168,83,0.2)', borderRadius: '12px', color: '#F5F0E8' }}
                      formatter={(v: number) => [formatCurrency(v), 'Spent']}
                    />
                    <Bar dataKey="amount" fill="#D4A853" opacity={0.8} radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
