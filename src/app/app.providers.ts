import { APP_INITIALIZER, Provider } from '@angular/core';
import { RXA_PROVIDER } from './shared/rxa-custom/rxa.provider';
import { TUI_DATE_FORMAT, TUI_DATE_SEPARATOR } from '@taiga-ui/cdk';
import { TUI_BUTTON_OPTIONS, TuiButtonOptions } from '@taiga-ui/core';
import { ProjectsState } from './shared/state/projects.state';

export const APP_PROVIDERS: Provider[] = [
  RXA_PROVIDER,
  { provide: TUI_DATE_FORMAT, useValue: 'MDY' },
  { provide: TUI_DATE_SEPARATOR, useValue: '/' },
  {
    provide: TUI_BUTTON_OPTIONS,
    useValue: {
      size: 'm',
      shape: 'square',
      appearance: 'primary',
    } as TuiButtonOptions,
  },
  {
    provide: APP_INITIALIZER,
    useFactory: (service: ProjectsState) => {
      return (): void => {
        service.initialize();
      };
    },
    multi: true,
    deps: [ProjectsState],
  },
];
