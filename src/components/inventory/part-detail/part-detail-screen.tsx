'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PriceInput } from '@/components/forms/price-input'
import { ConditionBadge } from '@/components/inventory/condition-badge'
import { CATEGORIES } from '@/lib/constants'
import { ROUTES } from '@/lib/routes'
import { findPartDetail } from '@/lib/mock-data/part-detail'
import type { PartInfo } from '@/lib/mock-data/part-detail'
import type { VehiclePartStatus, CompatibilityStatus } from '@/components/inventory/vin-import/types'

// ─── Local types ──────────────────────────────────────────────────────────────

interface CompatibleVehicle {
  id: string
  make: string
  model: string
  yearFrom?: number
  yearTo?: number
}

// ─── Status display helpers ───────────────────────────────────────────────────

const OP_STATUS_OPTIONS: { value: VehiclePartStatus; label: string }[] = [
  { value: 'in_vehicle', label: 'Μέσα στο αμάξι' },
  { value: 'removed',    label: 'Βγήκε' },
  { value: 'shelved',    label: 'Στο ράφι' },
  { value: 'sold',       label: 'Πωλήθηκε' },
]

const OP_STATUS_COLORS: Record<VehiclePartStatus, string> = {
  in_vehicle: 'border-sky-400 bg-sky-50 text-sky-700',
  removed:    'border-green-400 bg-green-50 text-green-700',
  shelved:    'border-purple-400 bg-purple-50 text-purple-700',
  sold:       'border-slate-400 bg-slate-100 text-slate-700',
}

const COMPAT_LABELS: Record<CompatibilityStatus, string> = {
  donor_only:       'Μόνο από αυτό το αμάξι',
  oem_verified:     'OEM επιβεβαιωμένο',
  seller_confirmed: 'Επιβεβαιώθηκε από πωλητή',
}

const COMPAT_BADGE_VARIANT: Record<CompatibilityStatus, 'muted' | 'brand' | 'success'> = {
  donor_only:       'muted',
  oem_verified:     'brand',
  seller_confirmed: 'success',
}

// ─── Shared section card ──────────────────────────────────────────────────────

