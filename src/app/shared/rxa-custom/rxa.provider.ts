import { RX_RENDER_STRATEGIES_CONFIG } from '@rx-angular/cdk/render-strategies';
import { ModuleWithProviders, Type } from '@angular/core';
import {
  RX_RENDER_STRATEGIES_DEFAULTS,
  RxRenderStrategiesConfig,
} from '@rx-angular/cdk/render-strategies/lib/config';

export const RXA_PROVIDER: Array<
  Type<any> | ModuleWithProviders<{}> | any[] | any
> = [
  {
    provide: RX_RENDER_STRATEGIES_CONFIG,
    useValue: {
      patchZone: false,
      primaryStrategy: 'native',
    },
  },
];
