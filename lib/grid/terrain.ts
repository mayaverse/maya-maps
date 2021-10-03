export interface Terrain {
  type: TerrainType;
  passable: boolean;
  opaque: boolean;
}

export enum TerrainType {
  Field,
  Water,
}
