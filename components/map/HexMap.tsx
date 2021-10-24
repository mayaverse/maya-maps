import { Container, PixiRef, Stage } from '@inlet/react-pixi';
import { IApplicationOptions } from '@pixi/app';
import React, { useRef } from 'react';

import { useHexGrid } from '../../lib/hooks/useHexGrid';
import useResize from '../../lib/hooks/useResize';
import HexagonTile from './HexagonTile';
import PixiViewport from './PixiViewport';

type IPixiViewport = PixiRef<typeof PixiViewport>;

const stageOptions: IApplicationOptions = {
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
        <Container sortableChildren>
          {grid?.hexes().map((node) => (
            <HexagonTile key={node.toString()} node={node} />
          ))}
        </Container>
      </PixiViewport>
    </Stage>
  );
};

export default HexMap;
