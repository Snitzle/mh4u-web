/** Build a path with a query string, dropping empty/undefined values. */
export function queryHref(basePath: string, params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      search.set(key, value);
    }
  }
  const qs = search.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** Rarity 1–10, as filter chip options. */
export const RARITY_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}));

/** Quest star rank 1–10. */
export const STAR_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  value: String(i + 1),
  label: '★'.repeat(i + 1),
}));

/** Weapon elements / ailments. */
export const ELEMENT_OPTIONS = [
  'Fire', 'Water', 'Thunder', 'Ice', 'Dragon', 'Blastblight', 'Poison', 'Paralysis', 'Sleep',
].map((element) => ({ value: element, label: element }));

/** Item types present in the database. */
export const ITEM_TYPE_OPTIONS = [
  'Account', 'Ammo', 'Bait', 'Bone', 'Book', 'Bug', 'Coating', 'Coin/Ticket', 'Commodity',
  'Consumable', 'Decoration', 'Fish', 'Flesh', 'Meat', 'Nectar', 'Ore', 'Plant', 'Sac/Fluid',
  'Scrap', 'Supply', 'Tool', 'Wystone',
].map((type) => ({ value: type, label: type }));
