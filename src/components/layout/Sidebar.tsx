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
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="sidebar-desktop fixed left-0 top-0 bottom-0 w-64 flex flex-col z-40"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(16px)',
          borderRight: '1px solid rgba(201,168,76,0.18)',
          boxShadow: '2px 0 20px rgba(0,0,0,0.06)',
        }}
      >
        {/* Logo */}
        <div className="px-6 py-6" style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #E2C46E, #C9A84C)', boxShadow: '0 2px 8px rgba(201,168,76,0.3)' }}
            >
              <span className="text-white font-display font-bold">M</span>
            </div>
            <span className="font-display text-dark text-xl font-semibold">MyJournal</span>
          </Link>
        </div>

        {/* Streak pill */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(192,192,192,0.06))', border: '1px solid rgba(201,168,76,0.2)' }}
          >
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
                    ? 'text-gold'
                    : 'text-parchment-muted hover:text-dark hover:bg-silver-light/60',
                )}
                style={active ? {
                  background: 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.06))',
                  border: '1px solid rgba(201,168,76,0.22)',
                } : {}}
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
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #E2C46E, #C9A84C)', boxShadow: '0 2px 8px rgba(201,168,76,0.25)' }}
            >
              <span className="text-white text-xs font-display font-bold">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-dark text-sm font-body font-medium truncate">{userName}</p>
              <p className="text-parchment-dim text-xs font-body">Free plan</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-parchment-dim hover:text-journal-red hover:bg-red-50 transition-all duration-200"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(201,168,76,0.2)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        }}
      >
        <div className="flex items-center justify-around px-2 py-2 pb-safe">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-0"
                style={active ? {
                  color: '#C9A84C',
                } : { color: '#9A9A9A' }}
              >
                <Icon size={20} />
                <span className="text-xs font-body font-medium">{label}</span>
              </Link>
            )
          })}
          {/* Logout on mobile */}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200"
            style={{ color: '#9A9A9A' }}
          >
            <LogOut size={20} />
            <span className="text-xs font-body font-medium">Out</span>
          </button>
        </div>
      </nav>
    </>
  )
}
