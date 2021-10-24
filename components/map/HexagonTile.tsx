import { hexToPoint } from 'honeycomb-grid';
import React from 'react';

import { Node } from '../../lib/grid/node';
import CoordinatesLog from './CoordinatesLog';
import Hexagon from './Hexagon';
import { AdaptiveIsometricTerrainSprite } from './IsometricTerrainSprite';

type HexagonTileProps = {
  node: Node;
};

const HexagonTile = ({ node }: HexagonTileProps) => {
  const point = hexToPoint(node);

  return (
    <Hexagon node={node} zIndex={node.r}>
      {node.visibility !== 'undiscovered' && (
        <AdaptiveIsometricTerrainSprite
          type={node.terrain.type}
          x={point.x}
          y={point.y}
          r={node.r}
        />
      )}
      <CoordinatesLog center={point} col={node.q} row={node.r} />
    </Hexagon>
  );
};

export default HexagonTile;
