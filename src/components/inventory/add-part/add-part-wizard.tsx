'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn, generateSKU } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/routes'
import { STEP_LABELS, STEP_INFO } from './constants'
import { INITIAL_FORM, validateStep } from './types'
import type { FormState } from './types'
import { PhotosStep } from './steps/photos-step'
import { VehicleStep } from './steps/vehicle-step'
import { PartDetailsStep } from './steps/part-details-step'
import { ConditionPriceStep } from './steps/condition-price-step'
import { ReviewStep } from './steps/review-step'
import { SuccessStep } from './steps/success-step'

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

export function AddPartWizard() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [error, setError] = useState<string | null>(null)
  const [sku, setSku] = useState('')

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setError(null)
  }

  const goNext = () => {
    const err = validateStep(step, form)
    if (err) { setError(err); return }
    setError(null)
    if (step === 5) {
      setSku(generateSKU('seller-001', Date.now() % 10000))
      setStep(6)
    } else {
      setStep((s) => s + 1)
    }
  }

  const goBack = () => { setError(null); setStep((s) => s - 1) }
  const goToStep = (s: number) => { setError(null); setStep(s) }
  const reset = () => { setStep(1); setForm(INITIAL_FORM); setError(null); setSku('') }

  const isSuccess = step === 6

  return (
    <>
      {/* Scrollable content — pb clears fixed bottom bar + mobile nav */}
      <div className={cn('px-4 py-6', isSuccess ? 'pb-10' : 'pb-40 lg:pb-32')}>
        {isSuccess ? (
          <SuccessStep form={form} sku={sku} onReset={reset} />
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
            <Button variant="outline" onClick={goBack} className="flex-shrink-0 gap-1">
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

          <Button variant="primary" onClick={goNext} fullWidth className="h-11 gap-1.5">
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
