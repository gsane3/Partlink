import type { DeliveryPreference } from '@/lib/mock-data/buyer-requests'

export const DELIVERY_PREFERENCE_LABELS: Record<DeliveryPreference, string> = {
  pickup:   'Παραλαβή από κατάστημα',
  shipping: 'Αποστολή',
  unknown:  'Δεν ξέρω ακόμα',
}

export function getDeliveryPreferenceLabel(delivery: DeliveryPreference): string {
  return DELIVERY_PREFERENCE_LABELS[delivery]
}
