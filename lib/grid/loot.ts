export enum RarityLevel {
  Common,
  Rare,
  Epic,
  Legendary,
  Unique,
}

export interface ILoot {
  rarity: RarityLevel;
  occurrence: number;
  name: string;
  description: string;
  color?: string;
}
