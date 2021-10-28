import { PixiComponent } from '@inlet/react-pixi';
import { Point } from 'honeycomb-grid';
import { Graphics } from 'pixi.js';

interface RegionBorderProps {
  corners: Point[];
}

const RegionBorder = PixiComponent<RegionBorderProps, Graphics>(
  'RegionBorder',
  {
    create: () => new Graphics(),
    applyProps: (graphics, _, props) => {
      const { corners } = props;
      const color = 0x999999;

      if (corners.length > 0) {
        graphics.lineStyle(5, color);

        const [firstCorner, ...otherCorners] = corners;
        // move the "pen" to the first corner
        graphics.moveTo(firstCorner.x, firstCorner.y);
        // draw lines to the other corners
        otherCorners.forEach(({ x, y }) => graphics.lineTo(x, y));
        // finish at the first corner
        graphics.lineTo(firstCorner.x, firstCorner.y);
      }
    },
  }
);

export default RegionBorder;
