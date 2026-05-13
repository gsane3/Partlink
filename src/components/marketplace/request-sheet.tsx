'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn, formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/routes'
import type { PartInfo } from '@/lib/mock-data/part-detail'
import { getCurrentBuyerProfile } from '@/lib/mock-data/profiles'

// ─── Types ────────────────────────────────────────────────────────────────────

type DeliveryOption = 'pickup' | 'shipping' | 'unknown'

export interface RequestSheetProps {
  mode: 'request' | 'message'
  partInfo: PartInfo
  sellerName?: string
  onClose: () => void
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DELIVERY_OPTIONS: { value: DeliveryOption; label: string }[] = [
  { value: 'pickup',   label: 'Παραλαβή από κατάστημα' },
  { value: 'shipping', label: 'Αποστολή' },
  { value: 'unknown',  label: 'Δεν ξέρω ακόμα' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function RequestSheet({ mode, partInfo, sellerName, onClose }: RequestSheetProps) {
  const profile  = getCurrentBuyerProfile()
  const hasPrice = partInfo.price > 0

  const [step,         setStep]         = useState<'form' | 'success'>('form')
  const [message,      setMessage]      = useState(() =>
    hasPrice
      ? 'Ενδιαφέρομαι για το ανταλλακτικό. Είναι διαθέσιμο;'
      : 'Ενδιαφέρομαι για το ανταλλακτικό. Μπορείτε να μου στείλετε τιμή;'
  )
  const [delivery,     setDelivery]     = useState<DeliveryOption>('unknown')
  const [profileToast, setProfileToast] = useState(false)

  const title = mode === 'message'
    ? 'Μήνυμα στον πωλητή'
    : hasPrice ? 'Ζήτηση για αγορά' : 'Ζήτα τιμή'

  const submitLabel = mode === 'message'
    ? 'Αποστολή μηνύματος'
    : hasPrice ? 'Αποστολή αιτήματος' : 'Αποστολή αιτήματος τιμής'

  const successTitle   = mode === 'message' ? 'Το μήνυμα στάλθηκε' : 'Το αίτημα στάλθηκε'
  const deliveryLabel  = DELIVERY_OPTIONS.find((o) => o.value === delivery)?.label ?? ''

  const handleSubmit = () => setStep('success')

  const handleChangeProfile = () => {
    setProfileToast(true)
    setTimeout(() => setProfileToast(false), 2500)
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} aria-hidden="true" />

      {/* Bottom sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl overflow-hidden max-h-[90dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Κλείσιμο"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-4 pb-10 pt-4">
          {step === 'form' ? (
            <div className="space-y-4">

              {/* Part summary */}
              <div className="bg-slate-50 rounded-xl px-4 py-3.5 space-y-1">
                <p className="text-sm font-semibold text-slate-900">{partInfo.partName}</p>
                {partInfo.donorVehicle && (
                  <p className="text-xs text-slate-500">
                    {partInfo.donorVehicle.make} {partInfo.donorVehicle.model} {partInfo.donorVehicle.year}
                  </p>
                )}
                <div className="mt-1">
                  {hasPrice ? (
                    <p className="text-sm font-bold text-slate-900 tabular-nums">{formatPrice(partInfo.price)}</p>
                  ) : (
                    <p className="text-sm font-medium text-slate-500 italic">Κατόπιν ζήτησης</p>
                  )}
                </div>
                {sellerName && <p className="text-xs text-slate-500 mt-0.5">{sellerName}</p>}
              </div>

              {/* Compatibility warning */}
              <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-3">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Πριν την αγορά, επιβεβαίωσε συμβατότητα με OEM, VIN ή τον πωλητή.
                </p>
              </div>

              {/* Buyer profile card — read-only */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Τα στοιχεία σου</p>
                  <button
                    type="button"
                    onClick={handleChangeProfile}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Αλλαγή στοιχείων
                  </button>
                </div>

                {profileToast && (
                  <div className="mx-4 mt-3 bg-slate-100 rounded-lg px-3 py-2">
                    <p className="text-xs text-slate-600">Η αλλαγή στοιχείων θα γίνει από το προφίλ σου.</p>
                  </div>
                )}

                <div className="px-4 py-3 space-y-2">
                  {[
                    { label: 'Επιχείρηση', value: profile.companyName },
                    { label: 'Υπεύθυνος',  value: profile.contactName },
                    { label: 'Τηλέφωνο',   value: profile.phone },
                    { label: 'Email',       value: profile.email },
                    { label: 'Περιοχή',     value: profile.city },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-3">
                      <span className="text-xs text-slate-500 flex-shrink-0 w-28">{row.label}</span>
                      <span className="text-xs font-medium text-slate-800 text-right truncate">{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="px-4 pb-3">
                  <p className="text-[11px] text-slate-400">Θα σταλούν στον πωλητή μαζί με το αίτημα.</p>
                </div>
              </div>

              {/* Message — optional */}
              <div>
                <label className="text-xs font-medium text-slate-700 mb-1 block">
                  Μήνυμα προς πωλητή
                  <span className="font-normal text-slate-400 ml-1">(προαιρετικό)</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className={cn(
                    'w-full text-sm bg-white border border-slate-200 rounded-lg px-3 py-2.5 resize-none',
                    'text-slate-900 placeholder:text-slate-400',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  )}
                />
              </div>

              {/* Delivery preference */}
              <div>
                <p className="text-xs font-medium text-slate-700 mb-2">Τρόπος παραλαβής</p>
                <div className="flex flex-col gap-2">
                  {DELIVERY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setDelivery(opt.value)}
                      className={cn(
                        'h-11 px-4 rounded-xl border-2 text-sm font-medium transition-colors text-left',
                        delivery === opt.value
                          ? 'border-blue-500 bg-blue-50 text-blue-800'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="button"
                variant="primary"
                fullWidth
                onClick={handleSubmit}
                className="h-12 text-base"
              >
                {submitLabel}
              </Button>
            </div>
          ) : (
            /* ── Success state ── */
            <div className="space-y-5">
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{successTitle}</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                  Ο πωλητής θα επικοινωνήσει μαζί σου για διαθεσιμότητα και συμβατότητα.
                </p>
              </div>

              {/* Summary */}
              <div className="bg-slate-50 rounded-xl px-4 py-4 divide-y divide-slate-200">
                {[
                  { label: 'Ανταλλακτικό',     value: partInfo.partName },
                  ...(sellerName ? [{ label: 'Πωλητής', value: sellerName }] : []),
                  { label: 'Παραλαβή',          value: deliveryLabel },
                  { label: 'Αγοραστής', value: `${profile.companyName} · ${profile.phone}` },
                ].map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                    <span className="text-xs text-slate-500 flex-shrink-0 w-32">{row.label}</span>
                    <span className="text-xs font-medium text-slate-900 text-right flex-1 min-w-0">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2.5">
                <Button type="button" variant="primary" fullWidth onClick={onClose} className="h-11">
                  Κλείσιμο
                </Button>
                <Link
                  href={ROUTES.MARKETPLACE}
                  onClick={onClose}
                  className="w-full h-11 flex items-center justify-center rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  Συνέχεια στο Marketplace
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
