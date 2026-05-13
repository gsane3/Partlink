import type { Part } from '@/types'

// Marketplace readiness scoring for a Part.
// Guidance only — does not block publishing.

export type ReadinessLevel = 'ready' | 'basic' | 'needs_work'

export interface MarketplaceReadiness {
  level: ReadinessLevel
  label: string
  score: number      // 0–4: one point each for photo, description, price, published
  issues: string[]   // full issue labels
  hints: string[]    // short labels for compact inline display
}

const LEVEL_LABELS: Record<ReadinessLevel, string> = {
  ready:      'Έτοιμο',
  basic:      'Βασικό',
  needs_work: 'Θέλει δουλειά',
}

export function getMarketplaceReadiness(part: Part): MarketplaceReadiness {
  const issues: string[] = []
  const hints: string[] = []
  let score = 0

  if (part.photos.length > 0) {
    score++
  } else {
    issues.push('Χωρίς φωτογραφία')
    hints.push('φωτογραφία')
  }

  if (part.description && part.description.length > 10) {
    score++
  } else {
    issues.push('Χωρίς περιγραφή')
    hints.push('περιγραφή')
  }

  if (part.price > 0) {
    score++
  } else {
    issues.push('Χωρίς σταθερή τιμή — εμφανίζεται κατόπιν ζήτησης')
    hints.push('τιμή')
  }

  if (part.isPublished) {
    score++
  } else {
    issues.push('Δεν δημοσιεύεται στο marketplace')
    // omit from hints — visibility is shown by the published badge
  }

  const level: ReadinessLevel =
    score === 4 ? 'ready' :
    score >= 2  ? 'basic' :
                  'needs_work'

  return { level, label: LEVEL_LABELS[level], score, issues, hints }
}
