'use client'

import Link from 'next/link'
import { Flame, BookOpen, Receipt, TrendingUp, Plus, ChevronRight } from 'lucide-react'
import { formatDate, formatCurrency, getCategoryDetails } from '@/utils/helpers'

interface Props {
  streak:           Record<string, unknown> | null
  hasWrittenToday:  boolean
  recentEntries:    Record<string, unknown>[]
  recentExpenses:   Record<string, unknown>[]
  totalThisMonth:   number
}

export default function DashboardClient({ streak, hasWrittenToday, recentEntries, recentExpenses, totalThisMonth }: Props) {
  return (
    <div className="space-y-8">

      {/* ── Write today banner ── */}
      {!hasWrittenToday && (
        <div className="animate-slide-up card border-gold/30 bg-gradient-to-r from-gold/10 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-3xl">📓</span>
            <div>
              <p className="font-display text-parchment text-lg font-semibold">You haven&apos;t written today yet</p>
              <p className="text-parchment-dim text-sm font-body">Your streak is at risk. Write now to keep it alive.</p>
            </div>
          </div>
          <Link href="/journal/new" className="btn-primary text-sm whitespace-nowrap">
            Write Today&apos;s Entry →
          </Link>
        </div>
      )}

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 animate-slide-up delay-100">
        <StatCard
          icon={<Flame className="text-gold streak-fire" size={22} />}
          label="Current Streak"
          value={`${streak?.current_streak ?? 0} days`}
          sub={`Best: ${streak?.longest_streak ?? 0} days`}
          accent
        />
        <StatCard
          icon={<BookOpen className="text-parchment-muted" size={22} />}
          label="Total Entries"
          value={String(recentEntries.length)}
          sub="This session"
        />
        <StatCard
          icon={<Receipt className="text-parchment-muted" size={22} />}
          label="Spent This Month"
          value={formatCurrency(totalThisMonth)}
          sub="Track everything"
        />
        <StatCard
          icon={<TrendingUp className="text-journal-green" size={22} />}
          label="Days Consistent"
          value={hasWrittenToday ? 'On track ✓' : 'Write today!'}
          sub="Keep going"
        />
      </div>

      {/* ── Two column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up delay-200">

        {/* Recent journal entries */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-parchment text-xl font-semibold">Recent Entries</h2>
            <Link href="/journal" className="text-gold text-sm font-body hover:text-gold-light transition-colors flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          {recentEntries.length === 0 ? (
            <EmptyState
              icon="📝"
              message="No entries yet. Write your first one!"
              href="/journal/new"
              cta="Write now"
            />
          ) : (
            <div className="space-y-3">
              {recentEntries.map((entry) => (
                <Link
                  key={entry.id as string}
                  href={`/journal/${entry.id}`}
                  className="block p-4 rounded-xl bg-ink-50/50 border border-white/5 hover:border-gold/20 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-parchment-muted text-xs font-body mb-1">
                        {formatDate(entry.created_at as string)}
                      </p>
                      <p className="text-parchment text-sm font-body leading-relaxed line-clamp-2">
                        {(entry.entry as string) || (entry.memory as string) || 'No text recorded'}
                      </p>
                    </div>
                    <ChevronRight size={14} className="text-parchment-dim group-hover:text-gold transition-colors flex-shrink-0 mt-1" />
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Link href="/journal/new" className="btn-ghost w-full mt-4 flex items-center justify-center gap-2 text-sm">
            <Plus size={16} /> New Entry
          </Link>
        </div>

        {/* Recent expenses */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-parchment text-xl font-semibold">Recent Expenses</h2>
            <Link href="/expenses" className="text-gold text-sm font-body hover:text-gold-light transition-colors flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          {recentExpenses.length === 0 ? (
            <EmptyState
              icon="💸"
              message="No expenses tracked yet."
              href="/expenses"
              cta="Add expense"
            />
          ) : (
            <div className="space-y-3">
              {recentExpenses.map((expense) => {
                const cat = getCategoryDetails(expense.category as string)
                return (
                  <div key={expense.id as string} className="flex items-center justify-between p-4 rounded-xl bg-ink-50/50 border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{cat.emoji}</span>
                      <div>
                        <p className="text-parchment text-sm font-body font-medium">{cat.label}</p>
                        <p className="text-parchment-dim text-xs font-body">
                          {formatDate(expense.created_at as string)}
                        </p>
                      </div>
                    </div>
                    <span className="text-parchment font-body font-semibold text-sm">
                      {formatCurrency(Number(expense.amount))}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
          <Link href="/expenses" className="btn-ghost w-full mt-4 flex items-center justify-center gap-2 text-sm">
            <Plus size={16} /> Add Expense
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, sub, accent }: {
  icon: React.ReactNode; label: string; value: string; sub: string; accent?: boolean
}) {
  return (
    <div className={`card ${accent ? 'border-gold/25 bg-gradient-to-br from-gold/8 to-transparent' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        {icon}
      </div>
      <p className="text-parchment-dim text-xs font-body uppercase tracking-wider mb-1">{label}</p>
      <p className="font-display text-2xl text-parchment font-semibold mb-1">{value}</p>
      <p className="text-parchment-dim text-xs font-body">{sub}</p>
    </div>
  )
}

function EmptyState({ icon, message, href, cta }: { icon: string; message: string; href: string; cta: string }) {
  return (
    <div className="text-center py-8">
      <span className="text-4xl block mb-3">{icon}</span>
      <p className="text-parchment-dim text-sm font-body mb-4">{message}</p>
      <Link href={href} className="btn-primary text-sm py-2 px-4 inline-flex">{cta}</Link>
    </div>
  )
}
