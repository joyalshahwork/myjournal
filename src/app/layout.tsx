import type { Metadata } from 'next'
// @ts-ignore
import './globals.css'
import { Toaster } from 'react-hot-toast'
import AIChatbot from '@/components/features/chat/AIChatbot'

export const metadata: Metadata = {
  title: 'MyJournal — Write. Reflect. Grow.',
  description: 'A premium journaling app for ambitious people. Track your thoughts, expenses, and growth — all in one beautiful place.',
  keywords: ['journal', 'expense tracker', 'productivity', 'mindfulness', 'streak'],
  authors: [{ name: 'Joyal Chirag Shah' }, { name: 'Devarsh Dharmesh Shah' }],
  openGraph: {
    title: 'MyJournal',
    description: 'Write. Reflect. Grow.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <AIChatbot />
        <Toaster
          position="bottom-left"
          toastOptions={{
            style: {
              background: '#1E1C1A',
              color: '#F5F0E8',
              border: '1px solid rgba(212,168,83,0.2)',
              borderRadius: '12px',
              fontFamily: 'DM Sans, sans-serif',
            },
            success: {
              iconTheme: { primary: '#D4A853', secondary: '#0F0E0D' },
            },
          }}
        />
      </body>
    </html>
  )
}