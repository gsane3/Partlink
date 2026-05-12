'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormField } from '@/components/forms/form-field'
import { PriceInput } from '@/components/forms/price-input'
import { CATEGORIES, CONDITION_LABELS } from '@/lib/constants'
import { ROUTES } from '@/lib/routes'
import type { PartCondition } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  photos: string[]
  make: string
  model: string
  year: string
  engine: string
  fuel: string
  partName: string
  categoryId: string
  oemNumber: string
  description: string
  condition: PartCondition | ''
  price: string
  quantity: string
  publishToMarketplace: boolean
}

const INITIAL: FormState = {
  photos: [],
  make: '', model: '', year: '', engine: '', fuel: '',
  partName: '', categoryId: '', oemNumber: '', description: '',
  condition: '', price: '', quantity: '1',
  publishToMarketplace: true,
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STEP_LABELS = ['Φωτογραφίες', 'Όχημα', 'Ανταλλακτικό', 'Τιμή', 'Έλεγχος']

const STEP_INFO = [
  { title: 'Φωτογραφίες', sub: 'Πρόσθεσε φωτογραφίες του ανταλλακτικού' },
  { title: 'Στοιχεία οχήματος', sub: 'Από ποιο αυτοκίνητο αφαιρέθηκε;' },
  { title: 'Στοιχεία ανταλλακτικού', sub: 'Ποιο ανταλλακτικό είναι;' },
  { title: 'Κατάσταση και τιμή', sub: 'Σε τι κατάσταση είναι και πόσο κοστίζει;' },
  { title: 'Έλεγχος', sub: 'Βεβαιώσου ότι όλα είναι σωστά πριν τη δημοσίευση' },
]

const FUEL_OPTIONS = ['Diesel', 'Βενζίνη', 'Υβριδικό', 'Ηλεκτρικό', 'LPG']

const CONDITIONS: { value: PartCondition; label: string }[] = [
  { value: 'excellent', label: 'Άριστο' },
  { value: 'very_good', label: 'Πολύ καλό' },
  { value: 'good', label: 'Καλό' },
  { value: 'fair', label: 'Μέτριο' },
  { value: 'for_repair', label: 'Για επισκευή' },
  { value: 'tested', label: 'Ελεγμένο' },
  { value: 'untested', label: 'Χωρίς έλεγχο' },
]

// ─── Validation ───────────────────────────────────────────────────────────────

function validate(step: number, f: FormState): string | null {
  if (step === 2) {
    if (!f.make.trim()) return 'Συμπλήρωσε τη μάρκα'
    if (!f.model.trim()) return 'Συμπλήρωσε το μοντέλο'
    if (!f.year || isNaN(Number(f.year))) return 'Συμπλήρωσε το έτος'
  }
  if (step === 3) {
    if (!f.partName.trim()) return 'Συμπλήρωσε το όνομα ανταλλακτικού'
    if (!f.categoryId) return 'Επίλεξε κατηγορία'
  }
  if (step === 4) {
    if (!f.condition) return 'Επίλεξε κατάσταση ανταλλακτικού'
    if (!f.price || parseFloat(f.price) <= 0) return 'Συμπλήρωσε έγκυρη τιμή'
  }
  return null
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

// ─── Step 1: Photos ───────────────────────────────────────────────────────────

function PhotosStep({
  photos,
  onAdd,
  onRemove,
}: {
  photos: string[]
  onAdd: (urls: string[]) => void
  onRemove: (index: number) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const urls = files.map((f) => URL.createObjectURL(f))
    onAdd(urls)
    e.target.value = ''
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="sr-only"
        onChange={handleChange}
      />

      {photos.length < 8 && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-44 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-colors mb-4"
        >
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.25} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-600">Τράβηξε ή επίλεξε φωτογραφία</p>
            <p className="text-xs text-slate-400 mt-0.5">Έως 8 φωτογραφίες</p>
          </div>
        </button>
      )}

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {photos.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(i)}
                aria-label="Αφαίρεση φωτογραφίας"
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {i === 0 && (
                <span className="absolute bottom-1.5 left-1.5 text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-medium">
                  Κύρια
                </span>
              )}
            </div>
          ))}
          {photos.length < 8 && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              aria-label="Προσθήκη φωτογραφίας"
              className="aspect-square rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-300 hover:text-slate-500 transition-colors"
            >
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>
      )}

      <p className="text-center text-xs text-slate-400">
        {photos.length === 0
          ? 'Η πρώτη φωτογραφία γίνεται η κύρια εικόνα στο marketplace'
          : `${photos.length} φωτογραφία${photos.length !== 1 ? 'ι' : ''} · Η πρώτη είναι η κύρια εικόνα`}
      </p>
    </div>
  )
}

