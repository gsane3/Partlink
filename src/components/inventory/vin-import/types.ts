import type { PartCondition } from '@/types'

export interface DecodedVehicle {
  vin: string
  make: string
  model: string
  year: number
  engine: string
  fuel: string
}

export interface TemplatePart {
  id: string
  partName: string
  categoryId: string
  suggestedPrice: number
}

export interface GeneratedPart {
  templateId: string
  partName: string
  categoryId: string
  condition: PartCondition
  price: number
  // Internal SKU for inventory lookup/search — not used as a QR label in VIN Import.
  // VIN Import uses a single vehicle-level QR instead.
  sku: string
  publishToMarketplace: boolean
}

// Vehicle-level import record created when a full car is imported.
// One QR label per vehicle, not per part.
//
// Future scan flow: when vehicleQrValue is scanned at the QR scan screen,
// the seller sees vehicle details, the list of linked parts that are still
// in stock, and the action "Ποιο ανταλλακτικό βγήκε;" to mark a specific
// part as removed/sold without scanning that part individually.
export interface VehicleImport {
  vehicleCode: string     // e.g. "VEH-001-8405"
  vehicleQrValue: string  // e.g. "partlink:vehicle:seller-001:VEH-001-8405"
  vehicle: DecodedVehicle
  parts: GeneratedPart[]
}
