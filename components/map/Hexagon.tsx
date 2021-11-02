import { PixiComponent } from '@inlet/react-pixi';
import { Graphics, Polygon } from 'pixi.js';

import { Node } from '../../lib/grid/node';

interface HexagonProps {
  elevation?: number;
  moisture?: number;
  node: Node;
  zIndex?: number;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  onClick?: () => void;
}

const Hexagon = PixiComponent<HexagonProps, Graphics>('Hexagon', {
  create: () => new Graphics(),
  applyProps: (graphics, _, props) => {
    const { corners } = props.node;

    const color = 0x999999;
    let fill = 0xff;

    graphics.beginFill(fill, 0);

    graphics.lineStyle(1, color, 0);

    const [firstCorner, ...otherCorners] = corners;
    // move the "pen" to the first corner
    graphics.moveTo(firstCorner.x, firstCorner.y);
    // draw lines to the other corners
    otherCorners.forEach(({ x, y }) => graphics.lineTo(x, y));
    // finish at the first corner
    graphics.lineTo(firstCorner.x, firstCorner.y);
    graphics.endFill();

    graphics.interactive = true;
    graphics.interactiveChildren = false;
    graphics.hitArea = new Polygon(corners);

    if (props.onMouseOver) {
      if (graphics.eventNames().indexOf('mouseover') !== -1) {
        graphics.removeAllListeners('mouseover');
      }
      graphics.on('mouseover', props.onMouseOver);
    }
    if (props.onMouseOut) {
      if (graphics.eventNames().indexOf('mouseout') !== -1) {
        graphics.removeAllListeners('mouseout');
      }
      graphics.on('mouseout', props.onMouseOut);
    }
    if (props.onClick) {
      if (graphics.eventNames().indexOf('click') !== -1) {
        graphics.removeAllListeners('click');
      }
      graphics.on('click', props.onClick);
    }

    graphics.zIndex = props.zIndex || 0;
  },
  willUnmount(graphics) {
    graphics.removeAllListeners();
  },
});

export default Hexagon;
