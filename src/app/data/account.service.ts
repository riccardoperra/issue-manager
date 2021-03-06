import { Inject, Injectable } from '@angular/core';
import { APPWRITE } from '../providers/appwrite.provider';
import { Appwrite, Models } from 'appwrite';
import {
  defer,
  from,
  map,
  Observable,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AccountService {
  constructor(
    @Inject(APPWRITE)
    private readonly appwrite: Appwrite
  ) {}

  getAccount(): Observable<Models.User<{}>> {
    return defer(() => from(this.appwrite.account.get()));
  }

  logInAsGuest(): Observable<{
    account: Models.User<{}>;
    session: Models.Session;
  }> {
    const updatePrefs$ = defer(() =>
      this.appwrite.account.updatePrefs({ guest: true })
    );

    return from(this.appwrite.account.createAnonymousSession()).pipe(
      switchMap((session) =>
        updatePrefs$.pipe(
          switchMap(() =>
            from(this.appwrite.account.get()).pipe(
              map((account) => ({
                session,
                account,
              }))
            )
          )
        )
      )
    );
  }
}
