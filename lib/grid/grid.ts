import {
  createHexPrototype,
  Grid,
  Hex,
  HexCoordinates,
  HexPrototypeOptions,
  Orientation,
  rays,
  spiral,
} from 'honeycomb-grid';
import SimplexNoise from 'simplex-noise';

import { FixedLengthArray } from '../FixedLengthArray';
import { IElevationSettings } from './elevation';
import { IMoistureSettings } from './moisture';
import { INode, Node } from './node';
import * as Terrains from './terrain';

export interface IGridSettings extends HexPrototypeOptions {
  viewDistance: number;
  elevation: IElevationSettings;
  moisture: IMoistureSettings;
  contour: FixedLengthArray<number, 5>;
}

export interface IGrid {
  viewDistance: number;
  elevationSettings: IElevationSettings;
  moistureSettings: IMoistureSettings;
  contourSettings: FixedLengthArray<number, 5>;
}

export class HexGrid<N extends INode & Hex> extends Grid<N> implements IGrid {
  readonly viewDistance: number;
  readonly elevationSettings: IElevationSettings;
  readonly moistureSettings: IMoistureSettings;
  readonly contourSettings: FixedLengthArray<number, 5>;
  private readonly elevationNoise: SimplexNoise;

  constructor(settings: IGridSettings) {
    const hexPrototype = createHexPrototype<N>({
      ...settings,
      visibility: 'undiscovered',
    });
    const transverser = spiral<N>({ start: [0, 0], radius: 20 });
    super(hexPrototype, transverser);

    this.viewDistance = settings.viewDistance;
    this.elevationSettings = settings.elevation;
    this.moistureSettings = settings.moisture;
    this.contourSettings = settings.contour;
    this.elevationNoise = new SimplexNoise(this.elevationSettings.seed);
  }

  fov(start: HexCoordinates) {
    this.traverse(
      rays({
        start,
        length: this.viewDistance,
        updateRay: (ray) => {
          const result = ray.reduce(
            (state, tile) => {
              if (!state.opaque && tile.terrain) {
                state.tiles.push(tile);
                state.opaque = tile.terrain.opaque;
              }
              return state;
            },
            { opaque: false, tiles: [] as Array<N> }
          );
          return result.tiles;
        },
      })
    )
      .each((tile) => {
        tile.visibility = 'visible';
      })
      .run();
  }

  elevation() {
    this.filter((tile) => !tile.terrain)
      .each((tile) => {
        tile.terrain = this.getTerrainForHex(tile);
      })
      .run();
  }

  private getTerrainForHex(hex: N): Terrains.Terrain {
    const e = this.calculateHexElevation(hex.x, hex.y);
    if (e <= 0.2) {
      return Terrains.WATER;
    } else if (e <= 0.8) {
      return Terrains.FIELD;
    } else {
      return Terrains.MOUNTAIN;
    }
  }

  private calculateHexElevation(x: number, y: number) {
    const { octave0, octave1, octave2, octave3, redistribution } =
      this.elevationSettings;
    let e: number =
      octave0 * this.elevationNoise.noise2D(x, y) +
      octave1 * this.elevationNoise.noise2D(4 * x, 4 * y) +
      octave2 * this.elevationNoise.noise2D(8 * x, 8 * y) +
      octave3 * this.elevationNoise.noise2D(16 * x, 16 * y);
    e = (e + 1) / 2; // from -1 to 1  --> from 0 to 1

    if (e < 0) e = 0;
    if (e > 1) e = 1;

    const redistributed = Math.pow(e, redistribution);

    return redistributed;
  }

  moisture() {}
}

export function generateGrid(settings?: Partial<IGridSettings>): HexGrid<Node> {
  const defaultSettings: IGridSettings = {
    viewDistance: 3,
    dimensions: { height: 50, width: 50 },
    orientation: Orientation.FLAT,
    origin: 'topLeft', // { x: 0, y: 0 },
    offset: 1,
    contour: [0.2, 0.3, 0.5, 0.7, 0.9],
    elevation: {
      createIsland: false,
      seed: 'fdc9a9ca516c78d1f830948badf1875d88424406',
      frequency: 0.8,
      redistribution: 1.0,
      octave0: 1,
      octave1: 0.5,
      octave2: 0.25,
      octave3: 0.12,
    },
    moisture: {
      seed: 'd049b358d128cb265740a90fce37904ce07cd653',
      draw: true,
      frequency: 0.8,
      redistribution: 1.0,
      octave0: 1,
      octave1: 0.5,
      octave2: 0.25,
      octave3: 0.12,
    },
  };
  const s = { ...defaultSettings, ...settings };
  const grid = new HexGrid(s);
  grid.elevation();
  grid.fov([4, 3]);

  return grid;
}
