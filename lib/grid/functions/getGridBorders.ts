import { Point } from 'honeycomb-grid';

import { HexGrid } from '../grid';
import { Node } from '../node';

export function getGridBorders(grid?: HexGrid<Node>): Point[] {
  if (!grid) {
    return [];
  }
  const borders: Point[] = [];
  grid
    .filter((n) => {
      const { q, r } = n;
      const sum = Math.abs(q + r);
      return Math.abs(q) === 20 || Math.abs(r) === 20 || sum === 20;
    })
    .each((n) => {
      const { q, r } = n;
      const sum = q + r;
      //            bRight   bCenter              topCenter
      const [topRight, bRight, bCenter, bLeft, topLeft, topCenter] = n.corners;
      if (r === -20) {
        borders.push(topLeft, topCenter, topRight);
      } else if (r === 20) {
        borders.push(bRight, bCenter, bLeft);
      } else if (sum === -20) {
        borders.push(bLeft, topLeft, topCenter);
      } else if (sum === 20) {
        borders.push(topRight, bRight, bCenter);
      } else if (q === -20) {
        borders.push(bCenter, bLeft, topLeft);
      } else if (q === 20) {
        borders.push(topCenter, topRight, bRight);
      }
    })
    .run();
  console.log('borders', borders);
  return borders;
}
