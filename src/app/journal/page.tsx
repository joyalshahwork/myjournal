import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUser, createServerSupabaseClient } from '@/lib/supabaseServer'
import { formatDate, MOOD_MAP } from '@/utils/helpers'
import Sidebar from '@/components/layout/Sidebar'
import { Plus, Flame } from 'lucide-react'

export default async function JournalPage() {
  const user = await getUser()
  if (!user) redirect('/login')

  const supabase = createServerSupabaseClient()
  const [entriesRes, streakRes, profileRes] = await Promise.all([
    supabase.from('journal_entries').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
    supabase.from('streaks').select('*').eq('user_id', user.id).single(),
    supabase.from('profiles').select('name').eq('id', user.id).single(),
  ])

  const entries = entriesRes.data ?? []
  const streak  = streakRes.data
  const profile = profileRes.data

  return (
    <div className="min-h-screen bg-ink flex">
      <Sidebar streakCount={streak?.current_streak ?? 0} userName={profile?.name ?? ''} />

      <main className="flex-1 md:ml-64 p-5 md:p-8 main-with-sidebar">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div>
            <h1 className="font-display text-4xl text-parchment font-semibold mb-1">Your Journal</h1>
            <p className="text-parchment-dim font-body text-sm">{entries.length} entries written</p>
          </div>
          <Link href="/journal/new" className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Write Today
          </Link>
        </div>

        {/* Streak banner */}
        {(streak?.current_streak ?? 0) > 0 && (
          <div className="card border-gold/20 bg-gradient-to-r from-gold/8 to-transparent mb-8 flex items-center gap-4 animate-slide-up">
            <Flame size={28} className="text-gold streak-fire" />
            <div>
              <p className="font-display text-parchment text-lg font-semibold">
                {streak?.current_streak}-day streak 🔥
              </p>
              <p className="text-parchment-dim text-sm font-body">
                Best: {streak?.longest_streak} days. Don&apos;t break the chain.
              </p>
            </div>
          </div>
        )}

        {/* Entries grid */}
        {entries.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <span className="text-6xl block mb-4">📓</span>
            <h2 className="font-display text-2xl text-parchment mb-3">Your journal is empty</h2>
            <p className="text-parchment-dim font-body mb-6">Write your first entry. The best time is always now.</p>
            <Link href="/journal/new" className="btn-primary">Begin Writing →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 animate-slide-up delay-100">
            {entries.map((entry) => {
              const mood = entry.mood ? MOOD_MAP[entry.mood as string] : null
              return (
                <Link
                  key={entry.id}
                  href={`/journal/${entry.id}`}
                  className="card hover:border-gold/25 hover:-translate-y-1 hover:shadow-gold-sm transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-parchment-dim text-xs font-body">
                      {formatDate(entry.created_at as string)}
                    </span>
                    {mood && <span title={mood.label}>{mood.emoji}</span>}
                  </div>

                  {entry.memory && (
                    <p className="font-display text-parchment text-sm italic mb-3 line-clamp-2 group-hover:text-gold transition-colors">
                      &ldquo;{entry.memory}&rdquo;
                    </p>
                  )}

                  {entry.gratitude && (
                    <p className="text-parchment-dim text-xs font-body line-clamp-2 leading-relaxed">
                      🙏 {entry.gratitude}
                    </p>
                  )}

                  <div className="divider" />
                  <p className="text-parchment-dim text-xs font-body">Read entry →</p>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
