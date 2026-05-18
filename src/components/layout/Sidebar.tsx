'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import {
  LayoutDashboard, BookOpen, Receipt, BarChart2,
  LogOut, Flame, Settings,
} from 'lucide-react'
import { cn } from '@/utils/helpers'
import toast from 'react-hot-toast'

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/journal',   icon: BookOpen,        label: 'Journal' },
  { href: '/expenses',  icon: Receipt,         label: 'Expenses' },
  { href: '/analytics', icon: BarChart2,       label: 'Analytics' },
]

interface SidebarProps {
  streakCount?: number
  userName?: string
}

export default function Sidebar({ streakCount = 0, userName = 'Friend' }: SidebarProps) {
  const pathname = usePathname()
  const router   = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Goodbye! See you tomorrow. 📓')
    router.push('/')
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 glass border-r border-gold/10 flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gold/10">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gold/20 border border-gold/30 flex items-center justify-center">
            <span className="text-gold font-display font-bold">M</span>
          </div>
          <span className="font-display text-parchment text-xl font-semibold">MyJournal</span>
        </Link>
      </div>

      {/* Streak pill */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-3 bg-gold/10 border border-gold/20 rounded-xl px-4 py-3">
          <Flame size={18} className="text-gold streak-fire" />
          <div>
            <p className="text-gold font-body font-semibold text-sm">{streakCount} day streak</p>
            <p className="text-parchment-dim text-xs font-body">Keep it going!</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm transition-all duration-200',
                active
                  ? 'bg-gold/15 text-gold border border-gold/20'
                  : 'text-parchment-muted hover:text-parchment hover:bg-white/5',
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-6 space-y-1">
        <div className="divider" />
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center flex-shrink-0">
            <span className="text-gold text-xs font-display font-bold">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-parchment text-sm font-body font-medium truncate">{userName}</p>
            <p className="text-parchment-dim text-xs font-body">Free plan</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-parchment-dim hover:text-journal-red hover:bg-red-500/5 transition-all duration-200"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
