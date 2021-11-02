import * as React from 'react';

import { generateGrid, HexGrid, IGridSettings } from '../grid/grid';
import { Node } from '../grid/node';

interface IPlayerHexCoordinates {
  column: number;
  row: number;
}
interface IHexGridContext {
  grid?: HexGrid<Node>;
  player?: IPlayerHexCoordinates;
  setPlayerLocation?: (q: number, r: number) => void;
}

const HexGridContext = React.createContext<IHexGridContext>({});
HexGridContext.displayName = 'HexGrid';

interface HexGridProviderProps extends Partial<IGridSettings> {
  startingCoordinates: IPlayerHexCoordinates;
  stepIntoStart: boolean;
}

export function HexGridProvider({
  children,
  startingCoordinates,
  stepIntoStart,
  ...settings
}: React.PropsWithChildren<HexGridProviderProps>) {
  const grid = React.useRef(generateGrid(settings));
  const [player, setPlayer] = React.useState<IPlayerHexCoordinates>();
  // const grid = React.useMemo(() => {
  //   console.log('generate grid', settings);
  //   return generateGrid(settings);
  // }, [settings]);
  const setPlayerLocation = React.useCallback((q, r) => {
    console.log('fov', [q, r]);
    grid.current.fov([q, r]);
    setPlayer({ column: q, row: r });
  }, []);

  React.useEffect(() => {
    if (!grid.current.playerLocation) {
      setPlayerLocation(startingCoordinates.column, startingCoordinates.row);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <HexGridContext.Provider
      value={{
        grid: grid.current,
        player,
        setPlayerLocation,
      }}
    >
      {children}
    </HexGridContext.Provider>
  );
}

export function useHexGrid() {
  const { grid } = React.useContext(HexGridContext);
  return grid;
}

export function usePlayerLocation() {
  const { player, setPlayerLocation } = React.useContext(HexGridContext);
  return { setPlayerLocation, player };
}
