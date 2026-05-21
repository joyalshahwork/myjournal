'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Sparkles, X, Send, Loader2, ChevronDown, RotateCcw } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED_PROMPTS = [
  '💪 Motivate me to journal today',
  '📚 Recommend a health & wellness course',
  '🧘 Tips to reduce stress',
  '🔥 How do I maintain my streak?',
  '😴 How can I sleep better?',
  '🥗 Simple nutrition tips',
]

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content:
    "Hey! I'm your MyJournal AI companion 🌟\n\nI'm here to help you stay motivated, build healthy habits, and find the best resources for your growth journey. Whether you need a push to write today, a course recommendation, or just some wellness advice — I've got you.\n\nWhat can I help you with?",
}

export default function AIChatbot() {
  const [open, setOpen]       = useState(false)
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [pulse, setPulse]     = useState(true)

  const bottomRef   = useRef<HTMLDivElement>(null)
  const inputRef    = useRef<HTMLTextAreaElement>(null)

  // Listen for external open trigger (e.g. from Sidebar)
  useEffect(() => {
    function handleOpenChat() { setOpen(true) }
    window.addEventListener('mmjj:open-chat', handleOpenChat)
    return () => window.removeEventListener('mmjj:open-chat', handleOpenChat)
  }, [])

  // Stop pulse after 5s
  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 5000)
    return () => clearTimeout(t)
  }, [])

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Focus input when chat opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg: Message = { role: 'user', content: trimmed }
    const updatedMessages  = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: updatedMessages }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error ?? 'Failed to get response')

      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Sorry, something went wrong 😕 — ${(err as Error).message}. Please try again.`,
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [messages, loading])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  function resetChat() {
    setMessages([WELCOME_MESSAGE])
    setInput('')
  }

  const showSuggestions = messages.length === 1

  return (
    <>
      {/* ── Floating toggle button ── */}
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          background:  'linear-gradient(135deg, #E2C46E, #C9A84C)',
          boxShadow:   pulse
            ? '0 0 0 0 rgba(201,168,76,0.7), 0 4px 20px rgba(201,168,76,0.5)'
            : '0 4px 20px rgba(201,168,76,0.4)',
          animation: pulse ? 'chatPulse 1.8s ease-in-out infinite' : undefined,
        }}
        aria-label="Open AI assistant"
      >
        {open
          ? <ChevronDown size={22} className="text-white" />
          : <Sparkles   size={22} className="text-white" />
        }
      </button>

      {/* ── Chat panel ── */}
      <div
        className="fixed z-50 flex flex-col"
        style={{
          bottom:        '5.5rem',
          right:         '1.5rem',
          width:         'min(400px, calc(100vw - 2rem))',
          height:        'min(560px, calc(100vh - 8rem))',
          borderRadius:  '20px',
          background:    'rgba(255,255,255,0.98)',
          backdropFilter:'blur(20px)',
          border:        '1px solid rgba(201,168,76,0.25)',
          boxShadow:     '0 24px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(201,168,76,0.1)',
          transform:     open ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(16px)',
          opacity:       open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
          transition:    'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease',
          transformOrigin: 'bottom right',
          overflow:      'hidden',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{
            background:   'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(226,196,110,0.06))',
            borderBottom: '1px solid rgba(201,168,76,0.18)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #E2C46E, #C9A84C)', boxShadow: '0 2px 8px rgba(201,168,76,0.35)' }}
            >
              <Sparkles size={17} className="text-white" />
            </div>
            <div>
              <p className="font-display font-semibold text-parchment text-sm leading-none mb-0.5">
                MyJournal AI
              </p>
              <p className="text-xs font-body" style={{ color: '#7A7A7A' }}>
                Wellness · Motivation · Courses
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={resetChat}
              title="Reset conversation"
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-gold/10"
              style={{ color: '#9A9A9A' }}
            >
              <RotateCcw size={15} />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-red-50"
              style={{ color: '#9A9A9A' }}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ scrollbarWidth: 'thin' }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mr-2 mt-0.5"
                  style={{ background: 'linear-gradient(135deg, #E2C46E, #C9A84C)' }}
                >
                  <Sparkles size={11} className="text-white" />
                </div>
              )}
              <div
                className="max-w-[80%] rounded-2xl px-4 py-3 text-sm font-body leading-relaxed whitespace-pre-wrap"
                style={
                  msg.role === 'user'
                    ? {
                        background:   'linear-gradient(135deg, #C9A84C, #9E7A28)',
                        color:        '#fff',
                        borderBottomRightRadius: '6px',
                        boxShadow:    '0 2px 8px rgba(201,168,76,0.25)',
                      }
                    : {
                        background:   'rgba(248,248,248,0.9)',
                        color:        '#1A1A1A',
                        borderBottomLeftRadius: '6px',
                        border:       '1px solid rgba(201,168,76,0.15)',
                        boxShadow:    '0 1px 4px rgba(0,0,0,0.04)',
                      }
                }
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mr-2 mt-0.5"
                style={{ background: 'linear-gradient(135deg, #E2C46E, #C9A84C)' }}
              >
                <Sparkles size={11} className="text-white" />
              </div>
              <div
                className="rounded-2xl px-4 py-3 flex items-center gap-1"
                style={{
                  background: 'rgba(248,248,248,0.9)',
                  border:     '1px solid rgba(201,168,76,0.15)',
                  borderBottomLeftRadius: '6px',
                }}
              >
                <span className="typing-dot" style={{ animationDelay: '0ms' }} />
                <span className="typing-dot" style={{ animationDelay: '160ms' }} />
                <span className="typing-dot" style={{ animationDelay: '320ms' }} />
              </div>
            </div>
          )}

          {/* Suggested prompts (only at start) */}
          {showSuggestions && !loading && (
            <div className="pt-2">
              <p className="text-xs font-body mb-2" style={{ color: '#9A9A9A' }}>Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="text-xs font-body px-3 py-1.5 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                      background: 'rgba(201,168,76,0.08)',
                      border:     '1px solid rgba(201,168,76,0.22)',
                      color:      '#9E7A28',
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div
          className="px-4 py-3 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(201,168,76,0.15)', background: 'rgba(255,255,255,0.95)' }}
        >
          <div
            className="flex items-end gap-2 rounded-xl px-4 py-2"
            style={{
              background: 'rgba(248,248,248,0.8)',
              border:     '1px solid rgba(201,168,76,0.2)',
              transition: 'border-color 0.2s',
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about wellness…"
              rows={1}
              disabled={loading}
              className="flex-1 bg-transparent resize-none text-sm font-body outline-none placeholder:text-parchment-dim disabled:opacity-60"
              style={{
                color:     '#1A1A1A',
                maxHeight: '100px',
                lineHeight: '1.5',
              }}
              onInput={e => {
                const el = e.currentTarget
                el.style.height = 'auto'
                el.style.height = el.scrollHeight + 'px'
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: input.trim() && !loading
                  ? 'linear-gradient(135deg, #E2C46E, #C9A84C)'
                  : 'rgba(201,168,76,0.15)',
              }}
            >
              {loading
                ? <Loader2 size={14} className="text-gold animate-spin" />
                : <Send size={14} className={input.trim() ? 'text-white' : 'text-gold'} />
              }
            </button>
          </div>
          <p className="text-center text-xs font-body mt-2" style={{ color: '#BABABA' }}>
            Powered by Gemini · Enter to send
          </p>
        </div>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes chatPulse {
          0%   { box-shadow: 0 0 0 0 rgba(201,168,76,0.55), 0 4px 20px rgba(201,168,76,0.4); }
          70%  { box-shadow: 0 0 0 12px rgba(201,168,76,0),  0 4px 20px rgba(201,168,76,0.4); }
          100% { box-shadow: 0 0 0 0 rgba(201,168,76,0),     0 4px 20px rgba(201,168,76,0.4); }
        }
        .typing-dot {
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #C9A84C;
          opacity: 0.6;
          animation: typingBounce 0.8s ease-in-out infinite;
        }
        @keyframes typingBounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50%       { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </>
  )
}