'use client'

import { useState } from 'react'
import { getCurrentSellerId } from '@/lib/data/seller'
import { getSellerChats } from '@/lib/data/chats'
import { SearchInput } from '@/components/forms/search-input'
import { FilterChip } from '@/components/forms/filter-chip'
import { ChatThreadList } from '@/components/chats/chat-thread-list'
import { ChatPanel } from '@/components/chats/chat-panel'
import { cn, formatOrderNumber } from '@/lib/utils'
import type { ChatThread } from '@/lib/data/chats'

// ─── Filter config ────────────────────────────────────────────────────────────

type Filter = 'all' | 'unread' | 'orders' | 'marketplace' | 'closed'

const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Όλες' },
  { value: 'unread', label: 'Αδιάβαστες' },
  { value: 'orders', label: 'Παραγγελίες' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'closed', label: 'Κλειστές' },
]

// ─── Empty panel state ────────────────────────────────────────────────────────

function EmptyPanel() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-3">
        <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-slate-600">Επίλεξε συνομιλία</p>
      <p className="text-xs text-slate-400 mt-1">Επίλεξε μια συνομιλία από τη λίστα για να τη δεις</p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SellerChatsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const sellerId = getCurrentSellerId()
  const allThreads = getSellerChats(sellerId)
  const totalUnread = allThreads.reduce((sum, t) => sum + t.unreadCountSeller, 0)

  const filtered = allThreads.filter((t: ChatThread) => {
    if (filter === 'unread' && t.unreadCountSeller === 0) return false
    if (filter === 'orders' && t.source !== 'order') return false
    if (filter === 'marketplace' && t.source !== 'marketplace') return false
    if (filter === 'closed' && t.status !== 'closed') return false
    if (search.trim()) {
      const q = search.toLowerCase()
      const matchesBuyer = t.buyerName.toLowerCase().includes(q)
      const matchesPart = t.partName.toLowerCase().includes(q)
      const matchesOrder = t.orderId ? formatOrderNumber(t.orderId).includes(q) : false
      if (!matchesBuyer && !matchesPart && !matchesOrder) return false
    }
    return true
  })

  const selectedThread = selectedId ? allThreads.find((t) => t.id === selectedId) ?? null : null

  return (
    // Full-height layout: 100dvh minus topbar (3.5rem) minus mobile nav (4rem)
    <div className="flex h-[calc(100dvh-7.5rem)] lg:h-[calc(100dvh-3.5rem)] overflow-hidden">
      {/* Thread list — hidden on mobile when chat is open */}
      <div className={cn(
        'flex flex-col w-full lg:w-72 lg:flex-shrink-0 lg:border-r lg:border-slate-200 overflow-hidden',
        selectedThread ? 'hidden lg:flex' : 'flex'
      )}>
        {/* List header */}
        <div className="px-4 pt-4 pb-3 border-b border-slate-200 bg-white flex-shrink-0">
          <div className="mb-3">
            <h1 className="text-lg font-semibold text-slate-900">Συνομιλίες</h1>
            {totalUnread > 0 && (
              <p className="text-xs text-slate-500 mt-0.5">{totalUnread} αδιάβαστα</p>
            )}
          </div>
          <SearchInput
            placeholder="Αγοραστής, ανταλλακτικό, παραγγελία..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch('')}
            className="mb-3"
          />
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {FILTER_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.value}
                label={opt.label}
                selected={filter === opt.value}
                onClick={() => setFilter(opt.value)}
              />
            ))}
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto bg-white">
          <ChatThreadList
            threads={filtered}
            selectedId={selectedId}
            onSelect={setSelectedId}
            role="seller"
          />
        </div>
      </div>

      {/* Chat panel — hidden on mobile when no chat selected */}
      <div className={cn(
        'flex-1 overflow-hidden',
        selectedThread ? 'flex flex-col' : 'hidden lg:flex lg:flex-col'
      )}>
        {selectedThread ? (
          <ChatPanel
            key={selectedThread.id}
            thread={selectedThread}
            currentUserId={sellerId}
            currentRole="seller"
            onBack={() => setSelectedId(null)}
          />
        ) : (
          <EmptyPanel />
        )}
      </div>
    </div>
  )
}
