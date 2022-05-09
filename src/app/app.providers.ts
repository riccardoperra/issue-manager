import { APP_INITIALIZER, Provider } from '@angular/core';
import { RXA_PROVIDER } from './shared/rxa-custom/rxa.provider';
import { RxActionFactory } from './shared/rxa-custom/actions/actions.factory';
import { AuthState } from './shared/auth/auth.state';

export const APP_PROVIDERS: Provider[] = [
  RxActionFactory,
  RXA_PROVIDER,
  {
    provide: APP_INITIALIZER,
    useFactory: (authState: AuthState) => {
      return (): void => authState.initialize();
    },
    multi: true,
    deps: [AuthState],
  },
];
