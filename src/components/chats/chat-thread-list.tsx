import { cn, formatOrderNumber } from '@/lib/utils'
import type { ChatThread } from '@/lib/data/chats'
import type { BadgeVariant } from '@/components/ui/badge'
import { Badge } from '@/components/ui/badge'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(isoString: string): string {
  const d = new Date(isoString)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  if (isToday) {
    return d.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString('el-GR', { day: '2-digit', month: '2-digit' })
}

const STATUS_BADGE: Record<string, { variant: BadgeVariant; label: string }> = {
  active: { variant: 'success', label: 'Ενεργό' },
  waiting: { variant: 'warning', label: 'Αναμονή' },
  closed: { variant: 'muted', label: 'Κλειστό' },
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ChatThreadListProps {
  threads: ChatThread[]
  selectedId: string | null
  onSelect: (id: string) => void
  role: 'buyer' | 'seller'
}

export function ChatThreadList({ threads, selectedId, onSelect, role }: ChatThreadListProps) {
  if (threads.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-sm text-slate-500">Δεν βρέθηκαν συνομιλίες</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-100">
      {threads.map((thread) => {
        const unread = role === 'buyer' ? thread.unreadCountBuyer : thread.unreadCountSeller
        const participantName = role === 'buyer' ? thread.sellerBusinessName : thread.buyerName
        const { variant, label } = STATUS_BADGE[thread.status] ?? STATUS_BADGE.active
        const isSelected = thread.id === selectedId

        return (
          <button
            key={thread.id}
            type="button"
            onClick={() => onSelect(thread.id)}
            className={cn(
              'w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors',
              isSelected
                ? 'bg-blue-50'
                : 'hover:bg-slate-50 active:bg-slate-100'
            )}
          >
            {/* Avatar */}
            <div className={cn(
              'w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold',
              isSelected ? 'bg-blue-200 text-blue-800' : 'bg-slate-200 text-slate-600'
            )}>
              {participantName.substring(0, 1).toUpperCase()}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <p className={cn(
                  'text-sm truncate',
                  unread > 0 ? 'font-bold text-slate-900' : 'font-semibold text-slate-800'
                )}>
                  {participantName}
                </p>
                <span className="text-xs text-slate-400 flex-shrink-0 tabular-nums">
                  {formatTime(thread.lastMessageAt)}
                </span>
              </div>

              <p className="text-xs text-slate-500 truncate mb-1">{thread.partName}</p>

              <p className={cn(
                'text-xs truncate',
                unread > 0 ? 'font-semibold text-slate-700' : 'text-slate-400'
              )}>
                {thread.lastMessage}
              </p>

              <div className="flex items-center gap-1.5 mt-1.5">
                {thread.orderId && (
                  <span className="text-[11px] font-mono text-slate-400">
                    #{formatOrderNumber(thread.orderId)}
                  </span>
                )}
                <Badge variant={variant} className="text-[10px] px-1.5 py-0">{label}</Badge>
                {unread > 0 && (
                  <span className="ml-auto flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
