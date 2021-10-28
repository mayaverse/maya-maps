import { Sprite } from '@inlet/react-pixi';
import React from 'react';

import { TerrainType } from '../../lib/grid/terrain';

type IsometricTerrainSpriteProps = {
  type: TerrainType;
  image: string;
  x: number;
  y: number;
  r: number;
  level: number;
};

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const FieldTerrain = (
  props: Omit<IsometricTerrainSpriteProps, 'type' | 'image'>
) => <IsometricTerrainSprite image={`tileGrass`} {...props} />;

const Field1Terrain = (
  props: Omit<IsometricTerrainSpriteProps, 'type' | 'image'>
) => <IsometricTerrainSprite image={`tileGrass1`} {...props} />;

const Field2Terrain = (
  props: Omit<IsometricTerrainSpriteProps, 'type' | 'image'>
) => <IsometricTerrainSprite image={`tileGrass2`} {...props} />;

const SandTerrain = (
  props: Omit<IsometricTerrainSpriteProps, 'type' | 'image'>
) => <IsometricTerrainSprite image={'tileSand'} {...props} />;

const WaterTerrain = (
  props: Omit<IsometricTerrainSpriteProps, 'type' | 'image'>
) => <IsometricTerrainSprite image={'tileWater_full'} {...props} />;

const MountainTerrain = (
  props: Omit<IsometricTerrainSpriteProps, 'type' | 'image'>
) => <IsometricTerrainSprite image={'tileRock'} {...props} />;

const DirtTerrain = (
  props: Omit<IsometricTerrainSpriteProps, 'type' | 'image'>
) => <IsometricTerrainSprite image={'tileDirt'} {...props} />;

const IsometricTerrainSprite = ({
  image,
  x,
  y,
  r,
  level,
}: Omit<IsometricTerrainSpriteProps, 'type'>) => {
  const z = r + level * 100;
  return (
    <Sprite
      image={`/assets/tiles/Isometric/${image}.png`}
      zIndex={z} // r es la fila va de -20 a 20
      anchor={{ x: 0.5, y: 0.39 }}
      rotation={0}
      scale={{ x: 50 / 65, y: 50 / 66 }}
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
    case TerrainType.Dirt:
      return <DirtTerrain {...props} />;
    case TerrainType.Sand:
      return <SandTerrain {...props} />;
    case TerrainType.Field:
      if (props.level < 3) {
        return <FieldTerrain {...props} />;
      } else if (props.level < 4) {
        return <Field1Terrain {...props} />;
      }
      return <Field2Terrain {...props} />;
    case TerrainType.Mountain:
      return <MountainTerrain {...props} />;
    default:
      return <FieldTerrain {...props} />;
  }
};

export default IsometricTerrainSprite;
