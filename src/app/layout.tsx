import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

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
        <Toaster
          position="bottom-right"
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
