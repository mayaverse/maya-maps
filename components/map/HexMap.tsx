import { PixiRef, Stage } from '@inlet/react-pixi';
import React, { useMemo, useRef } from 'react';

import { useHexGrid } from '../../lib/hooks/useHexGrid';
import useResize from '../../lib/hooks/useResize';
import Hexagon from './Hexagon';
import PixiViewport from './PixiViewport';

type IPixiViewport = PixiRef<typeof PixiViewport>;

const stageOptions = {
  antialias: true,
  autoDensity: true,
  backgroundColor: 0xefefef,
};

const HexMap = () => {
  const viewportRef = useRef<IPixiViewport>(null);
  const { width, height } = useResize();
  const grid = useHexGrid();
  return (
    <Stage width={width} height={height} options={stageOptions}>
      <PixiViewport
        ref={viewportRef}
        plugins={{
          drag: {},
          decelerate: {},
          pinch: {},
          wheel: {},
        }}
        screenWidth={width}
        screenHeight={height}
        worldWidth={width * 4}
        worldHeight={height * 4}
      >
        {grid?.hexes().map(node => (
          <Hexagon key={node.toString()} color={0x999999} corners={node.corners} visibility={node.visibility} />
        ))}
      </PixiViewport>
    </Stage>
  );
};

export default HexMap;
