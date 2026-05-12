'use client'

import { useState, useRef, useEffect } from 'react'
import { cn, formatOrderNumber } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ORDER_STATUS_LABELS } from '@/lib/constants'
import type { ChatThread, ChatMessage, ChatStatus } from '@/lib/data/chats'
import type { BadgeVariant } from '@/components/ui/badge'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMessageTime(isoString: string): string {
  const d = new Date(isoString)
  return d.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })
}

const STATUS_BADGE: Record<ChatStatus, { variant: BadgeVariant; label: string }> = {
  active: { variant: 'success', label: 'Ενεργό' },
  waiting: { variant: 'warning', label: 'Αναμονή' },
  closed: { variant: 'muted', label: 'Κλειστό' },
}

const BUYER_QUICK_REPLIES = [
  'Είναι ακόμα διαθέσιμο;',
  'Πότε μπορεί να σταλεί;',
  'Στείλε μου στοιχεία πληρωμής',
]

const SELLER_QUICK_REPLIES = [
  'Είναι διαθέσιμο',
  'Μπορώ να το στείλω σήμερα',
  'Στείλε μου στοιχεία αποστολής',
]

// ─── Component ────────────────────────────────────────────────────────────────

interface ChatPanelProps {
  thread: ChatThread
  currentUserId: string
  currentRole: 'buyer' | 'seller'
  onBack: () => void
}

export function ChatPanel({ thread, currentUserId, currentRole, onBack }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(thread.messages)
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const msgCounter = useRef(0)

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const newMsg: ChatMessage = {
      id: `local-${msgCounter.current++}`,
      chatId: thread.id,
      senderId: currentUserId,
      senderRole: currentRole,
      body: trimmed,
      sentAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, newMsg])
    setInput('')
  }

  const quickReplies = currentRole === 'buyer' ? BUYER_QUICK_REPLIES : SELLER_QUICK_REPLIES
  const { variant: statusVariant, label: statusLabel } = STATUS_BADGE[thread.status]
  const participantName = currentRole === 'buyer' ? thread.sellerBusinessName : thread.buyerName

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-white flex-shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="lg:hidden w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-700 -ml-1 flex-shrink-0"
          aria-label="Πίσω"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-900 truncate">{participantName}</p>
            <Badge variant={statusVariant} className="text-[10px] px-1.5 py-0 flex-shrink-0">
              {statusLabel}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <p className="text-xs text-slate-500 truncate">{thread.partName}</p>
            {thread.orderId && (
              <span className="text-xs font-mono text-slate-400 flex-shrink-0">
                · #{formatOrderNumber(thread.orderId)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-slate-50">
        {/* Context card */}
        <div className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 mb-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-700 truncate">{thread.partName}</p>
            <p className="text-xs text-slate-400 truncate">{thread.vehicleLabel}</p>
            {thread.orderStatus && (
              <p className="text-xs text-slate-500 mt-0.5">
                Παραγγελία: {ORDER_STATUS_LABELS[thread.orderStatus]}
              </p>
            )}
          </div>
          {thread.partPrice && (
            <p className="text-sm font-bold text-slate-900 flex-shrink-0 tabular-nums">
              €{thread.partPrice}
            </p>
          )}
        </div>

        {/* Messages */}
        {messages.map((msg) => {
          const isOwn = msg.senderId === currentUserId
          return (
            <div
              key={msg.id}
              className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}
            >
              <div className={cn(
                'max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                isOwn
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-white border border-slate-200 text-slate-900 rounded-bl-sm'
              )}>
                <p>{msg.body}</p>
                <p className={cn(
                  'text-[10px] mt-1 text-right',
                  isOwn ? 'text-blue-200' : 'text-slate-400'
                )}>
                  {formatMessageTime(msg.sentAt)}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies */}
      <div className="flex gap-2 px-4 py-2 overflow-x-auto border-t border-slate-100 bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex-shrink-0">
        {quickReplies.map((reply) => (
          <button
            key={reply}
            type="button"
            onClick={() => send(reply)}
            className="flex-shrink-0 inline-flex items-center h-8 px-3 rounded-full border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 transition-colors"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Composer */}
      <div className="flex items-end gap-2 px-4 py-3 border-t border-slate-200 bg-white flex-shrink-0">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              send(input)
            }
          }}
          placeholder="Γράψε μήνυμα..."
          rows={1}
          className={cn(
            'flex-1 resize-none px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl',
            'text-slate-900 placeholder:text-slate-400',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'max-h-32 overflow-y-auto'
          )}
        />
        <button
          type="button"
          onClick={() => send(input)}
          disabled={!input.trim()}
          className={cn(
            'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
            input.trim()
              ? 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          )}
          aria-label="Αποστολή"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  )
}
