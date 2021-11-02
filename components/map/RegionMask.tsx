import { PixiComponent } from '@inlet/react-pixi';
import { Point } from 'honeycomb-grid';
import { Graphics } from 'pixi.js';

interface RegionMaskProps {
  corners: Point[];
}

const RegionMask = PixiComponent<RegionMaskProps, Graphics>('RegionMask', {
  create: () => new Graphics(),
  applyProps: (graphics, _, props) => {
    const { corners } = props;
    const color = 0x000000;

    if (corners.length > 0) {
      graphics.isMask = true;
      graphics.beginFill(color);
      graphics.lineStyle(1, color);

      const [firstCorner, ...otherCorners] = corners;
      // move the "pen" to the first corner
      graphics.moveTo(firstCorner.x, firstCorner.y);
      // draw lines to the other corners
      otherCorners.forEach(({ x, y }) => graphics.lineTo(x, y));
      // finish at the first corner
      graphics.lineTo(firstCorner.x, firstCorner.y);
      graphics.endFill();
    }
  },
});

export default RegionMask;