function SectionCard({
  title,
  children,
  action,
}: {
  title: string
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{title}</p>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

// ─── Readiness card ───────────────────────────────────────────────────────────

function ReadinessCard({
  hasPhoto,
  hasPrice,
  hasOem,
  hasDescription,
  hasCompatibility,
}: {
  hasPhoto: boolean
  hasPrice: boolean
  hasOem: boolean
  hasDescription: boolean
  hasCompatibility: boolean
}) {
  const score = [hasPhoto, hasPrice, hasOem, hasDescription, hasCompatibility].filter(Boolean).length
  const overall =
    score === 5 ? { label: 'Έτοιμο για marketplace', variant: 'success' as const } :
    score >= 3   ? { label: 'Βασική καταχώρηση',      variant: 'brand' as const } :
                   { label: 'Χρειάζεται συμπλήρωση',  variant: 'warning' as const }

  const items = [
    { done: hasPrice,       ok: 'Τιμή ή κατόπιν ζήτησης',     warn: 'Χρειάζεται τιμή' },
    { done: hasPhoto,       ok: 'Έχει φωτογραφία',             warn: 'Χρειάζεται φωτογραφία' },
    { done: hasDescription, ok: 'Έχει περιγραφή',              warn: 'Χρειάζεται περιγραφή' },
    { done: hasOem,         ok: 'Έχει OEM number',             warn: 'Καλύτερο με OEM' },
    { done: hasCompatibility, ok: 'Συμβατότητα επιβεβαιωμένη', warn: 'Συμβατότητα: Μόνο από αυτό το αμάξι' },
  ]

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Ετοιμότητα marketplace</p>
        <Badge variant={overall.variant}>{overall.label}</Badge>
      </div>
      <div className="px-4 py-3 space-y-2">
        {items.map((item) => (
          <div key={item.ok} className="flex items-center gap-2.5">
            {item.done ? (
              <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-2.5 h-2.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              </div>
            )}
            <span className={cn('text-xs', item.done ? 'text-slate-700' : 'text-slate-400')}>
              {item.done ? item.ok : item.warn}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Not found ────────────────────────────────────────────────────────────────

function PartNotFound({ partId }: { partId: string }) {
  return (
    <div className="px-4 py-16 text-center max-w-sm mx-auto">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
        <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Το ανταλλακτικό δεν βρέθηκε</h2>
      <p className="text-sm text-slate-500 mb-6 font-mono">{partId}</p>
      <Link
        href={ROUTES.SELLER.INVENTORY}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Αποθήκη
      </Link>
    </div>
  )
}

// ─── Content — all hooks live here ───────────────────────────────────────────

function PartDetailContent({ partInfo }: { partInfo: PartInfo }) {
  // ─── State ──────────────────────────────────────────────────────────────────

  const initialOpStatus: VehiclePartStatus = partInfo.sourceType === 'vin_import' ? 'in_vehicle' : 'removed'

  const [opStatus, setOpStatus] = useState<VehiclePartStatus>(initialOpStatus)
  const [priceInput, setPriceInput] = useState(partInfo.price > 0 ? String(partInfo.price) : '')
  // Start empty — mock paths like /mock/turbo-bmw.jpg don't resolve as actual files.
  // Photos added via the upload input use URL.createObjectURL() and preview correctly.
  const [photos, setPhotos] = useState<string[]>([])
  const [oemNumbers, setOemNumbers] = useState<string[]>([])
  const [aftermarketNumbers, setAftermarketNumbers] = useState<string[]>([])
  const [compatibilityStatus, setCompatibilityStatus] = useState<CompatibilityStatus>('donor_only')
  const [compatibleVehicles, setCompatibleVehicles] = useState<CompatibleVehicle[]>([])
  const [listingTitle, setListingTitle] = useState(partInfo.partName)
  const [description, setDescription] = useState(partInfo.description ?? '')
  const [keywords, setKeywords] = useState('')
  const [damageNotes, setDamageNotes] = useState('')
  const [manufacturerBrand, setManufacturerBrand] = useState('')
  const [manufacturerModel, setManufacturerModel] = useState('')
  const [acceptsOffers, setAcceptsOffers] = useState(false)
  const [tradeOnly, setTradeOnly] = useState(false)
  const [shelfLocation, setShelfLocation] = useState('')
  const [privateNotes, setPrivateNotes] = useState('')
  const [saved, setSaved] = useState(false)

  // Draft inputs
  const [oemDraft, setOemDraft] = useState('')
  const [aftermarketDraft, setAftermarketDraft] = useState('')
  const [compatMake, setCompatMake] = useState('')
  const [compatModel, setCompatModel] = useState('')
  const [compatYearFrom, setCompatYearFrom] = useState('')
  const [compatYearTo, setCompatYearTo] = useState('')

  const photoInputRef = useRef<HTMLInputElement>(null)
  const oemIdCounter = useRef(0)

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const urls = files.map((f) => URL.createObjectURL(f))
    setPhotos((prev) => [...prev, ...urls])
    e.target.value = ''
  }

  const handleAddOem = () => {
    const val = oemDraft.trim().toUpperCase()
    if (!val || oemNumbers.includes(val)) return
    const newOems = [...oemNumbers, val]
    setOemNumbers(newOems)
    setCompatibilityStatus('oem_verified')
    setOemDraft('')
  }

  const handleRemoveOem = (oem: string) => {
    const newOems = oemNumbers.filter((o) => o !== oem)
    setOemNumbers(newOems)
    if (newOems.length === 0 && compatibilityStatus === 'oem_verified') {
      setCompatibilityStatus(compatibleVehicles.length > 0 ? 'seller_confirmed' : 'donor_only')
    }
  }

  const handleAddAftermarket = () => {
    const val = aftermarketDraft.trim().toUpperCase()
    if (!val || aftermarketNumbers.includes(val)) return
    setAftermarketNumbers((prev) => [...prev, val])
    setAftermarketDraft('')
  }

  const handleRemoveAftermarket = (num: string) => {
    setAftermarketNumbers((prev) => prev.filter((n) => n !== num))
  }

  const handleAddCompatVehicle = () => {
    if (!compatMake.trim() || !compatModel.trim()) return
    oemIdCounter.current += 1
    const newVehicle: CompatibleVehicle = {
      id: `compat-${oemIdCounter.current}`,
      make: compatMake.trim(),
      model: compatModel.trim(),
      yearFrom: compatYearFrom ? parseInt(compatYearFrom) : undefined,
      yearTo: compatYearTo ? parseInt(compatYearTo) : undefined,
    }
    setCompatibleVehicles((prev) => [...prev, newVehicle])
    if (compatibilityStatus === 'donor_only') setCompatibilityStatus('seller_confirmed')
    setCompatMake('')
    setCompatModel('')
    setCompatYearFrom('')
    setCompatYearTo('')
  }

  const handleRemoveCompatVehicle = (id: string) => {
    const remaining = compatibleVehicles.filter((v) => v.id !== id)
    setCompatibleVehicles(remaining)
    if (remaining.length === 0 && compatibilityStatus === 'seller_confirmed') {
      setCompatibilityStatus(oemNumbers.length > 0 ? 'oem_verified' : 'donor_only')
    }
  }

  // ─── Derived values ───────────────────────────────────────────────────────

  const price = parseFloat(priceInput) || 0
  const hasPhoto = photos.length > 0
  const hasPrice = true  // always true — empty = on_request is a valid state
  const hasOem = oemNumbers.length > 0
  const hasDescription = description.trim().length > 20
  const hasCompatibility = compatibilityStatus !== 'donor_only'
  const categoryName = CATEGORIES.find((c) => c.id === partInfo.categoryId)?.name ?? partInfo.categoryId

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* Save toast */}
      {saved && (
        <div className="fixed top-16 left-0 right-0 z-40 flex justify-center px-4 pt-3 pointer-events-none">
          <div className="bg-green-600 text-white text-sm font-medium rounded-xl px-5 py-3 shadow-lg">
            Οι αλλαγές αποθηκεύτηκαν τοπικά για το demo.
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 pt-6 pb-44 lg:pb-12 space-y-4">

        {/* ── Back + header ── */}
        <div>
          <Link
            href={ROUTES.SELLER.INVENTORY}
            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Αποθήκη
          </Link>

          <h1 className="text-xl font-bold text-slate-900 mb-2">{partInfo.partName}</h1>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {partInfo.sku}
            </span>
            <Badge variant={
              opStatus === 'removed' ? 'success' :
              opStatus === 'sold' ? 'muted' :
              opStatus === 'shelved' ? 'purple' :
              'brand'
            }>
              {OP_STATUS_OPTIONS.find((o) => o.value === opStatus)?.label}
            </Badge>
            <ConditionBadge condition={partInfo.condition} />
            <Badge variant="default">{categoryName}</Badge>
          </div>

          <p className="text-lg font-bold text-slate-900">
            {price > 0 ? `€${price}` : (
              <span className="text-base font-medium text-slate-500 italic">Κατόπιν ζήτησης</span>
            )}
          </p>
        </div>

        {/* ── Donor vehicle card ── */}
        {partInfo.donorVehicle && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                {partInfo.sourceType === 'vin_import' ? 'Αυτοκίνητο προέλευσης' : 'Αυτοκίνητο'}
              </p>
            </div>
            <div className="px-4 py-3.5 space-y-2">
              <p className="text-sm font-semibold text-slate-900">
                {partInfo.donorVehicle.make} {partInfo.donorVehicle.model} {partInfo.donorVehicle.year}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                {partInfo.donorVehicle.vin && (
                  <span>VIN: <span className="font-mono text-slate-700">{partInfo.donorVehicle.vin}</span></span>
                )}
                {partInfo.donorVehicle.engine && (
                  <span>Κινητήρας: <span className="font-semibold text-slate-700">{partInfo.donorVehicle.engine}</span></span>
                )}
                {partInfo.donorVehicle.fuel && (
                  <span>{partInfo.donorVehicle.fuel}</span>
                )}
                {partInfo.donorVehicle.mileage && (
                  <span>{partInfo.donorVehicle.mileage.toLocaleString('el-GR')} km</span>
                )}
              </div>
              {partInfo.donorVehicle.vehicleCode && (
                <Link
                  href={ROUTES.SELLER.VEHICLE_DETAIL(partInfo.donorVehicle.vehicleCode)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors mt-0.5"
                >
                  Άνοιγμα αυτοκινήτου
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* ── Readiness ── */}
        <ReadinessCard
          hasPhoto={hasPhoto}
          hasPrice={hasPrice}
          hasOem={hasOem}
          hasDescription={hasDescription}
          hasCompatibility={hasCompatibility}
        />

        {/* ── 1. Operational status ── */}
        <SectionCard title="Κατάσταση">
          <div className="grid grid-cols-2 gap-2">
            {OP_STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setOpStatus(opt.value)}
                className={cn(
                  'h-14 rounded-xl border-2 text-sm font-semibold transition-colors text-center px-2',
                  opStatus === opt.value
                    ? OP_STATUS_COLORS[opt.value]
                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </SectionCard>

        {/* ── 2. Price ── */}
        <SectionCard title="Τιμή">
          <div className="flex gap-2 items-center">
            <PriceInput
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              placeholder="0"
              className="h-11 flex-1"
            />
            {priceInput && (
              <button
                type="button"
                onClick={() => setPriceInput('')}
                className="flex-shrink-0 text-xs text-slate-500 hover:text-red-500 transition-colors px-2 py-1"
              >
                Καθαρισμός
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            {priceInput && parseFloat(priceInput) > 0
              ? `Τιμή: €${parseFloat(priceInput)}`
              : 'Κενή τιμή = Κατόπιν ζήτησης'}
          </p>
        </SectionCard>

        {/* ── 3. Photos ── */}
        <SectionCard title={`Φωτογραφίες${photos.length > 0 ? ` (${photos.length})` : ''}`}>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={handlePhotoChange}
          />

          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {photos.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotos((prev) => prev.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center hover:bg-black/80 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => photoInputRef.current?.click()}
            className="w-full h-12 border-2 border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-500 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {photos.length > 0 ? 'Πρόσθεσε φωτογραφία' : 'Πρόσθεσε φωτογραφίες'}
          </button>
        </SectionCard>

        {/* ── 4. Part numbers ── */}
        <SectionCard title="OEM / Part numbers">
          {/* OEM list */}
          <div className="mb-4">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">OEM numbers</p>
            {oemNumbers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {oemNumbers.map((oem) => (
                  <span key={oem} className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800">
                    {oem}
                    <button
                      type="button"
                      onClick={() => handleRemoveOem(oem)}
                      className="text-slate-400 hover:text-red-500 transition-colors leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={oemDraft}
                onChange={(e) => setOemDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddOem()}
                placeholder="π.χ. 11657810696"
                className="h-10 font-mono text-sm flex-1"
              />
              <Button type="button" variant="outline" onClick={handleAddOem} className="flex-shrink-0 h-10 text-sm px-3">
                Πρόσθεσε
              </Button>
            </div>
          </div>

          {/* Aftermarket list */}
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Aftermarket numbers</p>
            {aftermarketNumbers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {aftermarketNumbers.map((num) => (
                  <span key={num} className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800">
                    {num}
                    <button
                      type="button"
                      onClick={() => handleRemoveAftermarket(num)}
                      className="text-slate-400 hover:text-red-500 transition-colors leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={aftermarketDraft}
                onChange={(e) => setAftermarketDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddAftermarket()}
                placeholder="π.χ. TN41286N"
                className="h-10 font-mono text-sm flex-1"
              />
              <Button type="button" variant="outline" onClick={handleAddAftermarket} className="flex-shrink-0 h-10 text-sm px-3">
                Πρόσθεσε
              </Button>
            </div>
          </div>
        </SectionCard>

        {/* ── 5. Compatibility ── */}
        <SectionCard
          title="Συμβατότητα"
          action={<Badge variant={COMPAT_BADGE_VARIANT[compatibilityStatus]}>{COMPAT_LABELS[compatibilityStatus]}</Badge>}
        >
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Η συμβατότητα δεν επιβεβαιώνεται αυτόματα. Πρόσθεσε OEM / part number ή συμβατά μοντέλα για καλύτερη αναζήτηση.
          </p>

          {compatibleVehicles.length > 0 && (
            <div className="space-y-1.5 mb-4">
              {compatibleVehicles.map((v) => (
                <div key={v.id} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2.5">
                  <span className="text-sm text-slate-800">
                    {v.make} {v.model}
                    {v.yearFrom && (
                      <span className="text-slate-500 ml-1">
                        {v.yearFrom}{v.yearTo && v.yearTo !== v.yearFrom ? `–${v.yearTo}` : ''}
                      </span>
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCompatVehicle(v.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors text-xs ml-2"
                  >
                    Αφαίρεση
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Πρόσθεσε συμβατό μοντέλο</p>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <Input value={compatMake} onChange={(e) => setCompatMake(e.target.value)} placeholder="Μάρκα" className="h-10" />
            <Input value={compatModel} onChange={(e) => setCompatModel(e.target.value)} placeholder="Μοντέλο" className="h-10" />
            <Input
              value={compatYearFrom}
              onChange={(e) => setCompatYearFrom(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="Από έτος"
              className="h-10"
              inputMode="numeric"
            />
            <Input
              value={compatYearTo}
              onChange={(e) => setCompatYearTo(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="Έως έτος"
              className="h-10"
              inputMode="numeric"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleAddCompatVehicle}
            fullWidth
            className="h-10 text-sm"
          >
            + Πρόσθεσε συμβατό μοντέλο
          </Button>
        </SectionCard>

        {/* ── 6. Listing enrichment ── */}
        <SectionCard title="Αγγελία marketplace">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Τίτλος αγγελίας</label>
              <Input value={listingTitle} onChange={(e) => setListingTitle(e.target.value)} className="h-10" />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Περιγραφή</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Περιέγραψε την κατάσταση, τυχόν ζημιές, λεπτομέρειες..."
                rows={3}
                className={cn(
                  'w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2.5 resize-none',
                  'text-slate-900 placeholder:text-slate-400',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                )}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Λέξεις-κλειδιά</label>
              <Input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="π.χ. N47, E90, 320d"
                className="h-10"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Σημειώσεις ζημιών</label>
              <Input
                value={damageNotes}
                onChange={(e) => setDamageNotes(e.target.value)}
                placeholder="π.χ. Μικρή γρατσουνιά δεξιά"
                className="h-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Μάρκα κατασκευαστή</label>
                <Input value={manufacturerBrand} onChange={(e) => setManufacturerBrand(e.target.value)} placeholder="π.χ. Bosch" className="h-10" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Μοντέλο</label>
                <Input value={manufacturerModel} onChange={(e) => setManufacturerModel(e.target.value)} placeholder="π.χ. KP39" className="h-10" />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-1">
              <button
                type="button"
                role="switch"
                aria-checked={acceptsOffers}
                onClick={() => setAcceptsOffers((v) => !v)}
                className={cn(
                  'flex items-center justify-between gap-4 p-3.5 rounded-xl border-2 transition-colors text-left',
                  acceptsOffers ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white'
                )}
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">Δέχεται προτάσεις</p>
                  <p className="text-xs text-slate-500 mt-0.5">Ο αγοραστής μπορεί να προτείνει τιμή</p>
                </div>
                <div className={cn('relative flex-shrink-0 w-11 h-6 rounded-full transition-colors', acceptsOffers ? 'bg-blue-600' : 'bg-slate-300')}>
                  <div className={cn('absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-150', acceptsOffers ? 'right-0.5' : 'left-0.5')} />
                </div>
              </button>

              <button
                type="button"
                role="switch"
                aria-checked={tradeOnly}
                onClick={() => setTradeOnly((v) => !v)}
                className={cn(
                  'flex items-center justify-between gap-4 p-3.5 rounded-xl border-2 transition-colors text-left',
                  tradeOnly ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white'
                )}
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">Μόνο για επαγγελματίες</p>
                  <p className="text-xs text-slate-500 mt-0.5">Εμφανίζεται μόνο σε επαγγελματίες αγοραστές</p>
                </div>
                <div className={cn('relative flex-shrink-0 w-11 h-6 rounded-full transition-colors', tradeOnly ? 'bg-blue-600' : 'bg-slate-300')}>
                  <div className={cn('absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-150', tradeOnly ? 'right-0.5' : 'left-0.5')} />
                </div>
              </button>
            </div>
          </div>
        </SectionCard>

        {/* ── 7. AI-ready block (disabled / future) ── */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">AI βοηθός αγγελίας</p>
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-200 rounded px-1.5 py-0.5">Σύντομα</span>
          </div>
          <div className="p-4">
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Θα ενεργοποιηθεί αργότερα. Το AI θα προτείνει, ο πωλητής θα επιβεβαιώνει.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Βελτίωση τίτλου με AI',
                'Δημιουργία περιγραφής με AI',
                'Ανάγνωση OEM από φωτογραφία',
                'Πρόταση συμβατότητας',
              ].map((label) => (
                <button
                  key={label}
                  type="button"
                  disabled
                  className="h-11 border border-slate-200 rounded-xl text-xs font-medium text-slate-400 bg-white opacity-50 cursor-not-allowed text-center px-2"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── 8. Private / internal ── */}
        <SectionCard title="Εσωτερικά στοιχεία">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Θέση ραφιού</label>
              <Input
                value={shelfLocation}
                onChange={(e) => setShelfLocation(e.target.value)}
                placeholder="π.χ. Ράφι Β-04"
                className="h-10"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 mb-1 block">Εσωτερικές σημειώσεις</label>
              <textarea
                value={privateNotes}
                onChange={(e) => setPrivateNotes(e.target.value)}
                placeholder="Σημειώσεις μόνο για εσάς..."
                rows={2}
                className={cn(
                  'w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2.5 resize-none',
                  'text-slate-900 placeholder:text-slate-400',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                )}
              />
            </div>
          </div>
        </SectionCard>

      </div>

      {/* ── Sticky bottom action bar ── */}
      <div className="fixed bottom-16 lg:bottom-0 left-0 lg:left-60 right-0 z-30 bg-white border-t border-slate-200 px-4 py-3">
        <div className="flex gap-2 max-w-2xl mx-auto">
          {partInfo.donorVehicle?.vehicleCode && (
            <Link
              href={ROUTES.SELLER.VEHICLE_DETAIL(partInfo.donorVehicle.vehicleCode)}
              className="flex-shrink-0 inline-flex items-center gap-1 h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Αμάξι
            </Link>
          )}
          <Link
            href={ROUTES.SELLER.INVENTORY}
            className="flex-shrink-0 inline-flex items-center gap-1 h-10 px-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Stock
          </Link>
          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={handleSave}
            className="h-11 gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Αποθήκευση
          </Button>
        </div>
      </div>
    </>
  )
}

// ─── Public export ────────────────────────────────────────────────────────────

export function PartDetailScreen({ partId }: { partId: string }) {
  const partInfo = findPartDetail(partId)
  if (!partInfo) return <PartNotFound partId={partId} />
  return <PartDetailContent partInfo={partInfo} />
}
