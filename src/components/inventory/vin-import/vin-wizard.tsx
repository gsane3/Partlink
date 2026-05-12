'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import { cn, generateSKU } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PriceInput } from '@/components/forms/price-input'
import { CATEGORIES, CONDITION_LABELS } from '@/lib/constants'
import { ROUTES } from '@/lib/routes'
import type { PartCondition } from '@/types'
import { CONDITIONS } from '@/components/inventory/add-part/constants'
import { decodeVin, CAR_PARTS_TEMPLATE } from './mock-vehicles'
import type { DecodedVehicle, GeneratedPart } from './types'

// ─── Constants ────────────────────────────────────────────────────────────────

const STEP_LABELS = ['Φωτογραφία', 'VIN', 'Όχημα', 'Επιλογή', 'Τιμές', 'Έλεγχος'] as const

const DEMO_VINS = [
  { vin: 'WBA3A5C56DF589213', label: 'BMW E90 320d 2013' },
  { vin: 'VSSZZZ6KZ7R125943', label: 'VW Golf 5 1.9 TDI 2007' },
  { vin: 'WDD2040022F123456', label: 'Mercedes C-Class W204 2015' },
  { vin: 'W0L000051T2123456', label: 'Opel Astra H 1.6 2005' },
]

function getCategoryName(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.name ?? id
}

// ─── Progress indicator ───────────────────────────────────────────────────────

function StepProgress({ step }: { step: number }) {
  return (
    <div className="mb-6">
      <div className="flex gap-1 mb-2">
        {STEP_LABELS.map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors duration-300',
              i + 1 <= step ? 'bg-blue-600' : 'bg-slate-200'
            )}
          />
        ))}
      </div>
      <p className="text-xs text-slate-500">
        Βήμα {step} από {STEP_LABELS.length} — {STEP_LABELS[step - 1]}
      </p>
    </div>
  )
}

// ─── Shared: error banner ─────────────────────────────────────────────────────

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mt-5 flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
      <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p className="text-sm text-red-700">{message}</p>
    </div>
  )
}

// ─── Step 1: Car photo ────────────────────────────────────────────────────────

function CarPhotoStep({
  photo,
  onSet,
  onClear,
}: {
  photo: string | null
  onSet: (url: string) => void
  onClear: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onSet(URL.createObjectURL(file))
    e.target.value = ''
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        onChange={handleChange}
      />

      {!photo ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-colors mb-4"
          style={{ aspectRatio: '16/9' }}
        >
          <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div className="text-center px-4">
            <p className="text-sm font-medium text-slate-600">Τράβηξε φωτογραφία του αυτοκινήτου</p>
            <p className="text-xs text-slate-400 mt-0.5">Προαιρετικό</p>
          </div>
        </button>
      ) : (
        <div className="relative rounded-2xl overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-3 right-3 bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-black/75 transition-colors"
          >
            Αλλαγή
          </button>
        </div>
      )}

      <p className="text-center text-xs text-slate-400">
        Μπορείς να παραλείψεις αυτό το βήμα — δεν είναι υποχρεωτικό
      </p>
    </div>
  )
}

// ─── Step 2: VIN entry ────────────────────────────────────────────────────────

