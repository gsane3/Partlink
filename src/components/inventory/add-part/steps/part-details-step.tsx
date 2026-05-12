import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormField } from '@/components/forms/form-field'
import { cn } from '@/lib/utils'
import { CATEGORIES } from '@/lib/constants'
import type { FormState, UpdateForm } from '../types'

interface PartDetailsStepProps {
  form: FormState
  update: UpdateForm
}

export function PartDetailsStep({ form, update }: PartDetailsStepProps) {
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
