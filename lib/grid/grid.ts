import {
  BoundingBox,
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
  size: number;
}

export interface IGrid {
  viewDistance: number;
  elevationSettings: IElevationSettings;
  moistureSettings: IMoistureSettings;
  contourSettings: FixedLengthArray<number, 5>;
  size: number;
}

export class HexGrid<N extends INode & Hex> extends Grid<N> implements IGrid {
  readonly viewDistance: number;
  readonly elevationSettings: IElevationSettings;
  readonly moistureSettings: IMoistureSettings;
  readonly contourSettings: FixedLengthArray<number, 5>;
  private readonly elevationNoise: SimplexNoise;
  readonly qtyHexesX: number;
  readonly qtyHexesY: number;
  readonly size: number;

  constructor(settings: IGridSettings) {
    const hexPrototype = createHexPrototype<N>({
      ...settings,
      visibility: 'undiscovered',
    });
    const transverser = spiral<N>({ start: [0, 0], radius: settings.size });
    super(hexPrototype, transverser);

    this.size = settings.size;
    this.qtyHexesX = (settings.dimensions as BoundingBox).width * 2 + 1;
    this.qtyHexesY = (settings.dimensions as BoundingBox).height * 2 + 1;
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
        const e = this.calculateHexElevation(tile.r, tile.q);
        tile.level = e;
        tile.terrain = this.getTerrainForHex(e);
      })
      .run();
  }

  private getTerrainForHex(e: number): Terrains.Terrain {
    if (e < 1) {
      return Terrains.WATER;
    } else if (e < 2) {
      return Terrains.SAND;
    } else if (e < 5) {
      return Terrains.FIELD;
    } else if (e < 6) {
      return Terrains.DIRT;
    } else {
      return Terrains.MOUNTAIN;
    }
  }

  private calculateHexElevation(x: number, y: number) {
    const { octave0, octave1, octave2, octave3, redistribution } =
      this.elevationSettings;
    const nx: number = x / this.qtyHexesX - 0.5;
    const ny: number = y / this.qtyHexesY - 0.5;
    let e: number =
      octave0 * this.elevationNoise.noise2D(nx, ny) +
      octave1 * this.elevationNoise.noise2D(4 * nx, 4 * ny) +
      octave2 * this.elevationNoise.noise2D(8 * nx, 8 * ny) +
      octave3 * this.elevationNoise.noise2D(16 * nx, 16 * ny);
    // e = (e + 1) / 2; // from -1 to 1  --> from 0 to 1

    if (e < 0) e = 0;
    if (e > 1) e = 1;

    // const redistributed = Math.pow(e, redistribution);
    const redistributed = Math.round(e * 7);

    return redistributed;
  }

  moisture() {}
}

export function generateGrid(settings?: Partial<IGridSettings>): HexGrid<Node> {
  const defaultSettings: IGridSettings = {
    size: 20,
    viewDistance: 3,
    dimensions: { height: 50, width: 50 },
    orientation: Orientation.FLAT,
    origin: 'topLeft', // { x: 0, y: 0 },
    offset: 1,
    contour: [0.2, 0.3, 0.5, 0.7, 0.9],
    elevation: {
      createIsland: false,
      seed: 'adc9a9ca51217841f830942badf1675d8s424415',
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
  grid.fov([3, 3]);

  return grid;
}
