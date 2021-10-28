import { PixiComponent } from '@inlet/react-pixi';
import {
  Emitter,
  EmitterConfigV3,
  upgradeConfig,
} from '@pixi/particle-emitter';
import { Container, MaskData, Texture } from 'pixi.js';

import defaultConfig from './smoke-emitter.json';

const dc = upgradeConfig(defaultConfig, [
  Texture.from('/assets/particles/particle.png'),
  Texture.from('/assets/particles/smokeparticle.png'),
]);

interface SmokeEmitterProps extends Partial<EmitterConfigV3> {
  play: boolean;
  mask?: Container | MaskData | null;
}

class EmitContainer extends Container {
  emitter?: Emitter;
  animationFrame: number = 0;
}

const SmokeEmitter = PixiComponent<SmokeEmitterProps, EmitContainer>(
  'SmokeEmitter',
  {
    create: (config) => {
      const container = new EmitContainer();
      container.emitter = new Emitter(container, { ...dc, ...config });
      return container;
    },
    applyProps(instance, oldProps, newProps) {
      const { emitter } = instance;
      if (emitter) {
        if (newProps.mask) {
          instance.mask = newProps.mask;
        }
        let elapsed = Date.now();

        const update = () => {
          instance.animationFrame = requestAnimationFrame(update);
          const now = Date.now();

          emitter.update((now - elapsed) * 0.001);

          elapsed = now;
        };

        emitter.emit = newProps.play;
        update();
      }
    },
    willUnmount({ emitter, animationFrame }) {
      if (emitter) {
        emitter.emit = false;
        cancelAnimationFrame(animationFrame);
      }
    },
  }
);

export default SmokeEmitter;
