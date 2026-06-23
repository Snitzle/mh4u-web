export interface NavEntity {
  href: string;
  label: string;
  blurb: string;
}

export const ENTITIES: NavEntity[] = [
  { href: '/monsters', label: 'Monsters', blurb: 'Weaknesses, drops, habitats' },
  { href: '/weapons', label: 'Weapons', blurb: 'All 14 types and upgrade trees' },
  { href: '/armor', label: 'Armor', blurb: 'Defense, resistances and skills' },
  { href: '/items', label: 'Items', blurb: 'Materials, where to get them' },
  { href: '/quests', label: 'Quests', blurb: 'Goals, rewards and monsters' },
];
