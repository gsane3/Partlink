'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getSellerInventory, getSellerOrders } from '@/lib/data/seller'
import { PartCard } from '@/components/inventory/part-card'
import { ConditionBadge } from '@/components/inventory/condition-badge'
import { PAYMENT_METHOD_LABELS, DELIVERY_METHOD_LABELS, CATEGORIES } from '@/lib/constants'
import { ROUTES } from '@/lib/routes'
import { formatOrderNumber } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Part, Order } from '@/types'
import { findVehicleImport } from './mock-vehicle-imports'
import type { VehicleImport, GeneratedPart } from '@/components/inventory/vin-import/types'

// ─── State ────────────────────────────────────────────────────────────────────

type ScanState =
  | { kind: 'idle' }
  | { kind: 'found_dispatch'; part: Part; order: Order }
  | { kind: 'found_stock'; part: Part }
  | { kind: 'error'; message: string }
  | { kind: 'success_dispatch'; part: Part; order: Order }
  | { kind: 'success_stock'; part: Part; action: 'sold' | 'reprint' }
  | { kind: 'found_vehicle'; vehicleImport: VehicleImport }
  | { kind: 'success_vehicle_part_removed'; vehicleImport: VehicleImport; partName: string; publishedToMarketplace: boolean }

type ParsedInput =
  | { type: 'part'; sku: string }
  | { type: 'vehicle'; vehicleCode: string }

// ─── Data lookup ──────────────────────────────────────────────────────────────

const SELLER_ID = 'seller-001'

function getCategoryName(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.name ?? id
}

function parseInput(raw: string): ParsedInput {
  const t = raw.trim()
  // partlink:vehicle:seller-001:VEH-001-8405 — vehicle QR from VIN Import
  if (t.toLowerCase().startsWith('partlink:vehicle:')) {
    const segs = t.split(':')
    return { type: 'vehicle', vehicleCode: (segs[3] ?? '').toUpperCase() }
  }
  // partlink:seller-001:partId:SKU — part QR from Add Part
  if (t.toLowerCase().startsWith('partlink:')) {
    const segs = t.split(':')
    return { type: 'part', sku: (segs[3] ?? '').toUpperCase() }
  }
  const upper = t.toUpperCase()
  // VEH-XXX-XXXX — short vehicle code entered manually
  if (upper.startsWith('VEH-')) {
    return { type: 'vehicle', vehicleCode: upper }
  }
  return { type: 'part', sku: upper }
}

function doScan(raw: string): ScanState {
  if (!raw.trim()) {
    return { kind: 'error', message: 'Συμπλήρωσε SKU ή κωδικό QR' }
  }

  const parsed = parseInput(raw)

  if (parsed.type === 'vehicle') {
    const vehicleImport = findVehicleImport(parsed.vehicleCode)
    if (!vehicleImport) {
      return { kind: 'error', message: `Δεν βρέθηκε εισαγμένο όχημα: ${parsed.vehicleCode}` }
    }
    return { kind: 'found_vehicle', vehicleImport }
  }

  // Part scan — existing behavior
  const part = getSellerInventory(SELLER_ID).find((p) => p.sku === parsed.sku)
  if (!part) {
    return { kind: 'error', message: `Δεν βρέθηκε ανταλλακτικό: ${parsed.sku}` }
  }
  const order = getSellerOrders(SELLER_ID).find(
    (o) =>
      (o.status === 'pending' || o.status === 'confirmed') &&
      o.items.some((i) => i.partId === part.id)
  )
  return order
    ? { kind: 'found_dispatch', part, order }
    : { kind: 'found_stock', part }
}

// ─── Demo shortcuts ───────────────────────────────────────────────────────────

const DEMO_PART_SCANS = [
  { sku: 'PL-001-0002', label: 'Φανάρι εμπρός W204', sub: 'Αίτημα σε αναμονή' },
  { sku: 'PL-001-0003', label: 'ECU Golf 5 1.9 TDI', sub: 'Αίτημα επιβεβαιωμένο' },
  { sku: 'PL-001-0004', label: 'Αερόσακος Astra H', sub: 'Χωρίς εκκρεμές αίτημα' },
]

const DEMO_VEHICLE_SCANS = [
  { code: 'VEH-001-8405', label: 'Opel Astra 2010', sub: 'QR αυτοκινήτου' },
]

// ─── Shared: order dispatch card ──────────────────────────────────────────────

