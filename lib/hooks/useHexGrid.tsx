import * as React from 'react';

import { generateGrid, HexGrid, IGridSettings } from '../grid/grid';
import { Node } from '../grid/Node';

interface IHexGridContext {
  grid?: HexGrid<Node>;
}

const HexGridContext = React.createContext<IHexGridContext>({});
HexGridContext.displayName = 'HexGrid';

type HexGridProviderProps = Partial<IGridSettings>;

export function HexGridProvider({ children, ...settings }: React.PropsWithChildren<HexGridProviderProps>) {
  const grid = React.useMemo(() => generateGrid(settings), [settings]);
  return <HexGridContext.Provider value={{ grid }}>{children}</HexGridContext.Provider>;
}

export function useHexGrid() {
  const { grid } = React.useContext(HexGridContext);
  return grid;
}
