import type { PartCondition } from '@/types'

export interface FormState {
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

export const INITIAL_FORM: FormState = {
  photos: [],
  make: '', model: '', year: '', engine: '', fuel: '',
  partName: '', categoryId: '', oemNumber: '', description: '',
  condition: '', price: '', quantity: '1',
  publishToMarketplace: true,
}

// Generic update function signature used by all step components
export type UpdateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => void

export function validateStep(step: number, f: FormState): string | null {
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
