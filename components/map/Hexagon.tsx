import { PixiComponent } from '@inlet/react-pixi';
import { Graphics } from 'pixi.js';

import { Node } from '../../lib/grid/node';

interface HexagonProps {
  elevation?: number;
  moisture?: number;
  node: Node;
  zIndex?: number;
}

const Hexagon = PixiComponent<HexagonProps, Graphics>('Hexagon', {
  create: () => new Graphics(),
  applyProps: (graphics, _, props) => {
    const { visibility, corners } = props.node;

    const color = 0x999999;
    let fill = 0xff;

    /* 
    switch (terrain.type) {
      case TerrainType.Water:
        fill = 0xa1c5ff;
        break;
      case TerrainType.Field:
        fill = 0x8ddb5c;
        break;
      case TerrainType.Mountain:
        fill = 0x998b7f;
        break;
    } 
    */

    graphics.beginFill(fill, 0);

    graphics.lineStyle(1, color, 0);
    if (visibility === 'visible') {
    }

    const [firstCorner, ...otherCorners] = corners;
    // move the "pen" to the first corner
    graphics.moveTo(firstCorner.x, firstCorner.y);
    // draw lines to the other corners
    otherCorners.forEach(({ x, y }) => graphics.lineTo(x, y));
    // finish at the first corner
    graphics.lineTo(firstCorner.x, firstCorner.y);
    graphics.endFill();
    graphics.zIndex = props.zIndex || 0;
  },
});

export default Hexagon;
