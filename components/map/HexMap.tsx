import { Container, PixiRef, Stage } from '@inlet/react-pixi';
import { IApplicationOptions } from '@pixi/app';
import React, { useMemo, useRef } from 'react';

import { getGridBorders } from '../../lib/grid/functions/getGridBorders';
import { useHexGrid } from '../../lib/hooks/useHexGrid';
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
  const borderRef = useRef<IRegionBorder>(null);
  const maskRef = useRef<IRegionMask>(null);
  const { width, height } = useResize();
  const grid = useHexGrid();
  const gridBorder = useMemo(() => getGridBorders(grid), [grid]);

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
        <SmokeEmitter play mask={maskRef.current} />
        <RegionMask corners={gridBorder} ref={maskRef} />
        <Container sortableChildren>
          {grid?.hexes().map((node) => (
            <HexagonTile key={node.toString()} node={node} />
          ))}
        </Container>
        <RegionBorder corners={gridBorder} ref={borderRef} />
      </PixiViewport>
    </Stage>
  );
};

export default HexMap;
