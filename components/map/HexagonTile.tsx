import { hexToPoint } from 'honeycomb-grid';
import React from 'react';

import { Node } from '../../lib/grid/node';
import Hexagon from './Hexagon';
import { AdaptiveIsometricTerrainSprite } from './IsometricTerrainSprite';
import { MountainTopSmallSnow } from './SmallTerrainDetailSprite';
import { MountainTopBigSnow } from './TerrainDetailSprite';

type HexagonTileProps = {
  node: Node;
};

const HexagonTile = ({ node }: HexagonTileProps) => {
  const point = hexToPoint(node);
  const mergeWater = node.level < 2 ? 1 : node.level;
  const z = node.r + mergeWater * 100;

  return (
    <Hexagon node={node} zIndex={z}>
      {node.visibility !== 'undiscovered' && (
        <>
          <AdaptiveIsometricTerrainSprite
            type={node.terrain.type}
            x={point.x}
            y={point.y}
            r={node.r}
            level={mergeWater}
          />
          {node.level === 7 && (
            <>
              <MountainTopBigSnow x={point.x} y={point.y} />
              <MountainTopSmallSnow x={point.x} y={point.y} />
            </>
          )}
        </>
      )}
      {/* <CoordinatesLog center={point} col={node.q} row={node.r} /> */}
    </Hexagon>
  );
};

export default HexagonTile;
