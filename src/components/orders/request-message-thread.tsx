import { cn, formatDate } from '@/lib/utils'
import type { RequestMessage, RequestMessageAuthor } from '@/lib/requests/messages'

// ─── Single message bubble ────────────────────────────────────────────────────

function MessageBubble({ message, isMine }: { message: RequestMessage; isMine: boolean }) {
  return (
    <div className={cn('flex', isMine ? 'justify-end' : 'justify-start')}>
      <div className="flex flex-col gap-1 max-w-[80%] min-w-0">
        <div className={cn('flex items-center gap-2', isMine ? 'flex-row-reverse' : 'flex-row')}>
          <span className="text-xs font-semibold text-slate-600 truncate">{message.authorLabel}</span>
          {message.createdAt && (
            <span className="text-[11px] text-slate-400 flex-shrink-0">{formatDate(message.createdAt)}</span>
          )}
        </div>
        <div
          className={cn(
            'rounded-xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words',
            isMine
              ? 'bg-blue-600 text-white rounded-tr-sm'
              : 'bg-slate-100 text-slate-800 rounded-tl-sm'
          )}
        >
          {message.body}
        </div>
      </div>
    </div>
  )
}

// ─── Thread card ──────────────────────────────────────────────────────────────

export function RequestMessageThread({
  messages,
  perspective,
  emptyText = 'Δεν υπάρχουν μηνύματα ακόμα.',
}: {
  messages: RequestMessage[]
  perspective: RequestMessageAuthor
  emptyText?: string
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Μηνύματα</p>
      </div>
      <div className="px-4 py-4">
        {messages.length === 0 ? (
          <p className="text-sm text-slate-400 italic">{emptyText}</p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} isMine={msg.author === perspective} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
