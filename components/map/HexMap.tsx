import { Container, PixiRef, Stage } from '@inlet/react-pixi';
import { IApplicationOptions } from '@pixi/app';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { getGridBorders } from '../../lib/grid/functions/getGridBorders';
import { useHexGrid, usePlayerLocation } from '../../lib/hooks/useHexGrid';
import useResize from '../../lib/hooks/useResize';
import SmokeEmitter from '../pixi/SmokeEmitter';
import HexagonTile from './HexagonTile';
import PixiViewport from './PixiViewport';
import RegionBorder from './RegionBorder';
import RegionMask from './RegionMask';

type IPixiViewport = PixiRef<typeof PixiViewport>;
type IRegionBorder = PixiRef<typeof RegionBorder>;
type IRegionMask = PixiRef<typeof RegionMask>;

const stageOptions: IApplicationOptions = {
  antialias: true,
  autoDensity: true,
  backgroundColor: 0xefefef,
};

const HexMap = () => {
  const viewportRef = useRef<IPixiViewport>(null);
  const [mask, setMask] = React.useState<IRegionMask>();
  const { width, height } = useResize();
  const grid = useHexGrid();
  const { setPlayerLocation } = usePlayerLocation();
  const { gridBorder, hexes } = useMemo(() => {
    console.log('grid changed');
    return { gridBorder: getGridBorders(grid), hexes: grid?.hexes() || [] };
  }, [grid]);
  const handleClick = useCallback(
    (q, r) => {
      setPlayerLocation && setPlayerLocation(q, r);
    },
    [setPlayerLocation]
  );

  return (
    <Stage width={width} height={height} options={stageOptions}>
      <PixiViewport
        ref={viewportRef}
        plugins={{
          drag: {},
          decelerate: { friction: 0.9 },
          pinch: {},
          wheel: {},
        }}
        disableOnContextMenu={true}
        screenWidth={width}
        screenHeight={height}
        worldWidth={width * 4}
        worldHeight={height * 4}
        clamp={{
          left: -width,
          right: width,
          bottom: height,
          top: -height,
          underflow: 'center',
        }}
        clampZoom={{
          minWidth: null, // minimum width
          minHeight: null, // minimum height
          maxWidth: null, // maximum width
          maxHeight: null, // maximum height
          minScale: 0.5, // minimum scale
          maxScale: 2,
        }}
      >
        <SmokeEmitter play mask={mask} />
        <RegionMask
          corners={gridBorder}
          ref={(ref) => setMask(ref || undefined)}
        />
        <Container sortableChildren>
          {hexes.map((node) => (
            <HexagonTile
              key={node.toString()}
              node={node}
              onClick={() => handleClick(node.q, node.r)}
            />
          ))}
        </Container>
        <RegionBorder corners={gridBorder} />
      </PixiViewport>
    </Stage>
  );
};

export default HexMap;
