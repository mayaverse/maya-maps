import { PixiComponent } from '@inlet/react-pixi';
import { Point } from 'honeycomb-grid';
import { Graphics } from 'pixi.js';

import { Visibility } from '../../lib/grid/Node';

interface HexagonProps {
  elevation?: number;
  moisture?: number;
  color: number;
  corners: Array<Point>;
  visibility: Visibility;
}

const Hexagon = PixiComponent<HexagonProps, Graphics>('Hexagon', {
  create: () => new Graphics(),
  applyProps: (graphics, _, props) => {
    const color = props.visibility === 'visible' ? 0xff : props.color;
    graphics.lineStyle(1, color);
    const [firstCorner, ...otherCorners] = props.corners;
    // move the "pen" to the first corner
    graphics.moveTo(firstCorner.x, firstCorner.y);
    // draw lines to the other corners
    otherCorners.forEach(({ x, y }) => graphics.lineTo(x, y));
    // finish at the first corner
    graphics.lineTo(firstCorner.x, firstCorner.y);
  },
});

export default Hexagon;
