import { Appwrite } from 'appwrite';
import { RxState } from '@rx-angular/state';
import { Inject, Injectable } from '@angular/core';
import { APPWRITE } from '../../providers/appwrite.provider';
import { catchError, from, map, of, Subject, switchMap, tap } from 'rxjs';
import { AuthStateModel } from './auth-state.model';
import { patch } from '@rx-angular/cdk/transformations';
import { WithInitializer } from '../rxa-custom/initializer';
import { RxActionFactory } from '../rxa-custom/actions/actions.factory';

export interface AuthCommand {
  signInWithCredentials: { email: string; password: string };
}

@Injectable({
  providedIn: 'root',
})
export class AuthState
  extends RxState<AuthStateModel>
  implements WithInitializer
{
  readonly actions = this.rxActions.create();
  readonly fetchAccount$ = new Subject<void>();
  readonly onAuthError$ = new Subject<void>();
  readonly loginAsGuest$ = new Subject<void>();
  readonly onCreateAnonymousSession$ = new Subject<void>();

  readonly session$ = this.select('session');
  readonly account$ = this.select('account');

  onLoginAsGuest(): void {
    this.loginAsGuest$.next();
  }

  onAuthError(): void {
    this.onAuthError$.next();
  }

  constructor(
    @Inject(APPWRITE) private readonly appwrite: Appwrite,
    private readonly rxActions: RxActionFactory<AuthCommand>
  ) {
    super();

    this.connect(
      this.fetchAccount$.pipe(
        tap(() => console.log('fetching account')),
        switchMap(() =>
          from(this.appwrite.account.get()).pipe(
            map((account) => ({ account } as AuthStateModel))
          )
        ),
        catchError(() => of({ account: null, session: null } as AuthStateModel))
      ),
      (state, { session, account }) => {
        console.log(patch(state, { account, session }));
        return patch(state, { account, session });
      }
    );

    this.connect(this.onAuthError$, (state) =>
      patch(state, { account: null, session: null })
    );

    this.hold(this.onCreateAnonymousSession$, () => this.fetchAccount());
  }

  fetchAccount(): void {
    this.fetchAccount$.next();
  }

  loginWithCredentials(): void {
    // this.appwrite.account.createSession();
  }

  initialize(): void {
    console.log('init');
    this.fetchAccount();
  }
}
