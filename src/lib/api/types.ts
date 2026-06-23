// Domain types mirroring the mh4u-api v1 resources. The web client always
// requests ?lang=en, so translatable fields arrive as plain strings.

export interface Paginated<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
}

export interface Detail<T> {
  data: T;
}

export interface MonsterSummary {
  id: number;
  name: string;
  class: string;
  icon_url: string | null;
}

export interface MonsterDamage {
  body_part: string;
  cut: number | null;
  impact: number | null;
  shot: number | null;
  fire: number | null;
  water: number | null;
  ice: number | null;
  thunder: number | null;
  dragon: number | null;
  ko: number | null;
}

export interface MonsterWeakness {
  state: string;
  elements: Record<'fire' | 'water' | 'thunder' | 'ice' | 'dragon', number>;
  ailments: Record<'poison' | 'paralysis' | 'sleep', number>;
  traps: Record<string, number>;
}

export interface MonsterStatus {
  status: string;
  initial: number | null;
  increase: number | null;
  max: number | null;
  duration: number | null;
  damage: number | null;
}

export interface HuntingReward {
  condition: string;
  rank: string;
  stack_size: number;
  percentage: number;
  item?: ItemSummary;
  monster?: MonsterSummary;
}

export interface MonsterHabitat {
  start_area: number | null;
  move_area: string | null;
  rest_area: number | null;
  location?: LocationSummary;
}

export interface Monster extends MonsterSummary {
  signature_move: string;
  trait: string;
  damage?: MonsterDamage[];
  weaknesses?: MonsterWeakness[];
  statuses?: MonsterStatus[];
  ailments?: string[];
  habitats?: MonsterHabitat[];
  hunting_rewards?: Record<string, HuntingReward[]>;
  quests?: QuestSummary[];
}

export interface ItemSummary {
  id: number;
  name: string;
  type: string;
  sub_type: string;
  rarity: number;
  icon_url: string | null;
}

export interface Item extends ItemSummary {
  carry_capacity: number;
  buy: number | null;
  sell: number | null;
  description: string | null;
  monster_rewards?: HuntingReward[];
  quest_rewards?: { reward_slot: string; percentage: number; stack_size: number; quest?: QuestSummary }[];
  gathering?: { area: string; site: string; rank: string; percentage: number | null; location?: LocationSummary }[];
  components_required?: ComponentLine[];
  used_in?: ComponentLine[];
}

export interface ComponentLine {
  quantity: number;
  type: string | null;
  created_item?: ItemSummary;
  component_item?: ItemSummary;
}

export interface WeaponSummary {
  id: number;
  name: string | null;
  wtype: string;
  rarity: number | null;
  attack: number;
  num_slots: number;
  final: boolean | null;
  icon_url: string | null;
}

export interface Weapon extends WeaponSummary {
  tree_depth: number;
  affinity: string;
  defense: number | null;
  element?: { type: string; attack: number | null };
  element_2?: { type: string; attack: number | null };
  sharpness?: string;
  horn_notes?: string;
  ammo?: string;
  children?: WeaponSummary[];
  parent?: WeaponSummary;
  melodies?: { notes: string; song: string; effect1: string; duration: string }[];
}

export interface ArmorSummary {
  id: number;
  name: string | null;
  slot: string;
  rarity: number | null;
  defense: number;
  max_defense: number | null;
  num_slots: number | null;
  icon_url: string | null;
}

export interface Armor extends ArmorSummary {
  resistances: Record<'fire' | 'water' | 'thunder' | 'ice' | 'dragon', number>;
  gender: string;
  hunter_type: string;
  skill_trees?: SkillTreePoint[];
}

export interface SkillTreePoint {
  id: number;
  name: string;
  points: number | null;
}

export interface DecorationSummary {
  id: number;
  name: string | null;
  rarity: number | null;
  num_slots: number;
  icon_url: string | null;
}

export interface QuestSummary {
  id: number;
  name: string;
  hub: string;
  type: string;
  stars: number;
}

export interface Quest extends QuestSummary {
  goal: string;
  reward: number;
  hrp: number | null;
  fee: number;
  location?: LocationSummary;
  monsters?: MonsterSummary[];
  rewards?: Record<string, { percentage: number; stack_size: number; item?: ItemSummary }[]>;
}

export interface LocationSummary {
  id: number;
  name: string;
  map_url: string | null;
}

export interface SkillTreeSummary {
  id: number;
  name: string;
}

export interface SearchHit {
  type: string;
  id: number;
  name: string;
  icon_url: string | null;
  url: string;
}

export interface SearchResults {
  data: Record<string, SearchHit[]>;
  meta: { query: string };
}
