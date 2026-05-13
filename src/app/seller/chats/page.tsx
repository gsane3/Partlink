'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { FilterChip } from '@/components/forms/filter-chip'
import { PageContainer } from '@/components/layout/page-container'
import { formatDate } from '@/lib/utils'
import { ROUTES } from '@/lib/routes'
import { getRequestConversations } from '@/lib/requests/conversations'
import type { RequestConversation } from '@/lib/requests/conversations'
import { SELLER_STATUS_CONFIG } from '@/lib/requests/status'

// ─── Filter config ────────────────────────────────────────────────────────────

type SellerFilter = 'all' | 'no_reply' | 'replied' | 'with_price'

const FILTER_OPTIONS: { value: SellerFilter; label: string }[] = [
  { value: 'all',       label: 'Όλα' },
  { value: 'no_reply',  label: 'Χωρίς απάντηση' },
  { value: 'replied',   label: 'Με απάντηση' },
  { value: 'with_price', label: 'Με τιμή' },
]

function matchesFilter(conv: RequestConversation, f: SellerFilter): boolean {
  if (f === 'all')        return true
  if (f === 'no_reply')   return !conv.hasSellerReply && !conv.hasPriceSent
  if (f === 'replied')    return conv.hasSellerReply
  if (f === 'with_price') return conv.hasPriceSent
  return true
}

// ─── Conversation card ────────────────────────────────────────────────────────

function ConversationCard({ conv }: { conv: RequestConversation }) {
  const { label: statusLabel, variant: statusVariant } = SELLER_STATUS_CONFIG[conv.status]

  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-4">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <span className="text-sm font-semibold text-slate-900 truncate">{conv.buyerCompany}</span>
        <span className="text-xs text-slate-400 flex-shrink-0">{formatDate(conv.lastMessageAt)}</span>
      </div>

      {/* Part info */}
      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
        <span className="text-xs text-slate-700 font-medium">{conv.partName}</span>
        <span className="text-slate-300">·</span>
        <span className="text-xs text-slate-400 font-mono">{conv.partSku}</span>
      </div>

      {/* Last message preview */}
      <p className="text-xs text-slate-500 italic line-clamp-1 mb-2">&ldquo;{conv.lastMessage}&rdquo;</p>

      {/* Badges row */}
      <div className="flex items-center gap-1.5 flex-wrap mb-3">
        <Badge variant={statusVariant}>{statusLabel}</Badge>
        {conv.hasPriceSent && (
          <Badge variant="success">Τιμή στάλθηκε</Badge>
        )}
        {conv.hasSellerReply && (
          <Badge variant="brand">Απάντηση</Badge>
        )}
      </div>

      {/* CTA */}
      <Link
        href={ROUTES.SELLER.ORDER_DETAIL(conv.requestId)}
        className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
      >
        Άνοιγμα αιτήματος
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SellerChatsPage() {
  const [activeFilter, setActiveFilter] = useState<SellerFilter>('all')

  const allConversations = getRequestConversations()
  const filtered = allConversations.filter((c) => matchesFilter(c, activeFilter))

  return (
    <PageContainer narrow className="pb-24 lg:pb-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900 mb-1">Μηνύματα</h1>
        <p className="text-sm text-slate-500">Συζητήσεις με αγοραστές για αιτήματα ανταλλακτικών.</p>
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 mb-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {FILTER_OPTIONS.map((opt) => (
          <FilterChip
            key={opt.value}
            label={opt.label}
            selected={activeFilter === opt.value}
            onClick={() => setActiveFilter(opt.value)}
          />
        ))}
      </div>

      {/* Count */}
      <p className="text-xs text-slate-500 mb-3">
        {filtered.length === allConversations.length
          ? `${allConversations.length} συζητήσεις`
          : `${filtered.length} από ${allConversations.length} συζητήσεις`}
      </p>

      {/* List or empty state */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl py-14 text-center">
          <p className="text-sm font-medium text-slate-600 mb-1">Δεν υπάρχουν μηνύματα</p>
          <p className="text-xs text-slate-400 mb-4">Οι συζητήσεις από αιτήματα θα εμφανίζονται εδώ.</p>
          {activeFilter !== 'all' && (
            <button type="button" onClick={() => setActiveFilter('all')} className="text-xs font-medium text-blue-600 hover:text-blue-700">
              Καθαρισμός φίλτρου
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((conv) => (
            <ConversationCard key={conv.id} conv={conv} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
