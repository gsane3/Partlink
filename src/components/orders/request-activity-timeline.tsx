import { cn, formatDate } from '@/lib/utils'
import type { RequestActivityEvent, ActivityTone } from '@/lib/requests/activity'

// ─── Tone styling ─────────────────────────────────────────────────────────────

const TONE_DOT: Record<ActivityTone, string> = {
  default: 'bg-slate-400',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  info:    'bg-blue-500',
}

const TONE_TITLE: Record<ActivityTone, string> = {
  default: 'text-slate-700',
  success: 'text-green-800',
  warning: 'text-amber-800',
  info:    'text-blue-800',
}

// ─── Timeline item ────────────────────────────────────────────────────────────

function TimelineItem({
  event,
  isLast,
}: {
  event: RequestActivityEvent
  isLast: boolean
}) {
  const tone = event.tone ?? 'default'

  return (
    <div className="flex gap-3">
      {/* Dot + vertical connector */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={cn('w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0', TONE_DOT[tone])} />
        {!isLast && <div className="w-px flex-1 bg-slate-200 my-1 min-h-[16px]" />}
      </div>

      {/* Content */}
      <div className={cn('pb-4', isLast && 'pb-0')}>
        <p className={cn('text-sm font-semibold leading-snug', TONE_TITLE[tone])}>
          {event.title}
        </p>
        {event.date && (
          <p className="text-xs text-slate-400 mt-0.5">{formatDate(event.date)}</p>
        )}
        {event.description && (
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{event.description}</p>
        )}
      </div>
    </div>
  )
}

// ─── Timeline card ────────────────────────────────────────────────────────────

export function RequestActivityTimeline({ events }: { events: RequestActivityEvent[] }) {
  if (events.length === 0) return null

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
          Ιστορικό αιτήματος
        </p>
      </div>
      <div className="px-4 py-4">
        {events.map((event, i) => (
          <TimelineItem
            key={event.id}
            event={event}
            isLast={i === events.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