function VinEntryStep({
  vin,
  onChange,
}: {
  vin: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      {/* Scanner placeholder */}
      <div
        className="relative w-full bg-slate-900 rounded-2xl overflow-hidden mb-6"
        style={{ aspectRatio: '4/3' }}
      >
        <span className="absolute top-6 left-6 w-8 h-8 border-t-[3px] border-l-[3px] border-white/70 rounded-tl-sm" />
        <span className="absolute top-6 right-6 w-8 h-8 border-t-[3px] border-r-[3px] border-white/70 rounded-tr-sm" />
        <span className="absolute bottom-6 left-6 w-8 h-8 border-b-[3px] border-l-[3px] border-white/70 rounded-bl-sm" />
        <span className="absolute bottom-6 right-6 w-8 h-8 border-b-[3px] border-r-[3px] border-white/70 rounded-br-sm" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <svg className="w-14 h-14 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.9} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          <p className="text-sm font-medium text-white/60">Σκάναρε barcode VIN</p>
          <p className="text-xs text-white/30">Κάμερα μη διαθέσιμη σε αυτή την έκδοση</p>
        </div>
      </div>

      {/* Manual entry */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-slate-700">Εισαγωγή VIN χειροκίνητα</label>
          <span className={cn(
            'text-xs font-mono font-semibold tabular-nums',
            vin.length === 17 ? 'text-green-600' : 'text-slate-400'
          )}>
            {vin.length}/17
          </span>
        </div>
        <Input
          value={vin}
          onChange={(e) => onChange(e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, ''))}
          placeholder="π.χ. WBA3A5C56DF589213"
          className={cn(
            'font-mono text-base h-12 tracking-widest uppercase',
            vin.length === 17 ? 'border-green-400 focus:ring-green-500' : ''
          )}
          maxLength={17}
          autoCapitalize="characters"
          spellCheck={false}
        />
      </div>

      {/* Demo VIN chips */}
      <div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
          Demo — Δοκίμασε με:
        </p>
        <div className="space-y-1.5">
          {DEMO_VINS.map((d) => (
            <button
              key={d.vin}
              type="button"
              onClick={() => onChange(d.vin)}
              className="w-full flex items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
            >
              <div>
                <p className="text-sm font-medium text-slate-800">{d.label}</p>
                <p className="text-xs font-mono text-slate-400 mt-0.5">{d.vin}</p>
              </div>
              <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Step 3: Vehicle confirmation ─────────────────────────────────────────────

function VehicleConfirmStep({ vehicle }: { vehicle: DecodedVehicle }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-green-800">VIN αναγνωρίστηκε</p>
          <p className="text-xs font-mono text-green-600 mt-0.5">{vehicle.vin}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-5">
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Στοιχεία οχήματος</p>
        </div>
        <div className="px-4 py-4 space-y-3.5">
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
            <span className="text-sm font-semibold text-slate-900 font-mono">{vehicle.engine}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Καύσιμο</span>
            <span className="text-sm font-semibold text-slate-900">{vehicle.fuel}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-500 text-center">
        Σωστό αυτοκίνητο; Πάτα <strong>Επιβεβαίωση</strong> για να συνεχίσεις.
      </p>
    </div>
  )
}

// ─── Step 4: Select parts ─────────────────────────────────────────────────────

function PartsSelectStep({
  vehicle,
  selectedIds,
  onToggle,
  onSelectAll,
  onSelectNone,
}: {
  vehicle: DecodedVehicle
  selectedIds: string[]
  onToggle: (id: string) => void
  onSelectAll: () => void
  onSelectNone: () => void
}) {
  return (
    <div>
      {/* Vehicle badge */}
      <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2.5 mb-4">
        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
        <span className="text-sm font-medium text-slate-700">
          {vehicle.make} {vehicle.model} {vehicle.year}
        </span>
      </div>

      {/* Select all / none */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-900">{selectedIds.length}</span>
          {' '}από {CAR_PARTS_TEMPLATE.length} επιλεγμένα
        </p>
        <div className="flex items-center gap-3">
          <button type="button" onClick={onSelectAll} className="text-xs font-medium text-blue-600 hover:text-blue-700">
            Όλα
          </button>
          <span className="text-slate-200">|</span>
          <button type="button" onClick={onSelectNone} className="text-xs font-medium text-slate-500 hover:text-slate-700">
            Καμία
          </button>
        </div>
      </div>

      {/* Parts list */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
        {CAR_PARTS_TEMPLATE.map((part) => {
          const isSelected = selectedIds.includes(part.id)
          return (
            <button
              key={part.id}
              type="button"
              onClick={() => onToggle(part.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors',
                isSelected ? 'bg-blue-50 hover:bg-blue-50/80 active:bg-blue-100' : 'hover:bg-slate-50 active:bg-slate-100'
              )}
            >
              <div className={cn(
                'w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors',
                isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'
              )}>
                {isSelected && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-medium', isSelected ? 'text-slate-900' : 'text-slate-500')}>
                  {part.partName}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{getCategoryName(part.categoryId)}</p>
              </div>
              <p className={cn('text-sm font-semibold flex-shrink-0 tabular-nums', isSelected ? 'text-slate-900' : 'text-slate-400')}>
                €{part.suggestedPrice}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Step 5: Condition and pricing ────────────────────────────────────────────

function PartsPricingStep({
  selectedIds,
  globalCondition,
  onGlobalCondition,
  prices,
  onPrice,
  publishAll,
  onPublishAll,
}: {
  selectedIds: string[]
  globalCondition: PartCondition | ''
  onGlobalCondition: (c: PartCondition | '') => void
  prices: Record<string, string>
  onPrice: (id: string, price: string) => void
  publishAll: boolean
  onPublishAll: (v: boolean) => void
}) {
  const selectedParts = CAR_PARTS_TEMPLATE.filter((p) => selectedIds.includes(p.id))

  return (
    <div className="space-y-6">
      {/* Global condition */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-1.5">
          Κατάσταση<span className="text-red-500 ml-0.5">*</span>
          <span className="font-normal text-slate-400 ml-1.5">— εφαρμόζεται σε όλα</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          {CONDITIONS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => onGlobalCondition(c.value)}
              className={cn(
                'h-11 px-3 rounded-lg text-sm border transition-colors',
                globalCondition === c.value
                  ? 'bg-blue-600 text-white border-blue-600 font-medium'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 active:bg-slate-100'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Per-part prices */}
      <div>
        <p className="text-sm font-medium text-slate-700 mb-2">
          Τιμή ανά ανταλλακτικό<span className="text-red-500 ml-0.5">*</span>
        </p>
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
          {selectedParts.map((part) => (
            <div key={part.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{part.partName}</p>
                <p className="text-xs text-slate-400">{getCategoryName(part.categoryId)}</p>
              </div>
              <div className="w-28 flex-shrink-0">
                <PriceInput
                  value={prices[part.id] ?? ''}
                  onChange={(e) => onPrice(part.id, e.target.value)}
                  placeholder="0"
                  className="h-10"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Publish toggle */}
      <button
        type="button"
        role="switch"
        aria-checked={publishAll}
        onClick={() => onPublishAll(!publishAll)}
        className={cn(
          'w-full flex items-center justify-between gap-4 p-4 rounded-xl border-2 transition-colors text-left',
          publishAll ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white'
        )}
      >
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900">Δημοσίευση στο marketplace</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {publishAll
              ? 'Όλα θα είναι ορατά σε αγοραστές άμεσα'
              : 'Αποθηκεύονται μόνο στο stock σου'}
          </p>
        </div>
        <div className={cn(
          'relative flex-shrink-0 w-11 h-6 rounded-full transition-colors',
          publishAll ? 'bg-blue-600' : 'bg-slate-300'
        )}>
          <div className={cn(
            'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-150',
            publishAll ? 'right-0.5' : 'left-0.5'
          )} />
        </div>
      </button>
    </div>
  )
}

// ─── Step 6: Review ───────────────────────────────────────────────────────────

function ReviewStep({
  vehicle,
  selectedIds,
  globalCondition,
  prices,
  publishAll,
}: {
  vehicle: DecodedVehicle
  selectedIds: string[]
  globalCondition: PartCondition | ''
  prices: Record<string, string>
  publishAll: boolean
}) {
  const selectedParts = CAR_PARTS_TEMPLATE.filter((p) => selectedIds.includes(p.id))
  const conditionLabel = globalCondition ? CONDITION_LABELS[globalCondition] : '—'
  const totalValue = selectedParts.reduce((sum, p) => sum + (parseFloat(prices[p.id] ?? '0') || 0), 0)

  return (
    <div className="space-y-4">
      {/* Vehicle */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Όχημα</p>
        </div>
        <div className="px-4 py-3.5">
          <p className="text-sm font-semibold text-slate-900">{vehicle.make} {vehicle.model} {vehicle.year}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {vehicle.engine} · {vehicle.fuel}
            <span className="ml-1 font-mono">{vehicle.vin}</span>
          </p>
        </div>
      </div>

      {/* Parts */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex items-start justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Ανταλλακτικά ({selectedParts.length})
          </p>
          <div className="text-right">
            <p className="text-[11px] font-semibold text-slate-500">{conditionLabel}</p>
            <p className="text-[11px] text-slate-400">{publishAll ? 'Δημοσιεύονται' : 'Μόνο stock'}</p>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {selectedParts.map((part) => (
            <div key={part.id} className="flex items-center justify-between px-4 py-3 gap-2">
              <p className="text-sm text-slate-800 truncate flex-1">{part.partName}</p>
              <p className="text-sm font-semibold text-slate-900 flex-shrink-0 tabular-nums">
                €{prices[part.id] || '—'}
              </p>
            </div>
          ))}
        </div>
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Σύνολο stock</p>
          <p className="text-sm font-bold text-slate-900 tabular-nums">€{totalValue.toLocaleString('el-GR')}</p>
        </div>
      </div>

      {/* Vehicle QR model note */}
      <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
        <svg className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-slate-500 leading-relaxed">
          Θα δημιουργηθεί ένα QR για το αυτοκίνητο. Τα ανταλλακτικά θα συνδεθούν κάτω από αυτό.
        </p>
      </div>
    </div>
  )
}

// ─── Step 7: Success ──────────────────────────────────────────────────────────

function SuccessStep({
  vehicle,
  parts,
  vehicleCode,
  vehicleQrValue,
  onReset,
}: {
  vehicle: DecodedVehicle
  parts: GeneratedPart[]
  vehicleCode: string
  vehicleQrValue: string
  onReset: () => void
}) {
  const publishedCount = parts.filter((p) => p.publishToMarketplace).length

  return (
    <div className="pt-4 pb-12">
      {/* Hero */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Η εισαγωγή ολοκληρώθηκε</h2>
        <p className="text-sm text-slate-500 mt-1">
          {vehicle.make} {vehicle.model} {vehicle.year}
        </p>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-900">{parts.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">στο stock</p>
          </div>
          {publishedCount > 0 && (
            <>
              <div className="w-px h-10 bg-slate-200" />
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{publishedCount}</p>
                <p className="text-xs text-slate-500 mt-0.5">στο marketplace</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Vehicle QR — one QR for the whole car */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-4 flex flex-col items-center">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-4">QR αυτοκινήτου</p>
        <div className="p-3 border border-slate-100 rounded-lg bg-white">
          <QRCodeSVG
            value={vehicleQrValue}
            size={160}
            level="M"
          />
        </div>
        <p className="text-xs font-mono text-slate-500 mt-3 tracking-wider">{vehicleCode}</p>
        <p className="text-xs text-slate-400 mt-0.5 text-center">
          {vehicle.make} {vehicle.model} {vehicle.year}
        </p>
      </div>

      {/* Helper copy */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3.5 mb-5">
        <p className="text-sm text-blue-800 leading-relaxed">
          Κόλλησε αυτό το QR στο αυτοκίνητο ή στη θέση του. Όταν αφαιρείς ανταλλακτικό, σκανάρεις αυτό το QR και επιλέγεις ποιο part βγήκε.
        </p>
      </div>

      {/* Parts summary — no per-part QR labels */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-6">
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Ανταλλακτικά στο stock ({parts.length})
          </p>
        </div>
        <div className="divide-y divide-slate-100">
          {parts.map((part) => (
            <div key={part.sku} className="flex items-center gap-3 px-4 py-3">
              <p className="text-sm font-medium text-slate-900 truncate flex-1">{part.partName}</p>
              <p className="text-sm font-semibold text-slate-900 flex-shrink-0 tabular-nums">€{part.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => window.print()}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Εκτύπωση QR αυτοκινήτου
        </button>

        <Link
          href={ROUTES.SELLER.INVENTORY}
          className="w-full h-11 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 active:bg-slate-100 transition-colors"
        >
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Δες το stock
        </Link>

        <button
          type="button"
          onClick={onReset}
          className="w-full h-11 text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1.5 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Εισαγωγή άλλου αυτοκινήτου
        </button>
      </div>
    </div>
  )
}

// ─── Main wizard ──────────────────────────────────────────────────────────────

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7

export function VinWizard() {
  const [step, setStep] = useState<WizardStep>(1)
  const [carPhoto, setCarPhoto] = useState<string | null>(null)
  const [vin, setVin] = useState('')
  const [isDecoding, setIsDecoding] = useState(false)
  const [vehicle, setVehicle] = useState<DecodedVehicle | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>(
    () => CAR_PARTS_TEMPLATE.map((p) => p.id)
  )
  const [globalCondition, setGlobalCondition] = useState<PartCondition | ''>('')
  const [prices, setPrices] = useState<Record<string, string>>(
    () => Object.fromEntries(CAR_PARTS_TEMPLATE.map((p) => [p.id, String(p.suggestedPrice)]))
  )
  const [publishAll, setPublishAll] = useState(true)
  const [generatedParts, setGeneratedParts] = useState<GeneratedPart[]>([])
  // Vehicle-level QR — one code per imported car, not per part
  const [vehicleCode, setVehicleCode] = useState('')
  const [vehicleQrValue, setVehicleQrValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  const isSuccess = step === 7

  const togglePart = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
    setError(null)
  }

  const validate = (): string | null => {
    if (step === 4 && selectedIds.length === 0) return 'Επίλεξε τουλάχιστον ένα ανταλλακτικό'
    if (step === 5) {
      if (!globalCondition) return 'Επίλεξε κατάσταση ανταλλακτικών'
      const selected = CAR_PARTS_TEMPLATE.filter((p) => selectedIds.includes(p.id))
      for (const part of selected) {
        const p = prices[part.id] ?? ''
        if (!p || parseFloat(p) <= 0) return `Συμπλήρωσε τιμή για: ${part.partName}`
      }
    }
    return null
  }

  const handleDecode = () => {
    if (vin.length !== 17) {
      setError('Ο VIN πρέπει να έχει ακριβώς 17 χαρακτήρες')
      return
    }
    setIsDecoding(true)
    setError(null)
    setTimeout(() => {
      setVehicle(decodeVin(vin))
      setIsDecoding(false)
      setStep(3)
    }, 800)
  }

  const handlePublish = () => {
    const selected = CAR_PARTS_TEMPLATE.filter((p) => selectedIds.includes(p.id))
    const base = Date.now() % 10000
    const suffix = String(base).padStart(4, '0')

    // One vehicle-level QR for the whole car.
    // Future: scanning vehicleQr opens vehicle context → list of linked parts
    // → action "Ποιο ανταλλακτικό βγήκε;"
    const code = `VEH-001-${suffix}`
    const qrValue = `partlink:vehicle:seller-001:${code}`

    const parts: GeneratedPart[] = selected.map((part, i) => ({
      templateId: part.id,
      partName: part.partName,
      categoryId: part.categoryId,
      condition: globalCondition as PartCondition,
      price: parseFloat(prices[part.id] ?? '0'),
      // Internal SKU for inventory lookup — not a printable QR label in VIN Import
      sku: generateSKU('seller-001', (base + i) % 10000),
      publishToMarketplace: publishAll,
    }))

    setVehicleCode(code)
    setVehicleQrValue(qrValue)
    setGeneratedParts(parts)
    setStep(7)
  }

  const goNext = () => {
    if (step === 2) { handleDecode(); return }
    if (step === 6) { handlePublish(); return }
    const err = validate()
    if (err) { setError(err); return }
    setError(null)
    setStep((s) => (s + 1) as WizardStep)
  }

  const goBack = () => {
    setError(null)
    setStep((s) => (s - 1) as WizardStep)
  }

  const reset = () => {
    setStep(1)
    setCarPhoto(null)
    setVin('')
    setVehicle(null)
    setSelectedIds(CAR_PARTS_TEMPLATE.map((p) => p.id))
    setGlobalCondition('')
    setPrices(Object.fromEntries(CAR_PARTS_TEMPLATE.map((p) => [p.id, String(p.suggestedPrice)])))
    setPublishAll(true)
    setGeneratedParts([])
    setVehicleCode('')
    setVehicleQrValue('')
    setError(null)
  }

  const primaryLabel = () => {
    if (step === 2) return 'Αποκωδικοποίηση VIN'
    if (step === 3) return 'Επιβεβαίωση'
    if (step === 4) return `Συνέχεια · ${selectedIds.length} επιλεγμένα`
    if (step === 6) return `Δημοσίευση ${selectedIds.length} ανταλλακτικών`
    return 'Συνέχεια'
  }

  const isLastStep = step === 6

  return (
    <>
      {/* Scrollable content */}
      <div className={cn('px-4 py-6', isSuccess ? 'pb-10' : 'pb-40 lg:pb-32')}>
        {isSuccess ? (
          <SuccessStep
            vehicle={vehicle!}
            parts={generatedParts}
            vehicleCode={vehicleCode}
            vehicleQrValue={vehicleQrValue}
            onReset={reset}
          />
        ) : (
          <>
            <StepProgress step={step} />

            {step === 1 && (
              <>
                <h2 className="text-lg font-bold text-slate-900 mb-0.5">Φωτογραφία αυτοκινήτου</h2>
                <p className="text-sm text-slate-500 mb-6">Τράβηξε φωτογραφία του αυτοκινήτου που ξηλώνεις</p>
                <CarPhotoStep
                  photo={carPhoto}
                  onSet={setCarPhoto}
                  onClear={() => setCarPhoto(null)}
                />
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-lg font-bold text-slate-900 mb-0.5">Αναγνώριση VIN</h2>
                <p className="text-sm text-slate-500 mb-6">
                  Σκάναρε ή πληκτρολόγησε τον αριθμό VIN (17 χαρακτήρες)
                </p>
                <VinEntryStep
                  vin={vin}
                  onChange={(v) => { setVin(v); setError(null) }}
                />
              </>
            )}

            {step === 3 && vehicle && (
              <>
                <h2 className="text-lg font-bold text-slate-900 mb-0.5">Επιβεβαίωση οχήματος</h2>
                <p className="text-sm text-slate-500 mb-6">Έλεγξε τα στοιχεία του αυτοκινήτου πριν συνεχίσεις</p>
                <VehicleConfirmStep vehicle={vehicle} />
              </>
            )}

            {step === 4 && vehicle && (
              <>
                <h2 className="text-lg font-bold text-slate-900 mb-0.5">Επιλογή ανταλλακτικών</h2>
                <p className="text-sm text-slate-500 mb-6">
                  Επίλεξε τι έχεις για πώληση — αποεπίλεξε ό,τι δεν υπάρχει
                </p>
                <PartsSelectStep
                  vehicle={vehicle}
                  selectedIds={selectedIds}
                  onToggle={togglePart}
                  onSelectAll={() => setSelectedIds(CAR_PARTS_TEMPLATE.map((p) => p.id))}
                  onSelectNone={() => { setSelectedIds([]); setError(null) }}
                />
              </>
            )}

            {step === 5 && (
              <>
                <h2 className="text-lg font-bold text-slate-900 mb-0.5">Κατάσταση και τιμές</h2>
                <p className="text-sm text-slate-500 mb-6">
                  Ορίστε κατάσταση και τιμή για τα {selectedIds.length} επιλεγμένα ανταλλακτικά
                </p>
                <PartsPricingStep
                  selectedIds={selectedIds}
                  globalCondition={globalCondition}
                  onGlobalCondition={(c) => { setGlobalCondition(c); setError(null) }}
                  prices={prices}
                  onPrice={(id, price) => {
                    setPrices((prev) => ({ ...prev, [id]: price }))
                    setError(null)
                  }}
                  publishAll={publishAll}
                  onPublishAll={setPublishAll}
                />
              </>
            )}

            {step === 6 && vehicle && (
              <>
                <h2 className="text-lg font-bold text-slate-900 mb-0.5">Έλεγχος</h2>
                <p className="text-sm text-slate-500 mb-6">
                  Βεβαιώσου ότι όλα είναι σωστά πριν τη δημοσίευση
                </p>
                <ReviewStep
                  vehicle={vehicle}
                  selectedIds={selectedIds}
                  globalCondition={globalCondition}
                  prices={prices}
                  publishAll={publishAll}
                />
              </>
            )}

            {error && <ErrorBanner message={error} />}
          </>
        )}
      </div>

      {/* Fixed bottom action bar */}
      {!isSuccess && (
        <div className="fixed bottom-16 lg:bottom-0 left-0 lg:left-60 right-0 z-30 bg-white border-t border-slate-200 px-4 py-3 flex gap-3">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={goBack}
              className="flex-shrink-0 gap-1"
              disabled={isDecoding}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Πίσω
            </Button>
          ) : (
            <Link
              href={ROUTES.SELLER.INVENTORY}
              className="flex-shrink-0 inline-flex items-center gap-1 h-10 px-4 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Ακύρωση
            </Link>
          )}

          <Button
            variant="primary"
            onClick={goNext}
            fullWidth
            loading={isDecoding}
            disabled={step === 2 && vin.length !== 17}
            className="h-11 gap-1.5"
          >
            {isDecoding ? (
              'Αναγνώριση...'
            ) : isLastStep ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {primaryLabel()}
              </>
            ) : (
              <>
                {primaryLabel()}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </Button>
        </div>
      )}
    </>
  )
}
