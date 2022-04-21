import { Inject, Injectable } from '@angular/core';
import { AuthState } from './auth.state';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { Router } from '@angular/router';
import {
  catchError,
  combineLatestWith,
  from,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { APPWRITE } from '../../providers/appwrite.provider';
import { Appwrite } from 'appwrite';

@Injectable({
  providedIn: 'root',
})
export class AuthEffects {
  constructor(
    @Inject(APPWRITE)
    private readonly appwrite: Appwrite,
    @Inject(AuthState)
    private readonly authState: AuthState,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(Router)
    private readonly router: Router
  ) {}

  authError = () => {
    this.router.navigate(['/login']);
    this.alertService
      .open('Error while authenticate.', {
        status: TuiNotification.Error,
      })
      .subscribe();
  };

  loginAsGuest = () => {
    from(this.appwrite.account.createAnonymousSession())
      .pipe(
        switchMap((session) =>
          from(this.appwrite.account.get()).pipe(
            map((account) => ({
              session,
              account,
            }))
          )
        )
      )
      .subscribe({
        next: ({ session, account }) => {
          this.authState.set({ account, session });
          this.router.navigate(['/']);
        },
        error: () => {
          this.authState.set({ account: null, session: null });
          this.router.navigate(['/login']);
        },
      });
  };

  loginWithCredentials = ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    from(this.appwrite.account.createSession(email, password))
      .pipe(
        combineLatestWith(this.appwrite.account.get()),
        map(([session, account]) => ({ session, account })),
        tap(() => this.router.navigate(['/'])),
        catchError(() =>
          of({ session: null, account: null }).pipe(
            tap(() => this.router.navigate(['/login']))
          )
        ),
        tap(({ account, session }) =>
          this.authState.set({
            account,
            session,
          })
        )
      )
      .subscribe();
  };
}
