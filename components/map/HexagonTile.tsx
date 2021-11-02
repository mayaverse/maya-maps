import { hexToPoint } from 'honeycomb-grid';
import React, { useMemo, useState } from 'react';

import { Node } from '../../lib/grid/node';
import CoordinatesLog from './CoordinatesLog';
import Hexagon from './Hexagon';
import HexHoverSprite from './HexHoverSprite';
import { AdaptiveIsometricTerrainSprite } from './IsometricTerrainSprite';
import { MountainTopSmallSnow } from './SmallTerrainDetailSprite';
import { MountainTopBigSnow } from './TerrainDetailSprite';

interface HexagonTileProps {
  node: Node;
  onClick: () => void;
}

interface VisibilityHexTileProps extends HexagonTileProps {
  z: number;
  level: number;
}

const UndiscoveredHexTile = ({ node, z }: VisibilityHexTileProps) => {
  return <Hexagon node={node} zIndex={z} />;
};

const DiscoveredHexTile = ({
  node,
  onClick,
  level,
  z,
}: VisibilityHexTileProps) => {
  const [hover, setHover] = useState<boolean>(false);
  const point = hexToPoint(node);

  return (
    <Hexagon
      node={node}
      zIndex={z}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      onClick={onClick}
    >
      <>
        <AdaptiveIsometricTerrainSprite
          type={node.terrain.type}
          x={point.x}
          y={point.y}
          r={node.r}
          level={level}
        />
        {node.level === 7 && (
          <>
            <MountainTopBigSnow x={point.x} y={point.y} />
            <MountainTopSmallSnow x={point.x} y={point.y} />
          </>
        )}
        <HexHoverSprite x={point.x} y={point.y} visible={hover} />
      </>
      <CoordinatesLog center={point} col={node.q} row={node.r} />
    </Hexagon>
  );
};

const VisibleHexTile = ({
  node,
  onClick,
  level,
  z,
}: VisibilityHexTileProps) => {
  const [hover, setHover] = useState<boolean>(false);
  const point = hexToPoint(node);

  return (
    <Hexagon
      node={node}
      zIndex={z}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      onClick={onClick}
    >
      <>
        <AdaptiveIsometricTerrainSprite
          type={node.terrain.type}
          x={point.x}
          y={point.y}
          r={node.r}
          level={level}
        />
        {node.level === 7 && (
          <>
            <MountainTopBigSnow x={point.x} y={point.y} />
            <MountainTopSmallSnow x={point.x} y={point.y} />
          </>
        )}
        <HexHoverSprite x={point.x} y={point.y} visible={hover} />
      </>
      <CoordinatesLog center={point} col={node.q} row={node.r} />
    </Hexagon>
  );
};

const HexagonTile = ({ node, onClick }: HexagonTileProps) => {
  const { level, z } = useMemo(() => {
    const mergeWater = node.level < 2 ? 1 : node.level;
    return { z: node.r + mergeWater * 100, level: mergeWater };
  }, [node.level, node.r]);
  console.log('tile', node.visibility);
  const VisibilityHexTile = useMemo(() => {
    if (node.visibility === 'discovered') {
      return DiscoveredHexTile;
    }
    if (node.visibility === 'visible') {
      return VisibleHexTile;
    }
    return UndiscoveredHexTile;
  }, [node.visibility]);
  return (
    <VisibilityHexTile level={level} z={z} node={node} onClick={onClick} />
  );
};

export default HexagonTile;
