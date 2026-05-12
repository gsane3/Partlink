import { Input } from '@/components/ui/input'
import { FormField } from '@/components/forms/form-field'
import { FUEL_OPTIONS } from '../constants'
import type { FormState, UpdateForm } from '../types'

interface VehicleStepProps {
  form: FormState
  update: UpdateForm
}

export function VehicleStep({ form, update }: VehicleStepProps) {
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
