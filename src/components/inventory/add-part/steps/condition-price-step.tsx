import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormField } from '@/components/forms/form-field'
import { PriceInput } from '@/components/forms/price-input'
import { cn } from '@/lib/utils'
import { CONDITIONS } from '../constants'
import type { FormState, UpdateForm } from '../types'

interface ConditionPriceStepProps {
  form: FormState
  update: UpdateForm
}

export function ConditionPriceStep({ form, update }: ConditionPriceStepProps) {
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
