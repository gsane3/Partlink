// Shared mock profiles for the demo user session.
// Replace with real auth/session data when backend is integrated.

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BuyerProfile {
  id: string
  companyName: string
  contactName: string
  phone: string
  email: string
  city: string
  address: string
  postalCode: string
  verificationStatus: 'approved' | 'pending' | 'rejected'
  documentPreference: 'invoice' | 'receipt'
}

export interface SellerProfile {
  id: string
  businessName: string
  contactName: string
  phone: string
  email: string
  city: string
  address: string
  verificationStatus: 'approved' | 'pending' | 'rejected'
}

// ─── Mock data ────────────────────────────────────────────────────────────────

export const currentBuyerProfile: BuyerProfile = {
  id:                   'buyer-001',
  companyName:          'Papadopoulos Auto Parts',
  contactName:          'Γιώργος Παπαδόπουλος',
  phone:                '69 0000 0000',
  email:                'buyer@example.com',
  city:                 'Αθήνα',
  address:              'Λεωφόρος Αθηνών 45',
  postalCode:           '104 41',
  verificationStatus:   'approved',
  documentPreference:   'invoice',
}

export const currentSellerProfile: SellerProfile = {
  id:                   'seller-001',
  businessName:         'Μάντρα Παπαδόπουλος',
  contactName:          'Νίκος Παπαδόπουλος',
  phone:                '210 000 0000',
  email:                'info@mantrapap.gr',
  city:                 'Αιγάλεω',
  address:              'Θηβών 120',
  verificationStatus:   'approved',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getCurrentBuyerProfile(): BuyerProfile {
  return currentBuyerProfile
}

export function getCurrentSellerProfile(): SellerProfile {
  return currentSellerProfile
}
