import type { DecodedVehicle, TemplatePart } from './types'

// ─── Known VINs for demo ──────────────────────────────────────────────────────

const KNOWN_VINS: Record<string, DecodedVehicle> = {
  WBA3A5C56DF589213: { vin: 'WBA3A5C56DF589213', make: 'BMW', model: 'E90 320d', year: 2013, engine: 'N47D20', fuel: 'Diesel' },
  VSSZZZ6KZ7R125943: { vin: 'VSSZZZ6KZ7R125943', make: 'VW', model: 'Golf 5 1.9 TDI', year: 2007, engine: 'BKC', fuel: 'Diesel' },
  WDD2040022F123456: { vin: 'WDD2040022F123456', make: 'Mercedes', model: 'C-Class W204', year: 2015, engine: 'OM651', fuel: 'Diesel' },
  W0L000051T2123456: { vin: 'W0L000051T2123456', make: 'Opel', model: 'Astra H 1.6', year: 2005, engine: 'Z16XEP', fuel: 'Βενζίνη' },
}

// Decode by WMI (first 3 chars) as fallback
export function decodeVin(vin: string): DecodedVehicle {
  const upper = vin.toUpperCase()
  if (KNOWN_VINS[upper]) return KNOWN_VINS[upper]

  const wmi = upper.substring(0, 3)
  if (wmi.startsWith('WBA') || wmi.startsWith('WBS')) return { vin: upper, make: 'BMW', model: 'Series 3', year: 2012, engine: 'N47D20', fuel: 'Diesel' }
  if (wmi.startsWith('WVW') || wmi.startsWith('WV2')) return { vin: upper, make: 'VW', model: 'Golf', year: 2009, engine: 'BKC', fuel: 'Diesel' }
  if (wmi.startsWith('WDB') || wmi.startsWith('WDD')) return { vin: upper, make: 'Mercedes', model: 'C-Class', year: 2014, engine: 'OM651', fuel: 'Diesel' }
  if (wmi.startsWith('W0L')) return { vin: upper, make: 'Opel', model: 'Astra H', year: 2008, engine: 'Z16XER', fuel: 'Βενζίνη' }
  if (wmi.startsWith('SB1') || wmi.startsWith('JTD')) return { vin: upper, make: 'Toyota', model: 'Yaris', year: 2016, engine: '1KR-FE', fuel: 'Βενζίνη' }
  if (wmi.startsWith('WF0') || wmi.startsWith('WFO')) return { vin: upper, make: 'Ford', model: 'Focus', year: 2011, engine: 'HHDA', fuel: 'Diesel' }
  if (wmi.startsWith('VF3') || wmi.startsWith('VF7')) return { vin: upper, make: 'Peugeot', model: '208 1.2', year: 2015, engine: 'HMZ', fuel: 'Βενζίνη' }
  if (wmi.startsWith('VSS') || wmi.startsWith('VSK')) return { vin: upper, make: 'SEAT', model: 'Ibiza', year: 2011, engine: 'BME', fuel: 'Βενζίνη' }

  return { vin: upper, make: 'Opel', model: 'Astra', year: 2010, engine: 'Z16XER', fuel: 'Βενζίνη' }
}

// ─── Standard parts template ──────────────────────────────────────────────────
// Common dismantled car parts. Prices are realistic Greek market suggestions.

export const CAR_PARTS_TEMPLATE: TemplatePart[] = [
  { id: 't01', partName: 'Κινητήρας', categoryId: 'engine', suggestedPrice: 800 },
  { id: 't02', partName: 'Σασμάν', categoryId: 'transmission', suggestedPrice: 350 },
  { id: 't03', partName: 'Κεφαλή κινητήρα', categoryId: 'engine', suggestedPrice: 250 },
  { id: 't04', partName: 'Τουρμπίνα', categoryId: 'engine', suggestedPrice: 320 },
  { id: 't05', partName: 'Εγκέφαλος κινητήρα (ECU)', categoryId: 'electrical', suggestedPrice: 280 },
  { id: 't06', partName: 'Φανάρι εμπρός αριστερό', categoryId: 'lighting', suggestedPrice: 80 },
  { id: 't07', partName: 'Φανάρι εμπρός δεξί', categoryId: 'lighting', suggestedPrice: 80 },
  { id: 't08', partName: 'Φανάρι πίσω αριστερό', categoryId: 'lighting', suggestedPrice: 55 },
  { id: 't09', partName: 'Φανάρι πίσω δεξί', categoryId: 'lighting', suggestedPrice: 55 },
  { id: 't10', partName: 'Προφυλακτήρας εμπρός', categoryId: 'body', suggestedPrice: 65 },
  { id: 't11', partName: 'Προφυλακτήρας πίσω', categoryId: 'body', suggestedPrice: 55 },
  { id: 't12', partName: 'Κάπο', categoryId: 'body', suggestedPrice: 120 },
  { id: 't13', partName: 'Πόρτα οδηγού', categoryId: 'body', suggestedPrice: 150 },
  { id: 't14', partName: 'Πόρτα συνοδηγού', categoryId: 'body', suggestedPrice: 150 },
  { id: 't15', partName: 'Αερόσακος οδηγού', categoryId: 'interior', suggestedPrice: 90 },
  { id: 't16', partName: 'Αερόσακος συνοδηγού', categoryId: 'interior', suggestedPrice: 90 },
  { id: 't17', partName: 'Καθρέφτης αριστερός', categoryId: 'body', suggestedPrice: 45 },
  { id: 't18', partName: 'Καθρέφτης δεξιός', categoryId: 'body', suggestedPrice: 45 },
  { id: 't19', partName: 'Ψυγείο νερού', categoryId: 'cooling', suggestedPrice: 110 },
  { id: 't20', partName: 'Μίζα', categoryId: 'electrical', suggestedPrice: 38 },
]
