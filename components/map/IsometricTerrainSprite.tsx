import { Sprite } from '@inlet/react-pixi';
import React from 'react';

import { TerrainType } from '../../lib/grid/terrain';

type IsometricTerrainSpriteProps = {
  type: TerrainType;
  image: string;
  x: number;
  y: number;
  r: number;
};

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const FieldTerrain = (
  props: Omit<IsometricTerrainSpriteProps, 'type' | 'image'>
) => {
  const opt = ['05', '05', '05', '05', '10', '11', '12', '13'];
  return <IsometricTerrainSprite image={`tileGrass`} {...props} />;
};

const WaterTerrain = (
  props: Omit<IsometricTerrainSpriteProps, 'type' | 'image'>
) => <IsometricTerrainSprite image={'tileWater'} {...props} />;

const MountainTerrain = (
  props: Omit<IsometricTerrainSpriteProps, 'type' | 'image'>
) => <IsometricTerrainSprite image={'tileRock'} {...props} />;

const IsometricTerrainSprite = ({
  image,
  x,
  y,
  r,
}: Omit<IsometricTerrainSpriteProps, 'type'>) => {
  return (
    <Sprite
      image={`/assets/tiles/Isometric/${image}.png`}
      zIndex={r}
      anchor={{ x: 0.5, y: 0.39 }}
      rotation={0}
      scale={{ x: 50 / 65, y: 50 / 70 }}
      x={x}
      y={y}
    />
  );
};

export const AdaptiveIsometricTerrainSprite = ({
  type,
  ...props
}: Omit<IsometricTerrainSpriteProps, 'image'>) => {
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

export default IsometricTerrainSprite;
