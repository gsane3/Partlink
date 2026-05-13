import { mockParts } from './parts'
import { mockVehicleImports } from './vehicle-imports'
import type { PartCondition } from '@/types'
import type { PriceMode } from '@/lib/catalog/vehicle-part-catalog'
import type { VehicleImport } from '@/components/inventory/vin-import/types'

// Normalized part info for the detail / enrichment page.
// Works for both manual (mockParts) and VIN-import-generated parts.

export interface PartInfo {
  partId: string             // Part.id for manual; sku for VIN import
  sku: string
  partName: string
  categoryId: string
  condition: PartCondition
  price: number
  priceMode: PriceMode
  description?: string
  existingPhotoUrls: string[]
  sourceType: 'manual' | 'vin_import'
  donorVehicle?: {
    make: string
    model: string
    year: number
    vin: string
    engine: string
    fuel: string
    mileage?: number
    vehicleCode?: string    // only for VIN import — enables back-link to vehicle detail
  }
}

export function findPartDetail(partIdOrSku: string): PartInfo | null {
  // 1. Regular part by id
  const byId = mockParts.find((p) => p.id === partIdOrSku)
  if (byId) {
    return {
      partId: byId.id,
      sku: byId.sku,
      partName: byId.partName,
      categoryId: byId.categoryId,
      condition: byId.condition,
      price: byId.price,
      priceMode: byId.price > 0 ? 'fixed' : 'on_request',
      description: byId.description,
      existingPhotoUrls: byId.photos.map((ph) => ph.url),
      sourceType: 'manual',
      donorVehicle: byId.vehicle
        ? {
            make: byId.vehicle.make,
            model: byId.vehicle.model,
            year: byId.vehicle.year,
            vin: byId.vehicle.vin ?? '',
            engine: byId.vehicle.engine ?? '',
            fuel: byId.vehicle.fuel ?? '',
          }
        : undefined,
    }
  }

  // 2. Regular part by sku
  const bySku = mockParts.find((p) => p.sku === partIdOrSku)
  if (bySku) {
    return {
      partId: bySku.id,
      sku: bySku.sku,
      partName: bySku.partName,
      categoryId: bySku.categoryId,
      condition: bySku.condition,
      price: bySku.price,
      priceMode: bySku.price > 0 ? 'fixed' : 'on_request',
      description: bySku.description,
      existingPhotoUrls: bySku.photos.map((ph) => ph.url),
      sourceType: 'manual',
      donorVehicle: bySku.vehicle
        ? {
            make: bySku.vehicle.make,
            model: bySku.vehicle.model,
            year: bySku.vehicle.year,
            vin: bySku.vehicle.vin ?? '',
            engine: bySku.vehicle.engine ?? '',
            fuel: bySku.vehicle.fuel ?? '',
          }
        : undefined,
    }
  }

  // 3. VIN-import part by sku (or templateId as fallback)
  for (const imp of mockVehicleImports) {
    const part = imp.parts.find(
      (p) => p.sku === partIdOrSku || p.templateId === partIdOrSku
    )
    if (part) {
      return {
        partId: part.sku,
        sku: part.sku,
        partName: part.partName,
        categoryId: part.categoryId,
        condition: part.condition,
        price: part.price,
        priceMode: part.priceMode,
        description: undefined,
        existingPhotoUrls: [],
        sourceType: 'vin_import',
        donorVehicle: {
          make: imp.vehicle.make,
          model: imp.vehicle.model,
          year: imp.vehicle.year,
          vin: imp.vehicle.vin,
          engine: imp.vehicle.engine,
          fuel: imp.vehicle.fuel,
          mileage: imp.mileage,
          vehicleCode: imp.vehicleCode,
        },
      }
    }
  }

  return null
}

export function getVehicleImportForPart(skuOrId: string): VehicleImport | undefined {
  return mockVehicleImports.find((imp) =>
    imp.parts.some((p) => p.sku === skuOrId || p.templateId === skuOrId)
  )
}