function OrderDispatchCard({ order }: { order: Order }) {
  const orderId = formatOrderNumber(order.id)
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-amber-100 border-b border-amber-200 flex items-center gap-2">
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
        </span>
        <span className="text-sm font-semibold text-amber-900">Εκκρεμής αποστολή</span>
      </div>
      <div className="px-4 py-3 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500">Κωδικός</span>
          <span className="text-sm font-semibold text-slate-900">#{orderId}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500">Σύνολο</span>
          <span className="text-sm font-bold text-slate-900">€{order.totalAmount}</span>
        </div>
        {order.payment && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Πληρωμή</span>
            <span className="text-sm text-slate-900">{PAYMENT_METHOD_LABELS[order.payment.method]}</span>
          </div>
        )}
        {order.shipment && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">Αποστολή</span>
            <span className="text-sm text-slate-900">{DELIVERY_METHOD_LABELS[order.shipment.method]}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Shared: scan success banner ──────────────────────────────────────────────

function ScanSuccessBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 mb-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
      <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
      <p className="text-sm font-medium text-green-800">{message}</p>
    </div>
  )
}

// ─── Screen: Idle ─────────────────────────────────────────────────────────────

function IdleScreen({
  input,
  setInput,
  onScan,
}: {
  input: string
  setInput: (v: string) => void
  onScan: (raw?: string) => void
}) {
  return (
    <>
      {/* Camera viewfinder placeholder */}
      <div
        className="relative w-full bg-slate-900 rounded-2xl overflow-hidden mb-5"
        style={{ aspectRatio: '4/3' }}
      >
        <span className="absolute top-6 left-6 w-8 h-8 border-t-[3px] border-l-[3px] border-white/70 rounded-tl-sm" />
        <span className="absolute top-6 right-6 w-8 h-8 border-t-[3px] border-r-[3px] border-white/70 rounded-tr-sm" />
        <span className="absolute bottom-6 left-6 w-8 h-8 border-b-[3px] border-l-[3px] border-white/70 rounded-bl-sm" />
        <span className="absolute bottom-6 right-6 w-8 h-8 border-b-[3px] border-r-[3px] border-white/70 rounded-br-sm" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <svg className="w-16 h-16 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.9} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          <p className="text-sm font-medium text-white/60">Στοχεύστε στο QR label</p>
          <p className="text-xs text-white/30">Κάμερα μη διαθέσιμη σε αυτή την έκδοση</p>
        </div>
      </div>

      {/* Manual entry */}
      <div className="mb-6">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
          Μη αυτόματη εισαγωγή
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && onScan()}
            placeholder="π.χ. PL-001-0002 ή VEH-001-8405"
            className="flex-1 h-11 px-3 text-sm font-mono bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button variant="secondary" onClick={() => onScan()} className="flex-shrink-0 h-11">
            Αναζήτηση
          </Button>
        </div>
      </div>

      {/* Demo — parts */}
      <div className="mb-5">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
          Demo ανταλλακτικά
        </p>
        <div className="space-y-2">
          {DEMO_PART_SCANS.map((demo) => (
            <button
              key={demo.sku}
              type="button"
              onClick={() => onScan(demo.sku)}
              className="w-full flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3.5 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900">{demo.label}</p>
                <p className="text-xs font-mono text-slate-400 mt-0.5">{demo.sku}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-slate-500">{demo.sub}</span>
                <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Demo — vehicles (VIN Import) */}
      <div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
          Demo αυτοκίνητα (VIN Import)
        </p>
        <div className="space-y-2">
          {DEMO_VEHICLE_SCANS.map((demo) => (
            <button
              key={demo.code}
              type="button"
              onClick={() => onScan(demo.code)}
              className="w-full flex items-center justify-between gap-3 bg-white border border-blue-200 rounded-xl px-4 py-3.5 hover:bg-blue-50 active:bg-blue-100 transition-colors text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900">{demo.label}</p>
                  <p className="text-xs font-mono text-blue-500 mt-0.5">{demo.code}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-slate-500">{demo.sub}</span>
                <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

// ─── Screen: Found — dispatch ─────────────────────────────────────────────────

function DispatchScreen({
  part,
  order,
  onConfirm,
  onBack,
}: {
  part: Part
  order: Order
  onConfirm: () => void
  onBack: () => void
}) {
  return (
    <>
      <ScanSuccessBanner message="QR αναγνωρίστηκε — εκκρεμής αποστολή" />

      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
        Ανταλλακτικό
      </p>
      <PartCard part={part} />

      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2 mt-4">
        Παραγγελία
      </p>
      <OrderDispatchCard order={order} />

      <div className="fixed bottom-16 lg:bottom-0 left-0 lg:left-60 right-0 z-30 bg-white border-t border-slate-200 px-4 py-3 flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-shrink-0 gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Πίσω
        </Button>
        <Button variant="primary" fullWidth onClick={onConfirm} className="h-11 gap-1.5">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Επιβεβαίωση αποστολής
        </Button>
      </div>
    </>
  )
}

// ─── Screen: Found — stock (no order) ────────────────────────────────────────

function StockScreen({
  part,
  onAction,
  onBack,
}: {
  part: Part
  onAction: (action: 'sold' | 'reprint') => void
  onBack: () => void
}) {
  return (
    <>
      <ScanSuccessBanner message="QR αναγνωρίστηκε — χωρίς εκκρεμή αποστολή" />

      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
        Ανταλλακτικό
      </p>
      <PartCard part={part} />

      <div className="mt-5 space-y-2.5">
        <Link
          href={ROUTES.SELLER.PART_DETAIL(part.id)}
          className="w-full h-12 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 active:bg-slate-100 transition-colors"
        >
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Προβολή ανταλλακτικού
        </Link>

        <button
          type="button"
          onClick={() => onAction('reprint')}
          className="w-full h-12 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 active:bg-slate-100 transition-colors"
        >
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Εκτύπωση QR label
        </button>

        <button
          type="button"
          onClick={() => onAction('sold')}
          className="w-full h-12 border-2 border-red-200 text-red-600 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-red-50 active:bg-red-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Σήμανση ως πωλημένο
        </button>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="w-full mt-5 text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1.5 py-2 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Σκάναρε άλλο QR
      </button>
    </>
  )
}

// ─── Screen: Found — vehicle ──────────────────────────────────────────────────
// Shown after scanning a vehicle QR (partlink:vehicle:seller-001:VEH-001-XXXX).
// One QR per car; seller picks which part was physically removed.

function VehiclePartRow({
  part,
  onRemove,
}: {
  part: GeneratedPart
  onRemove: () => void
}) {
  return (
    <div className="px-4 py-4 border-b border-slate-100 last:border-0">
      {/* Part info */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900 leading-tight">{part.partName}</p>
          <p className="text-xs text-slate-400 mt-0.5">{getCategoryName(part.categoryId)}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <ConditionBadge condition={part.condition} />
          <span className="text-sm font-semibold text-slate-900 tabular-nums">€{part.price}</span>
        </div>
      </div>

      {/* Single action — no per-part QR label in VIN Import */}
      <button
        type="button"
        onClick={onRemove}
        className="w-full h-11 text-sm font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 active:bg-amber-200 transition-colors"
      >
        Βγήκε από το αμάξι
      </button>
    </div>
  )
}

function VehicleScreen({
  vehicleImport,
  onPartRemoved,
  onBack,
}: {
  vehicleImport: VehicleImport
  onPartRemoved: (part: GeneratedPart) => void
  onBack: () => void
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const { vehicle, vehicleCode, parts } = vehicleImport

  const filteredParts = searchQuery.trim()
    ? parts.filter((p) => p.partName.toLowerCase().includes(searchQuery.toLowerCase()))
    : parts

  const publishedCount = parts.filter((p) => p.publishToMarketplace).length

  return (
    <>
      <ScanSuccessBanner message="QR αυτοκινήτου αναγνωρίστηκε" />

      {/* Vehicle card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-4">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Στοιχεία οχήματος</p>
          <p className="text-xs font-mono font-semibold text-slate-500">{vehicleCode}</p>
        </div>
        <div className="px-4 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Μάρκα / Μοντέλο</span>
            <span className="text-sm font-semibold text-slate-900">{vehicle.make} {vehicle.model}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Έτος</span>
            <span className="text-sm font-semibold text-slate-900">{vehicle.year}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Κινητήρας</span>
            <span className="text-sm font-semibold text-slate-900 font-mono">{vehicle.engine} · {vehicle.fuel}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">VIN</span>
            <span className="text-xs font-mono text-slate-600">{vehicle.vin}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { value: parts.length, label: 'Σύνολο' },
          { value: parts.length, label: 'Στο αυτ.' },
          { value: 0, label: 'Βγήκε' },
          { value: publishedCount, label: 'Δημοσ.' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-2.5 text-center">
            <p className="text-xl font-bold text-slate-900 tabular-nums">{stat.value}</p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Explanation */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4">
        <p className="text-sm text-blue-800">
          Διάλεξε ποιο ανταλλακτικό βγήκε από το αυτοκίνητο.
        </p>
      </div>

      {/* Search */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Αναζήτηση ανταλλακτικού..."
        className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
      />

      {/* Parts list */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-5">
        {filteredParts.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <p className="text-sm text-slate-500">Δεν βρέθηκαν αποτελέσματα</p>
          </div>
        ) : (
          filteredParts.map((part) => (
            <VehiclePartRow
              key={part.sku}
              part={part}
              onRemove={() => onPartRemoved(part)}
            />
          ))
        )}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="w-full text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1.5 py-2 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Σκάναρε άλλο QR
      </button>
    </>
  )
}

// ─── Screen: Success — dispatch confirmed ─────────────────────────────────────

function SuccessDispatchScreen({
  order,
  onReset,
}: {
  part: Part
  order: Order
  onReset: () => void
}) {
  const orderId = formatOrderNumber(order.id)
  const updates = [
    { label: 'Κατάσταση αιτήματος', value: 'Απεστάλη', color: 'text-green-700' },
    { label: 'Κατάσταση ανταλλακτικού', value: 'Απεστάλη', color: 'text-blue-700' },
    { label: 'Marketplace', value: 'Αφαιρέθηκε (demo)', color: 'text-slate-600' },
    { label: 'Stock', value: 'Ενημερώθηκε (demo)', color: 'text-slate-600' },
  ]

  return (
    <div className="pt-4 text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-slate-900">Αποστολή επιβεβαιώθηκε</h2>
      <p className="text-sm text-slate-500 mt-1.5">Αίτημα #{orderId} — επόμενο βήμα αποστολής για το demo.</p>

      <div className="mt-6 bg-white border border-slate-200 rounded-xl overflow-hidden text-left mb-6">
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Ενημερώσεις</p>
        </div>
        <div className="divide-y divide-slate-100">
          {updates.map((row) => (
            <div key={row.label} className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-slate-600">{row.label}</span>
              <span className={`text-sm font-medium ${row.color}`}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        <button
          type="button"
          onClick={onReset}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          Σκάναρε άλλο QR
        </button>
        <Link href={ROUTES.SELLER.ORDER_DETAIL(order.id)} className="w-full h-11 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 active:bg-slate-100 transition-colors">
          Δες αίτημα
        </Link>
        <Link href={ROUTES.SELLER.INVENTORY} className="block text-center text-sm text-slate-500 hover:text-slate-700 py-2 transition-colors">
          Επιστροφή στο stock
        </Link>
      </div>
    </div>
  )
}

// ─── Screen: Success — stock action ──────────────────────────────────────────

function SuccessStockScreen({
  part,
  action,
  onReset,
}: {
  part: Part
  action: 'sold' | 'reprint'
  onReset: () => void
}) {
  const isSold = action === 'sold'
  return (
    <div className="pt-4 text-center">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isSold ? 'bg-blue-100' : 'bg-slate-100'}`}>
        {isSold ? (
          <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
        )}
      </div>
      <h2 className="text-xl font-bold text-slate-900">
        {isSold ? 'Σημάνθηκε ως πωλημένο' : 'QR label εκτυπώθηκε'}
      </h2>
      <p className="text-sm text-slate-500 mt-1.5">
        {isSold ? `${part.partName} · Κατάσταση: Πωλήθηκε` : `${part.partName} · ${part.sku}`}
      </p>

      <div className="mt-8 space-y-2.5">
        <button type="button" onClick={onReset} className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors">
          Σκάναρε άλλο QR
        </button>
        <Link href={ROUTES.SELLER.INVENTORY} className="block text-center text-sm text-slate-500 hover:text-slate-700 py-2 transition-colors">
          Επιστροφή στο stock
        </Link>
      </div>
    </div>
  )
}

// ─── Screen: Success — vehicle part removed ───────────────────────────────────
// Shown after the seller taps "Βγήκε από το αμάξι" for a specific linked part.

function SuccessVehiclePartRemovedScreen({
  vehicleImport,
  partName,
  publishedToMarketplace,
  onReset,
}: {
  vehicleImport: VehicleImport
  partName: string
  publishedToMarketplace: boolean
  onReset: () => void
}) {
  const { vehicle, vehicleCode } = vehicleImport

  const updates = [
    { label: 'Ανταλλακτικό', value: 'Εκτός αυτοκινήτου', color: 'text-amber-700' },
    { label: 'Stock', value: 'Ενημερώθηκε (demo)', color: 'text-slate-600' },
    {
      label: 'Marketplace',
      value: publishedToMarketplace ? 'Παραμένει διαθέσιμο' : 'Δεν ήταν δημοσιευμένο',
      color: publishedToMarketplace ? 'text-green-700' : 'text-slate-500',
    },
  ]

  return (
    <div className="pt-4 text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-slate-900">Το ανταλλακτικό βγήκε από το αυτοκίνητο</h2>
      <p className="text-sm font-medium text-slate-700 mt-1.5">{partName}</p>
      <p className="text-xs text-slate-500 mt-0.5">
        {vehicle.make} {vehicle.model} {vehicle.year} · {vehicleCode}
      </p>

      <div className="mt-6 bg-white border border-slate-200 rounded-xl overflow-hidden text-left mb-6">
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Ενημερώσεις</p>
        </div>
        <div className="divide-y divide-slate-100">
          {updates.map((row) => (
            <div key={row.label} className="flex items-center justify-between px-4 py-3">
              <span className="text-sm text-slate-600">{row.label}</span>
              <span className={`text-sm font-medium ${row.color}`}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        <button
          type="button"
          onClick={onReset}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          Σκάναρε άλλο QR
        </button>
        <Link
          href={ROUTES.SELLER.INVENTORY}
          className="block text-center text-sm text-slate-500 hover:text-slate-700 py-2 transition-colors"
        >
          Επιστροφή στο stock
        </Link>
      </div>
    </div>
  )
}

// ─── Screen: Error ────────────────────────────────────────────────────────────

function ErrorScreen({ message, onReset }: { message: string; onReset: () => void }) {
  return (
    <div className="pt-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>

      <h2 className="text-lg font-bold text-slate-900">Δεν αναγνωρίστηκε το QR</h2>

      <div className="mt-3 mx-auto max-w-xs bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-left">
        <p className="text-sm text-red-700">{message}</p>
      </div>

      <p className="text-xs text-slate-400 mt-3">
        Δεν αναγνωρίστηκε το QR. Βεβαιώσου ότι είναι καθαρό και δοκίμασε ξανά.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="mt-6 w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Δοκίμασε ξανά
      </button>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function QRScanScreen() {
  const [state, setState] = useState<ScanState>({ kind: 'idle' })
  const [input, setInput] = useState('')

  const handleScan = (raw?: string) => {
    const val = raw ?? input
    const result = doScan(val)
    setState(result)
    if (raw) setInput(raw)
  }

  const reset = () => {
    setState({ kind: 'idle' })
    setInput('')
  }

  return (
    <div className="px-4 py-5 pb-36 lg:pb-12 max-w-lg mx-auto">
      {state.kind === 'idle' && (
        <IdleScreen input={input} setInput={setInput} onScan={handleScan} />
      )}

      {state.kind === 'found_dispatch' && (
        <DispatchScreen
          part={state.part}
          order={state.order}
          onConfirm={() => setState({ kind: 'success_dispatch', part: state.part, order: state.order })}
          onBack={reset}
        />
      )}

      {state.kind === 'found_stock' && (
        <StockScreen
          part={state.part}
          onAction={(action) => setState({ kind: 'success_stock', part: state.part, action })}
          onBack={reset}
        />
      )}

      {state.kind === 'found_vehicle' && (
        <VehicleScreen
          vehicleImport={state.vehicleImport}
          onPartRemoved={(part) =>
            setState({
              kind: 'success_vehicle_part_removed',
              vehicleImport: state.vehicleImport,
              partName: part.partName,
              publishedToMarketplace: part.publishToMarketplace,
            })
          }
          onBack={reset}
        />
      )}

      {state.kind === 'success_dispatch' && (
        <SuccessDispatchScreen part={state.part} order={state.order} onReset={reset} />
      )}

      {state.kind === 'success_stock' && (
        <SuccessStockScreen part={state.part} action={state.action} onReset={reset} />
      )}

      {state.kind === 'success_vehicle_part_removed' && (
        <SuccessVehiclePartRemovedScreen
          vehicleImport={state.vehicleImport}
          partName={state.partName}
          publishedToMarketplace={state.publishedToMarketplace}
          onReset={reset}
        />
      )}

      {state.kind === 'error' && (
        <ErrorScreen message={state.message} onReset={reset} />
      )}
    </div>
  )
}
