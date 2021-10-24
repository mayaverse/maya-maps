import { Sprite } from '@inlet/react-pixi';
import React from 'react';

import { TerrainType } from '../../lib/grid/terrain';

type TerrainSpriteProps = {
  type: TerrainType;
  image: string;
  x: number;
  y: number;
};

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const FieldTerrain = (props: Omit<TerrainSpriteProps, 'type' | 'image'>) => {
  const opt = ['05', '05', '05', '05', '10', '11', '12', '13'];
  return (
    <TerrainSprite
      image={`Grass/grass_${opt[getRandomInt(0, opt.length)]}`}
      {...props}
    />
  );
};

const WaterTerrain = (props: Omit<TerrainSpriteProps, 'type' | 'image'>) => (
  <TerrainSprite image={'Water/water_01'} {...props} />
);

const MountainTerrain = (props: Omit<TerrainSpriteProps, 'type' | 'image'>) => (
  <TerrainSprite image={'Dirt/dirt_18'} {...props} />
);

const TerrainSprite = ({ image, x, y }: Omit<TerrainSpriteProps, 'type'>) => {
  return (
    <Sprite
      image={`/assets/tiles/Terrain/${image}.png`}
      anchor={0.5}
      rotation={100}
      scale={{ x: 50 / 112, y: 50 / 112 }}
      x={x}
      y={y}
    />
  );
};

export const AdaptiveTerrainSprite = ({
  type,
  ...props
}: Omit<TerrainSpriteProps, 'image'>) => {
  switch (type) {
    case TerrainType.Water:
      return <WaterTerrain {...props} />;
      break;
    case TerrainType.Field:
      return <FieldTerrain {...props} />;
      break;
    case TerrainType.Mountain:
      return <MountainTerrain {...props} />;
      break;
    default:
      return <FieldTerrain {...props} />;
  }
};

export default TerrainSprite;
