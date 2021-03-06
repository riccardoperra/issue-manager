import { ApplicationRef, Inject, Injectable } from '@angular/core';
import { AuthState } from './auth.state';
import { TuiAlertService } from '@taiga-ui/core';
import { Router } from '@angular/router';
import { catchError, defer, from, map, of, switchMap, tap } from 'rxjs';
import { APPWRITE } from '../../providers/appwrite.provider';
import { Appwrite, Models } from 'appwrite';
import { AccountService } from '../../data/account.service';

@Injectable({
  providedIn: 'root',
})
export class AuthEffects {
  constructor(
    @Inject(APPWRITE)
    private readonly appwrite: Appwrite,
    @Inject(AuthState)
    private readonly authState: AuthState,
    @Inject(AccountService)
    private readonly accountService: AccountService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(Router)
    private readonly router: Router,
    @Inject(ApplicationRef)
    private readonly appRef: ApplicationRef
  ) {}

  loginAsGuest = () => {
    this.accountService.logInAsGuest().subscribe({
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
        switchMap((session) =>
          from(this.appwrite.account.get()).pipe(
            map(
              (account) =>
                [session, account] as [Models.Session, Models.User<{}>]
            )
          )
        ),
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

  registerWithCredentials = ({
    name,
    email,
    password,
  }: {
    email: string;
    name: string | undefined | null;
    password: string;
  }) => {
    defer(() =>
      this.appwrite.account.create(
        'unique()',
        email,
        password,
        name ?? undefined
      )
    )
      .pipe(
        switchMap((account) =>
          defer(() =>
            this.appwrite.account.createSession(email, password)
          ).pipe(map((session) => ({ session, account })))
        ),
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
        ),
        tap(() => this.router.navigate(['/']))
      )
      .subscribe();
  };

  logout = () => {
    from(this.appwrite.account.deleteSession('current'))
      .pipe(
        tap(() =>
          this.authState.set({
            account: null,
            session: null,
          })
        )
      )
      .subscribe(() => {
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/login']).then((e) => console.log(e));
      });
  };

  deleteAccount = () => {
    this.appwrite.account
      .delete()
      .then(() => this.authState.set({ account: null, session: null }))
      .then(() => localStorage.clear())
      .then(() => sessionStorage.clear())
      .then(() => this.router.navigate(['/login']));
  };

  loginWithGoogle = () => {
    this.appwrite.account.createOAuth2Session(
      'google',
      location.origin,
      `${location.origin}/login`
    );
  };

  loginWithGithub = () => {
    this.appwrite.account.createOAuth2Session(
      'github',
      location.origin,
      `${location.origin}/login`
    );
  };
}
