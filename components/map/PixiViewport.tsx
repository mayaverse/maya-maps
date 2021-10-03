import { forwardRef, ReactNode } from 'react';
import { PixiComponent, useApp } from '@inlet/react-pixi';
import { Application } from 'pixi.js';
import {
  IViewportOptions,
  Viewport,
  IDragOptions,
  IDecelerateOptions,
  IPinchOptions,
  IWheelOptions,
} from 'pixi-viewport';

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
}

type ViewportProps = Pick<IViewportOptions, 'screenWidth' | 'screenHeight' | 'worldHeight' | 'worldWidth'>;

const PixiViewportComponent = PixiComponent<PixieViewportProps, Viewport>('Viewport', {
  create(props) {
    const { app, plugins, ...viewportProps } = props;

    const viewport = new Viewport({
      ticker: app.ticker,
      interaction: app.renderer.plugins.interaction,
      ...viewportProps,
    });

    if (plugins) {
      const applyPlugins = Object.keys(plugins) as Array<keyof ViewportPlugins>;

      applyPlugins.forEach(p => {
        const plugin = plugins[p];
        if (plugin) {
          viewport[p](plugin);
        }
      });
    }

    return viewport;
  },
  applyProps(viewport, _oldProps, _newProps) {
    const { plugins: oldPlugins, children: oldChildren, ...oldProps } = _oldProps;
    const { plugins: newPlugins, children: newChildren, ...newProps } = _newProps;

    const applyProps = Object.keys(newProps) as Array<keyof ViewportProps>;
    applyProps.forEach(p => {
      if (oldProps[p] !== newProps[p]) {
        console.log(`Changing ${p} to `, newProps[p]);
        viewport[p] = newProps[p] || 0;
      }
    });
  },
  didMount() {
    console.log('viewport mounted');
  },
});

type Props = Omit<PixieViewportProps, 'app'>;

const PixiViewport = forwardRef<Viewport, Props>((props, ref) => (
  <PixiViewportComponent ref={ref} {...props} app={useApp()} />
));
PixiViewport.displayName = 'PixiViewport';

export default PixiViewport;
