import { CATEGORIES } from '@/lib/constants'
import type { Part } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PartSearchOptions {
  sellerName?: string
  sellerCity?: string
}

// ─── 1. Normalize ─────────────────────────────────────────────────────────────
// Removes Greek tonos/diacritics, lowercases, normalises separators to spaces.

export function normalizeSearchText(input: string): string {
  return input
    .normalize('NFD')                      // decompose: "έ" → "ε" + combining acute
    .replace(/[̀-ͯ]/g, '')       // remove all combining diacritical marks
    .toLowerCase()
    .replace(/[-_/.,;:]+/g, ' ')           // common separators → space
    .replace(/\s+/g, ' ')                  // collapse whitespace
    .trim()
}

// ─── 2. Tokenise ──────────────────────────────────────────────────────────────

export function tokenizeSearchQuery(query: string): string[] {
  const normalized = normalizeSearchText(query)
  const tokens = normalized.split(' ').filter((t) => t.length >= 2)
  return [...new Set(tokens)]
}

// ─── 3. Synonym groups ────────────────────────────────────────────────────────
// Each inner array is one equivalence group.
// Entries are normalised at module init time.

const RAW_SYNONYM_GROUPS: string[][] = [
  // Mirror
  ['καθρεφτης', 'καθρεπτης', 'mirror', 'kathreftis', 'kathreftes', 'katreftes'],
  // Lights
  ['φαναρι', 'φωτα', 'fanari', 'fanaria', 'headlight', 'taillight', 'light'],
  // Bumper
  ['προφυλακτηρας', 'bumper', 'profylaktiras'],
  // ECU / brain
  ['εγκεφαλος', 'εγκεφαλο', 'ecu', 'module', 'egkefalos'],
  // Gearbox
  ['σασμαν', 'κιβωτιο', 'gearbox', 'transmission', 'sasman', 'sasma'],
  // Engine
  ['κινητηρας', 'μοτερ', 'engine', 'motor', 'kinytiras', 'kinithras'],
  // Door
  ['πορτα', 'door', 'porta'],
  // Hood / bonnet
  ['καπο', 'hood', 'bonnet', 'kapo'],
  // Starter motor
  ['μιζα', 'starter', 'miza'],
  // Alternator
  ['δυναμο', 'alternator', 'dynamo'],
  // Radiator
  ['ψυγειο', 'radiator', 'psygeio'],
  // Turbo
  ['τουρμπο', 'τουρμπινα', 'turbo', 'tourmpo', 'tourmvina'],
  // Wheel / rim
  ['ζαντα', 'wheel', 'rim', 'zanta'],
  // Airbag
  ['αεροσακος', 'airbag', 'aerosakos'],
  // DPF
  ['dpf', 'φιλτρο'],
  // Catalyst
  ['καταλυτης', 'catalyst'],
  // ABS (same in all languages, single token)
  ['abs'],
]

// Build lookup: normalised term → all other normalised terms in its group.
// Computed once at module load time.
const SYNONYM_MAP = new Map<string, string[]>()
for (const group of RAW_SYNONYM_GROUPS) {
  const normed = group.map(normalizeSearchText)
  for (const term of normed) {
    SYNONYM_MAP.set(term, normed.filter((t) => t !== term))
  }
}

// ─── 4. Expand tokens ─────────────────────────────────────────────────────────

export function expandSearchTokens(tokens: string[]): string[] {
  const expanded = new Set<string>(tokens)
  for (const token of tokens) {
    for (const syn of SYNONYM_MAP.get(token) ?? []) {
      expanded.add(syn)
    }
  }
  return [...expanded]
}

// ─── 5. Build search document ─────────────────────────────────────────────────
// Concatenates all searchable fields into a single normalised string.

export function buildPartSearchDocument(part: Part, options?: PartSearchOptions): string {
  const categoryLabel = CATEGORIES.find((c) => c.id === part.categoryId)?.name ?? ''

  // Include SKU in two forms: "pl 001 0001" (separators→spaces) and "pl0010001" (flattened)
  // so both "PL-001-0001" and "PL0010001" style queries work.
  const skuNormal = normalizeSearchText(part.sku)
  const skuFlat   = skuNormal.replace(/\s/g, '')

  const fields: string[] = [
    part.partName,
    skuNormal,
    skuFlat,
    part.description ?? '',
    part.categoryId,
    categoryLabel,
    part.vehicle.make,
    part.vehicle.model,
    String(part.vehicle.year),
    part.vehicle.engine ?? '',
    part.vehicle.fuel ?? '',
    part.vehicle.vin ?? '',
    options?.sellerName ?? '',
    options?.sellerCity ?? '',
  ]

  return fields
    .map(normalizeSearchText)
    .filter(Boolean)
    .join(' ')
}

// ─── 6. Score ─────────────────────────────────────────────────────────────────
// Returns 0 for no match, positive integer for a match.
// Higher = better match; used for relevance sorting.
//
// Multi-keyword AND logic:
//   1 token  → at least 1 must match  (trivial)
//   2 tokens → at least 1 must match  (loose — score separates quality)
//   3 tokens → at least 2 must match  (most of them)
//   4+       → at least ceil(n/2) must match

export function scorePartSearch(
  part: Part,
  query: string,
  options?: PartSearchOptions,
): number {
  const trimmed = query.trim()
  if (!trimmed) return 0

  const tokens = tokenizeSearchQuery(trimmed)
  if (tokens.length === 0) return 0

  const doc = buildPartSearchDocument(part, options)

  // For each query token, check if it OR any synonym appears in the document
  let matchedCount = 0
  for (const token of tokens) {
    const candidates = [token, ...(SYNONYM_MAP.get(token) ?? [])]
    if (candidates.some((c) => doc.includes(c))) {
      matchedCount++
    }
  }

  // Minimum threshold
  const minMatch = Math.max(1, Math.ceil(tokens.length / 2))
  if (matchedCount < minMatch) return 0

  let score = matchedCount * 10

  // Bonus: exact phrase appears anywhere in the part name
  const normName  = normalizeSearchText(part.partName)
  const normQuery = normalizeSearchText(trimmed)
  if (normName.includes(normQuery)) score += 20

  // Bonus: exact SKU match (compare dash-stripped forms)
  const skuFlat      = normalizeSearchText(part.sku).replace(/\s/g, '')
  const queryFlat    = normQuery.replace(/\s/g, '')
  if (skuFlat === queryFlat) score += 30

  // Bonus: every token matched
  if (matchedCount === tokens.length) score += 5

  return score
}

// ─── 7. Boolean match ─────────────────────────────────────────────────────────

export function matchesPartSearch(
  part: Part,
  query: string,
  options?: PartSearchOptions,
): boolean {
  return scorePartSearch(part, query, options) > 0
}
