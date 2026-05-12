import type { PartCondition } from '@/types'

export const STEP_LABELS = ['Φωτογραφίες', 'Όχημα', 'Ανταλλακτικό', 'Τιμή', 'Έλεγχος']

export const STEP_INFO = [
  { title: 'Φωτογραφίες', sub: 'Πρόσθεσε φωτογραφίες του ανταλλακτικού' },
  { title: 'Στοιχεία οχήματος', sub: 'Από ποιο αυτοκίνητο αφαιρέθηκε;' },
  { title: 'Στοιχεία ανταλλακτικού', sub: 'Ποιο ανταλλακτικό είναι;' },
  { title: 'Κατάσταση και τιμή', sub: 'Σε τι κατάσταση είναι και πόσο κοστίζει;' },
  { title: 'Έλεγχος', sub: 'Βεβαιώσου ότι όλα είναι σωστά πριν τη δημοσίευση' },
] as const

export const FUEL_OPTIONS = ['Diesel', 'Βενζίνη', 'Υβριδικό', 'Ηλεκτρικό', 'LPG'] as const

export const CONDITIONS: { value: PartCondition; label: string }[] = [
  { value: 'excellent', label: 'Άριστο' },
  { value: 'very_good', label: 'Πολύ καλό' },
  { value: 'good', label: 'Καλό' },
  { value: 'fair', label: 'Μέτριο' },
  { value: 'for_repair', label: 'Για επισκευή' },
  { value: 'tested', label: 'Ελεγμένο' },
  { value: 'untested', label: 'Χωρίς έλεγχο' },
]