// ─── Step 2: Vehicle ──────────────────────────────────────────────────────────

function VehicleStep({
  form,
  update,
}: {
  form: FormState
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void
}) {
  return (
    <div className="space-y-4">
      <FormField label="Μάρκα" required htmlFor="make">
        <Input
          id="make"
          autoCapitalize="words"
          placeholder="π.χ. BMW, Opel, VW"
          value={form.make}
          onChange={(e) => update('make', e.target.value)}
        />
      </FormField>

      <FormField label="Μοντέλο" required htmlFor="model">
        <Input
          id="model"
          placeholder="π.χ. E90, Astra H, Golf 5"
          value={form.model}
          onChange={(e) => update('model', e.target.value)}
        />
      </FormField>

      <FormField label="Έτος" required htmlFor="year">
        <Input
          id="year"
          type="number"
          inputMode="numeric"
          min="1975"
          max="2026"
          placeholder="π.χ. 2008"
          value={form.year}
          onChange={(e) => update('year', e.target.value)}
        />
      </FormField>

      <FormField label="Κινητήρας" htmlFor="engine" hint="Προαιρετικό — π.χ. N47D20, BKC, OM651">
        <Input
          id="engine"
          placeholder="π.χ. N47D20"
          value={form.engine}
          onChange={(e) => update('engine', e.target.value)}
        />
      </FormField>

      <FormField label="Καύσιμο" htmlFor="fuel" hint="Προαιρετικό">
        <select
          id="fuel"
          value={form.fuel}
          onChange={(e) => update('fuel', e.target.value)}
          className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Επίλεξε καύσιμο...</option>
          {FUEL_OPTIONS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </FormField>
    </div>
  )
}

// ─── Step 3: Part details ─────────────────────────────────────────────────────

function PartDetailsStep({
  form,
  update,
}: {
  form: FormState
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void
}) {
  return (
    <div className="space-y-5">
      <FormField label="Όνομα ανταλλακτικού" required htmlFor="partName">
        <Input
          id="partName"
          placeholder="π.χ. Φανάρι εμπρός δεξί"
          value={form.partName}
          onChange={(e) => update('partName', e.target.value)}
        />
      </FormField>

      <div>
        <Label required>Κατηγορία</Label>
        <div className="grid grid-cols-2 gap-2 mt-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => update('categoryId', cat.id)}
              className={cn(
                'min-h-[44px] px-3 py-2.5 rounded-lg text-sm border transition-colors text-left leading-tight',
                form.categoryId === cat.id
                  ? 'bg-blue-600 text-white border-blue-600 font-medium'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 active:bg-slate-100'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <FormField label="OEM / Part Number" htmlFor="oemNumber" hint="Προαιρετικό — π.χ. 63117182329">
        <Input
          id="oemNumber"
          placeholder="π.χ. 63117182329"
          value={form.oemNumber}
          onChange={(e) => update('oemNumber', e.target.value)}
        />
      </FormField>

      <FormField label="Περιγραφή" htmlFor="description" hint="Προαιρετικό">
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          placeholder="Πρόσθεσε λεπτομέρειες που βοηθούν τον αγοραστή..."
          rows={3}
          className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </FormField>
    </div>
  )
}

// ─── Step 4: Condition & price ────────────────────────────────────────────────

function ConditionPriceStep({
  form,
  update,
}: {
  form: FormState
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label required>Κατάσταση ανταλλακτικού</Label>
        <div className="grid grid-cols-2 gap-2 mt-1.5">
          {CONDITIONS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => update('condition', c.value)}
              className={cn(
                'h-11 px-3 rounded-lg text-sm border transition-colors',
                form.condition === c.value
                  ? 'bg-blue-600 text-white border-blue-600 font-medium'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 active:bg-slate-100'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <FormField label="Τιμή πώλησης" required htmlFor="price">
        <PriceInput
          id="price"
          placeholder="0.00"
          value={form.price}
          onChange={(e) => update('price', e.target.value)}
          className="h-12 text-base"
        />
      </FormField>

      <FormField label="Ποσότητα" htmlFor="quantity">
        <Input
          id="quantity"
          type="number"
          inputMode="numeric"
          min="1"
          value={form.quantity}
          onChange={(e) => update('quantity', e.target.value)}
        />
      </FormField>

      <button
        type="button"
        role="switch"
        aria-checked={form.publishToMarketplace}
        onClick={() => update('publishToMarketplace', !form.publishToMarketplace)}
        className={cn(
          'w-full flex items-center justify-between gap-4 p-4 rounded-xl border-2 transition-colors text-left',
          form.publishToMarketplace ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white'
        )}
      >
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-900">Δημοσίευση στο marketplace</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {form.publishToMarketplace
              ? 'Θα είναι ορατό σε αγοραστές άμεσα'
              : 'Αποθηκεύεται μόνο στο stock σου'}
          </p>
        </div>
        <div
          className={cn(
            'relative flex-shrink-0 w-11 h-6 rounded-full transition-colors',
            form.publishToMarketplace ? 'bg-blue-600' : 'bg-slate-300'
          )}
        >
          <div
            className={cn(
              'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-150',
              form.publishToMarketplace ? 'right-0.5' : 'left-0.5'
            )}
          />
        </div>
      </button>
    </div>
  )
}

// ─── Step 5: Review ───────────────────────────────────────────────────────────

function ReviewCard({
  title,
  onEdit,
  children,
}: {
  title: string
  onEdit: () => void
  children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{title}</p>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          Επεξεργασία
        </button>
      </div>
      <div className="px-4 py-3 text-sm text-slate-900 space-y-0.5">{children}</div>
    </div>
  )
}

function ReviewStep({
  form,
  goToStep,
}: {
  form: FormState
  goToStep: (s: number) => void
}) {
  const category = CATEGORIES.find((c) => c.id === form.categoryId)

  return (
    <div className="space-y-3">
      <ReviewCard title="Φωτογραφίες" onEdit={() => goToStep(1)}>
        <p className="text-slate-600">
          {form.photos.length > 0
            ? `${form.photos.length} φωτογραφία${form.photos.length !== 1 ? 'ι' : ''}`
            : 'Χωρίς φωτογραφία'}
        </p>
      </ReviewCard>

      <ReviewCard title="Όχημα" onEdit={() => goToStep(2)}>
        <p className="font-medium">{form.make} {form.model} {form.year}</p>
        {form.engine && <p className="text-slate-500">Κινητήρας: {form.engine}</p>}
        {form.fuel && <p className="text-slate-500">Καύσιμο: {form.fuel}</p>}
      </ReviewCard>

      <ReviewCard title="Ανταλλακτικό" onEdit={() => goToStep(3)}>
        <p className="font-medium">{form.partName}</p>
        {category && <p className="text-slate-500">{category.name}</p>}
        {form.oemNumber && <p className="text-slate-500">OEM: {form.oemNumber}</p>}
        {form.description && (
          <p className="text-slate-500 line-clamp-2">{form.description}</p>
        )}
      </ReviewCard>

      <ReviewCard title="Κατάσταση και τιμή" onEdit={() => goToStep(4)}>
        <div className="flex items-center justify-between">
          <p className="font-medium">
            {form.condition ? CONDITION_LABELS[form.condition as PartCondition] : '—'}
          </p>
          <p className="text-lg font-bold text-slate-900">€{form.price}</p>
        </div>
        <p className="text-slate-500">Ποσότητα: {form.quantity}</p>
        <p className={cn('text-xs mt-1', form.publishToMarketplace ? 'text-green-700 font-medium' : 'text-slate-400')}>
          {form.publishToMarketplace ? '✓ Δημοσίευση στο marketplace' : 'Αποθήκευση στο stock μόνο'}
        </p>
      </ReviewCard>
    </div>
  )
}

// ─── Step 6: Success ──────────────────────────────────────────────────────────

function SuccessScreen({
  form,
  sku,
  onReset,
}: {
  form: FormState
  sku: string
  onReset: () => void
}) {
  return (
    <div className="pt-4 pb-12">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-900">Το ανταλλακτικό προστέθηκε!</h2>
        <p className="text-sm text-slate-500 mt-1.5 max-w-xs mx-auto">
          {form.publishToMarketplace
            ? 'Προστέθηκε στο stock και δημοσιεύτηκε στο marketplace.'
            : 'Προστέθηκε στο stock σου.'}
        </p>
      </div>

      {/* SKU */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 mb-4">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">SKU</p>
        <p className="text-lg font-mono font-bold text-slate-900 tracking-widest">{sku}</p>
        <p className="text-xs text-slate-500 mt-1">
          {form.partName} · {form.make} {form.model} {form.year}
        </p>
      </div>

      {/* QR code */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6 flex flex-col items-center">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-4">QR Label</p>
        <div className="p-3 border border-slate-100 rounded-lg bg-white">
          <QRCodeSVG
            value={`partlink:seller-001:${sku}`}
            size={148}
            level="M"
          />
        </div>
        <p className="text-xs font-mono text-slate-500 mt-3 tracking-wider">{sku}</p>
        <p className="text-xs text-slate-400 mt-0.5 text-center">
          {form.make} {form.model} {form.year} · {form.partName}
        </p>
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
          Εκτύπωση QR label
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
          Πρόσθεσε άλλο ανταλλακτικό
        </button>
      </div>
    </div>
  )
}

// ─── Main wizard ──────────────────────────────────────────────────────────────

export function AddPartWizard() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormState>(INITIAL)
  const [error, setError] = useState<string | null>(null)
  const [sku, setSku] = useState('')

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setError(null)
  }

  const goNext = () => {
    const err = validate(step, form)
    if (err) { setError(err); return }
    setError(null)
    if (step === 5) {
      const generated = `PL-001-${String(Date.now()).slice(-4)}`
      setSku(generated)
      setStep(6)
    } else {
      setStep((s) => s + 1)
    }
  }

  const goBack = () => {
    setError(null)
    setStep((s) => s - 1)
  }

  const goToStep = (s: number) => {
    setError(null)
    setStep(s)
  }

  const reset = () => {
    setStep(1)
    setForm(INITIAL)
    setError(null)
    setSku('')
  }

  const isSuccess = step === 6

  return (
    <>
      {/* Scrollable content — pb clears fixed bottom bar + mobile nav */}
      <div className={cn('px-4 py-6', isSuccess ? 'pb-10' : 'pb-40 lg:pb-32')}>
        {isSuccess ? (
          <SuccessScreen form={form} sku={sku} onReset={reset} />
        ) : (
          <>
            <StepProgress step={step} />

            <h2 className="text-lg font-bold text-slate-900 mb-0.5">
              {STEP_INFO[step - 1].title}
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              {STEP_INFO[step - 1].sub}
            </p>

            {step === 1 && (
              <PhotosStep
                photos={form.photos}
                onAdd={(urls) => update('photos', [...form.photos, ...urls].slice(0, 8))}
                onRemove={(i) => update('photos', form.photos.filter((_, idx) => idx !== i))}
              />
            )}
            {step === 2 && <VehicleStep form={form} update={update} />}
            {step === 3 && <PartDetailsStep form={form} update={update} />}
            {step === 4 && <ConditionPriceStep form={form} update={update} />}
            {step === 5 && <ReviewStep form={form} goToStep={goToStep} />}

            {error && (
              <div className="mt-5 flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Fixed bottom action bar — hidden on success screen */}
      {!isSuccess && (
        <div className="fixed bottom-16 lg:bottom-0 left-0 lg:left-60 right-0 z-30 bg-white border-t border-slate-200 px-4 py-3 flex gap-3">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={goBack}
              className="flex-shrink-0 gap-1"
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
            className="h-11 gap-1.5"
          >
            {step === 5 ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {form.publishToMarketplace ? 'Δημοσίευση' : 'Προσθήκη στο stock'}
              </>
            ) : (
              <>
                Συνέχεια
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
