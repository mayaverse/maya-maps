import { PixiComponent } from '@inlet/react-pixi';
import { Point } from 'honeycomb-grid';
import { Text, ITextStyle } from 'pixi.js';

const style: Partial<ITextStyle> = {
  fontFamily: 'Arial',
  fontSize: 12,
  fill: 0x000000,
  stroke: 10,
  align: 'center',
};

export interface CoordinatesLogProps {
  center: Point;
  row: number;
  col: number;
}

const CoordinatesLog = PixiComponent<CoordinatesLogProps, Text>(
  'CoordinatesLog',
  {
    create: () => new Text('', style),
    applyProps: (text, _, props) => {
      const { center, col, row } = props;

      text.text = col + ',' + row;

      text.x = center.x;
      text.y = center.y;
      text.anchor.set(0.5, 0.5);
    },
  }
);

export default CoordinatesLog;
