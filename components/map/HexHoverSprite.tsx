import { Sprite } from '@inlet/react-pixi';
import { useRef } from 'react';

interface HexHoverSpriteProps {
  x: number;
  y: number;
  visible: boolean;
}

const HexHoverSprite = ({ x, y, visible }: HexHoverSpriteProps) => {
  return (
    <Sprite
      image="/assets/ui/hover.png"
      scale={{ x: 0.4, y: 0.25 }}
      anchor={0.5}
      visible={visible}
      x={x}
      y={y}
    />
  );
};

export default HexHoverSprite;
