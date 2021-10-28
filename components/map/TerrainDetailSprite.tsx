import { Sprite } from '@inlet/react-pixi';
import React from 'react';

type TerrainDetailSpriteProps = {
  image: string;
  x: number;
  y: number;
};

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const MountainTopBigSnow = (props: Omit<TerrainDetailSpriteProps, 'image'>) => (
  <TerrainDetailSprite image={'rockStone'} {...props} />
);

const TerrainDetailSprite = ({ image, x, y }: TerrainDetailSpriteProps) => {
  return (
    <Sprite
      image={`/assets/tiles/Isometric/${image}.png`}
      anchor={{ x: 0.5, y: 0.39 }}
      rotation={0}
      scale={{ x: 50 / 65, y: 50 / 70 }}
      x={x}
      y={y}
    />
  );
};

export { MountainTopBigSnow };
