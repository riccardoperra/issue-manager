import { APP_INITIALIZER, Provider } from '@angular/core';
import { RXA_PROVIDER } from './shared/rxa-custom/rxa.provider';
import { TUI_DATE_FORMAT, TUI_DATE_SEPARATOR } from '@taiga-ui/cdk';
import { tuiButtonOptionsProvider } from '@taiga-ui/core';
import { ProjectsState } from './shared/state/projects.state';
import { AuthState } from './shared/auth/auth.state';
import { RxActionFactory } from './shared/rxa-custom/actions/actions.factory';
import { tuiTagOptionsProvider } from '@taiga-ui/kit';

export const APP_PROVIDERS: Provider[] = [
  RxActionFactory,
  RXA_PROVIDER,
  { provide: TUI_DATE_FORMAT, useValue: 'MDY' },
  { provide: TUI_DATE_SEPARATOR, useValue: '/' },
  tuiButtonOptionsProvider({
    size: 'm',
    appearance: 'primary',
  }),
  tuiTagOptionsProvider({
    autoColor: true,
  }),
  {
    provide: APP_INITIALIZER,
    useFactory: (projectsState: ProjectsState, authState: AuthState) => {
      return (): void => {
        authState.initialize();
        projectsState.initialize();
      };
    },
    multi: true,
    deps: [ProjectsState, AuthState],
  },
];
