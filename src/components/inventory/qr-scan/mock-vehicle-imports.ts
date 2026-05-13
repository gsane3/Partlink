// Re-exports the canonical vehicle import mock data from src/lib/mock-data.
// The QR scan screen uses findVehicleImport() to resolve a vehicleCode → VehicleImport.
export { findMockVehicleImport as findVehicleImport } from '@/lib/mock-data/vehicle-imports'
