export interface Terrain {
  type: TerrainType;
  passable: boolean;
  opaque: boolean;
}

export enum TerrainType {
  Field,
  Water,
  Mountain,
}

export const FIELD: Terrain = {
  type: TerrainType.Field,
  opaque: false,
  passable: true,
};

export const WATER: Terrain = {
  type: TerrainType.Water,
  opaque: false,
  passable: false,
};

export const MOUNTAIN: Terrain = {
  type: TerrainType.Mountain,
  opaque: true,
  passable: true,
};
