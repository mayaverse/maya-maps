import { PixiComponent, useApp } from '@inlet/react-pixi';
import {
  IClampOptions,
  IClampZoomOptions,
  IDecelerateOptions,
  IDragOptions,
  IPinchOptions,
  IViewportOptions,
  IWheelOptions,
  Viewport,
} from 'pixi-viewport';
import { Application } from 'pixi.js';
import { forwardRef, ReactNode } from 'react';

interface ViewportPlugins {
  drag?: IDragOptions;
  decelerate?: IDecelerateOptions;
  pinch?: IPinchOptions;
  wheel?: IWheelOptions;
}

interface PixieViewportProps extends IViewportOptions {
  app: Application;
  plugins?: ViewportPlugins;
  children?: ReactNode;
  clamp: IClampOptions;
  clampZoom: IClampZoomOptions;
}

type ViewportProps = Pick<
  IViewportOptions,
  'screenWidth' | 'screenHeight' | 'worldHeight' | 'worldWidth'
>;

const PixiViewportComponent = PixiComponent<PixieViewportProps, Viewport>(
  'Viewport',
  {
    create(props) {
      const { app, plugins, clamp, clampZoom, ...viewportProps } = props;

      const viewport = new Viewport({
        ticker: app.ticker,
        interaction: app.renderer.plugins.interaction,
        ...viewportProps,
      });

      if (plugins) {
        const applyPlugins = Object.keys(plugins) as Array<
          keyof ViewportPlugins
        >;

        applyPlugins.forEach((p) => {
          const plugin = plugins[p];
          if (plugin) {
            viewport[p](plugin);
          }
        });
      }

      viewport.clamp(clamp);
      viewport.clampZoom(clampZoom);

      return viewport;
    },
    applyProps(viewport, _oldProps, _newProps) {
      const {
        plugins: oldPlugins,
        children: oldChildren,
        clamp: oldClamp,
        clampZoom: oldClampZ,
        ...oldProps
      } = _oldProps;
      const {
        plugins: newPlugins,
        children: newChildren,
        clamp: newClamp,
        clampZoom: newClampZ,
        ...newProps
      } = _newProps;

      const applyProps = Object.keys(newProps) as Array<keyof ViewportProps>;
      applyProps.forEach((p) => {
        if (oldProps[p] !== newProps[p]) {
          console.log(`PixiViewport: update ${p} to `, newProps[p]);
          viewport[p] = newProps[p] || 0;
        }
      });
      if (oldClamp !== newClamp) {
        viewport.clamp(newClamp);
      }
    },
    didMount(viewport) {
      console.log('viewport mounted');
      viewport.moveCenter(0, 0);
    },
  }
);

type Props = Omit<PixieViewportProps, 'app'>;

const PixiViewport = forwardRef<Viewport, Props>((props, ref) => (
  <PixiViewportComponent ref={ref} {...props} app={useApp()} />
));
PixiViewport.displayName = 'PixiViewport';

export default PixiViewport;
