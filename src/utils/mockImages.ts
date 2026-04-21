const DEFAULT_POOL = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&w=1200&q=80',
]

const CATEGORY_POOLS: Record<string, string[]> = {
  coffee: [
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80',
  ],
  pizza: [
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1548365328-9f547fb0953a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80',
  ],
  burger: [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=1200&q=80',
  ],
  salad: [
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
  ],
  dessert: [
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=1200&q=80',
  ],
  sushi: [
    'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=80',
  ],
  mexican: [
    'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1601924579440-1d7b8f1f9b57?auto=format&fit=crop&w=1200&q=80',
  ],
  grocery: [
    'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1579113800032-c38bd7635818?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=1200&q=80',
  ],
  default: DEFAULT_POOL,
}

const KEYWORD_TO_CATEGORY: Array<{ category: keyof typeof CATEGORY_POOLS; keywords: string[] }> = [
  { category: 'coffee', keywords: ['starbuck', 'starbucks', 'coffee', 'cafe', 'latte', 'boba', 'tea'] },
  { category: 'pizza', keywords: ['pizza'] },
  { category: 'burger', keywords: ['burger', 'sandwich'] },
  { category: 'salad', keywords: ['salad', 'healthy', 'bowl', 'mediterranean', 'cava'] },
  { category: 'dessert', keywords: ['dessert', 'ice cream', 'bakery', 'sweet'] },
  { category: 'sushi', keywords: ['sushi', 'japanese', 'ramen'] },
  { category: 'mexican', keywords: ['mexican', 'taco', 'burrito', 'chipotle'] },
  { category: 'grocery', keywords: ['grocery', 'market', 'trader joe', 'target', 'store'] },
]

function hashSeed(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function getMockImageBySeed(seed?: string): string {
  return getContextualMockImage(seed, seed)
}

export function getContextualMockImage(seed?: string, titleOrHint?: string): string {
  const pool = resolvePoolByHint(titleOrHint)
  if (!seed) {
    return pool[0]
  }
  const index = hashSeed(seed) % pool.length
  return pool[index]
}

function resolvePoolByHint(titleOrHint?: string): string[] {
  const hint = (titleOrHint || '').toLowerCase()
  if (!hint) return DEFAULT_POOL

  for (const entry of KEYWORD_TO_CATEGORY) {
    if (entry.keywords.some((keyword) => hint.includes(keyword))) {
      return CATEGORY_POOLS[entry.category] || DEFAULT_POOL
    }
  }

  return DEFAULT_POOL
}

export { DEFAULT_POOL as MOCK_IMAGE_POOL }
