import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, isToday, isYesterday, differenceInDays } from 'date-fns'

// Tailwind class merge helper
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date nicely
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  if (isToday(d))     return 'Today'
  if (isYesterday(d)) return 'Yesterday'
  return format(d, 'MMMM d, yyyy')
}

// Format currency in INR
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(amount)
}

// Get month name
export function getMonthName(date = new Date()): string {
  return format(date, 'MMMM yyyy')
}

// Streak check: did the user journal today?
export function isStreakSafe(lastEntryDate: string | null): boolean {
  if (!lastEntryDate) return false
  return differenceInDays(new Date(), new Date(lastEntryDate)) <= 1
}

// Mood emoji map
export const MOOD_MAP: Record<string, { emoji: string; label: string; color: string }> = {
  great:    { emoji: '🌟', label: 'Great',    color: '#D4A853' },
  good:     { emoji: '😊', label: 'Good',     color: '#27AE60' },
  okay:     { emoji: '😐', label: 'Okay',     color: '#2980B9' },
  low:      { emoji: '😔', label: 'Low',      color: '#8A8278' },
  terrible: { emoji: '⛈️', label: 'Terrible', color: '#C0392B' },
}

// Expense categories
export const EXPENSE_CATEGORIES = [
  { id: 'food',       label: 'Food & Dining',     emoji: '🍽️', color: '#E67E22' },
  { id: 'transport',  label: 'Transport',          emoji: '🚗', color: '#3498DB' },
  { id: 'clothes',    label: 'Clothing',           emoji: '👗', color: '#9B59B6' },
  { id: 'upskilling', label: 'Upskilling',         emoji: '📚', color: '#27AE60' },
  { id: 'health',     label: 'Health',             emoji: '💊', color: '#E74C3C' },
  { id: 'invest',     label: 'Investments & SIP',  emoji: '📈', color: '#D4A853' },
  { id: 'bills',      label: 'Bills & Utilities',  emoji: '🏠', color: '#1ABC9C' },
  { id: 'ent',        label: 'Entertainment',      emoji: '🎬', color: '#F39C12' },
  { id: 'other',      label: 'Other',              emoji: '📦', color: '#95A5A6' },
]

// Get category details
export function getCategoryDetails(id: string) {
  return EXPENSE_CATEGORIES.find(c => c.id === id) ?? EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1]
}

// Truncate text
export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + '…' : str
}
