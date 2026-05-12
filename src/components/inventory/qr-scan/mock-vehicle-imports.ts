import type { VehicleImport } from '@/components/inventory/vin-import/types'

// Mock vehicle imported via /seller/inventory/vin-import.
// Represents the state right after a full VIN Import is completed.
//
// Scanning vehicleQrValue ("partlink:vehicle:seller-001:VEH-001-8405")
// or the short code ("VEH-001-8405") opens the vehicle context in the QR
// scan screen, showing all linked parts and the action "Ποιο ανταλλακτικό βγήκε;"
export const MOCK_VEHICLE_IMPORTS: VehicleImport[] = [
  {
    vehicleCode: 'VEH-001-8405',
    vehicleQrValue: 'partlink:vehicle:seller-001:VEH-001-8405',
    vehicle: {
      vin: 'WBA3A5C56DF589213',
      make: 'BMW',
      model: 'E90 320d',
      year: 2013,
      engine: 'N47D20',
      fuel: 'Diesel',
    },
    parts: [
      { templateId: 't01', partName: 'Κινητήρας',                  categoryId: 'engine',        condition: 'good',      price: 750, sku: 'PL-001-1001', publishToMarketplace: true },
      { templateId: 't02', partName: 'Σασμάν',                     categoryId: 'transmission',  condition: 'good',      price: 320, sku: 'PL-001-1002', publishToMarketplace: true },
      { templateId: 't04', partName: 'Τουρμπίνα',                  categoryId: 'engine',        condition: 'very_good', price: 290, sku: 'PL-001-1003', publishToMarketplace: true },
      { templateId: 't05', partName: 'Εγκέφαλος κινητήρα (ECU)',   categoryId: 'electrical',    condition: 'good',      price: 260, sku: 'PL-001-1004', publishToMarketplace: false },
      { templateId: 't06', partName: 'Φανάρι εμπρός αριστερό',     categoryId: 'lighting',      condition: 'good',      price: 75,  sku: 'PL-001-1005', publishToMarketplace: true },
      { templateId: 't07', partName: 'Φανάρι εμπρός δεξί',         categoryId: 'lighting',      condition: 'good',      price: 75,  sku: 'PL-001-1006', publishToMarketplace: true },
      { templateId: 't10', partName: 'Προφυλακτήρας εμπρός',       categoryId: 'body',          condition: 'fair',      price: 50,  sku: 'PL-001-1007', publishToMarketplace: false },
      { templateId: 't12', partName: 'Κάπο',                       categoryId: 'body',          condition: 'good',      price: 110, sku: 'PL-001-1008', publishToMarketplace: true },
      { templateId: 't13', partName: 'Πόρτα οδηγού',               categoryId: 'body',          condition: 'good',      price: 140, sku: 'PL-001-1009', publishToMarketplace: true },
      { templateId: 't19', partName: 'Ψυγείο νερού',               categoryId: 'cooling',       condition: 'good',      price: 95,  sku: 'PL-001-1010', publishToMarketplace: true },
    ],
  },
]

export function findVehicleImport(vehicleCode: string): VehicleImport | undefined {
  return MOCK_VEHICLE_IMPORTS.find((v) => v.vehicleCode === vehicleCode)
}
