import { cn } from '@/lib/utils'
import { CATEGORIES, CONDITION_LABELS } from '@/lib/constants'
import type { FormState } from '../types'
import type { PartCondition } from '@/types'
import type { ReactNode } from 'react'

function ReviewCard({
  title,
  onEdit,
  children,
}: {
  title: string
  onEdit: () => void
  children: ReactNode
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

interface ReviewStepProps {
  form: FormState
  goToStep: (step: number) => void
}

export function ReviewStep({ form, goToStep }: ReviewStepProps) {
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
