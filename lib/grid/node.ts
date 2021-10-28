import { Hex } from 'honeycomb-grid';

import { Terrain } from './terrain';

export type Visibility = 'undiscovered' | 'discovered' | 'visible';

export interface INode {
  visibility: Visibility;
  terrain: Terrain;
  level: number;
}

export type Node = INode & Hex;
