import type {
  Armor,
  ArmorSummary,
  Detail,
  Item,
  ItemSummary,
  Monster,
  MonsterSummary,
  Paginated,
  Quest,
  QuestSummary,
  SearchResults,
  SkillTreeSummary,
  Weapon,
  WeaponSummary,
} from './types';

const SERVER_BASE = process.env.API_BASE_URL ?? 'http://localhost:8088/api/v1';
const PUBLIC_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8088/api/v1';

function base(): string {
  return typeof window === 'undefined' ? SERVER_BASE : PUBLIC_BASE;
}

interface FetchOptions {
  query?: Record<string, string | number | undefined>;
  revalidate?: number;
}

export async function apiGet<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const params = new URLSearchParams({ lang: 'en' });

  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  }

  const url = `${base()}${path}?${params.toString()}`;
  const response = await fetch(url, { next: { revalidate: options.revalidate ?? 3600 } });

  if (!response.ok) {
    throw new Error(`API request failed (${response.status}): ${path}`);
  }

  return response.json() as Promise<T>;
}

// --- Typed endpoint helpers -------------------------------------------------

export const api = {
  monsters: (query?: FetchOptions['query']) => apiGet<Paginated<MonsterSummary>>('/monsters', { query }),
  monster: (id: number | string) => apiGet<Detail<Monster>>(`/monsters/${id}`),

  weapons: (query?: FetchOptions['query']) => apiGet<Paginated<WeaponSummary>>('/weapons', { query }),
  weapon: (id: number | string) => apiGet<Detail<Weapon>>(`/weapons/${id}`),

  armorList: (query?: FetchOptions['query']) => apiGet<Paginated<ArmorSummary>>('/armor', { query }),
  armor: (id: number | string) => apiGet<Detail<Armor>>(`/armor/${id}`),

  items: (query?: FetchOptions['query']) => apiGet<Paginated<ItemSummary>>('/items', { query }),
  item: (id: number | string) => apiGet<Detail<Item>>(`/items/${id}`),

  quests: (query?: FetchOptions['query']) => apiGet<Paginated<QuestSummary>>('/quests', { query }),
  quest: (id: number | string) => apiGet<Detail<Quest>>(`/quests/${id}`),

  skillTrees: (query?: FetchOptions['query']) => apiGet<Paginated<SkillTreeSummary>>('/skill-trees', { query }),

  search: (q: string, types?: string) =>
    apiGet<SearchResults>('/search', { query: { q, types }, revalidate: 0 }),
};
