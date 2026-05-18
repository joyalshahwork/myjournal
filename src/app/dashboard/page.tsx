import { redirect } from 'next/navigation'
import { getUser, createServerSupabaseClient } from '@/lib/supabaseServer'
import { formatDate, formatCurrency, isStreakSafe } from '@/utils/helpers'
import Sidebar from '@/components/layout/Sidebar'
import DashboardClient from '@/components/features/dashboard/DashboardClient'

export default async function DashboardPage() {
  const user = await getUser()
  if (!user) redirect('/login')

  const supabase = createServerSupabaseClient()

  // Fetch all data in parallel
  const [profileRes, streakRes, recentEntriesRes, recentExpensesRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('streaks').select('*').eq('user_id', user.id).single(),
    supabase.from('journal_entries').select('*').eq('user_id', user.id)
      .order('created_at', { ascending: false }).limit(3),
    supabase.from('expenses').select('*').eq('user_id', user.id)
      .order('created_at', { ascending: false }).limit(5),
  ])

  const profile       = profileRes.data
  const streak        = streakRes.data
  const recentEntries = recentEntriesRes.data ?? []
  const recentExpenses = recentExpensesRes.data ?? []

  const hasWrittenToday = streak?.last_entry_date
    ? formatDate(streak.last_entry_date) === 'Today'
    : false

  const totalThisMonth = recentExpenses.reduce((sum, e) => sum + Number(e.amount), 0)

  return (
    <div className="min-h-screen bg-ink flex">
      <Sidebar
        streakCount={streak?.current_streak ?? 0}
        userName={profile?.name ?? user.email?.split('@')[0] ?? 'Friend'}
      />

      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <p className="text-parchment-dim font-body text-sm mb-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <h1 className="font-display text-4xl text-parchment font-semibold">
            Good {getTimeOfDay()},{' '}
            <span className="text-gold">{profile?.name?.split(' ')[0] ?? 'Friend'}</span>
          </h1>
        </div>

        <DashboardClient
          streak={streak}
          hasWrittenToday={hasWrittenToday}
          recentEntries={recentEntries}
          recentExpenses={recentExpenses}
          totalThisMonth={totalThisMonth}
        />
      </main>
    </div>
  )
}

function getTimeOfDay(): string {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
