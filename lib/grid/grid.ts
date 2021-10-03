import {
  createHexPrototype,
  Grid,
  Hex,
  HexCoordinates,
  HexPrototypeOptions,
  Orientation,
  rectangle,
  spiral,
} from 'honeycomb-grid';

import { FixedLengthArray } from '../FixedLengthArray';
import { IElevationSettings } from './elevation';
import { IMoistureSettings } from './moisture';
import { INode, Node } from './Node';

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

  constructor(settings: IGridSettings) {
    const hexPrototype = createHexPrototype<N>({ ...settings, visibility: 'undiscovered' });
    const transverser = rectangle<N>({ start: [0, 0], width: 10, height: 10 });
    super(hexPrototype, transverser);

    this.viewDistance = settings.viewDistance;
    this.elevationSettings = settings.elevation;
    this.moistureSettings = settings.moisture;
    this.contourSettings = settings.contour;
  }

  fov(start: HexCoordinates) {
    this.traverse(spiral({ start, radius: this.viewDistance }))
      .each(tile => {
        console.log(tile);
        tile.visibility = 'visible';
      })
      .run();
  }

  elevation() {}

  moisture() {}
}

export function generateGrid(settings?: Partial<IGridSettings>): HexGrid<Node> {
  const defaultSettings: IGridSettings = {
    viewDistance: 3,
    dimensions: 50,
    orientation: Orientation.FLAT,
    origin: 'topLeft',
    offset: 0,
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
  grid.fov([4, 3]);

  return grid;
}
