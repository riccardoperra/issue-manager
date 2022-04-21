import { Inject, Injectable } from '@angular/core';
import { APPWRITE } from '../providers/appwrite.provider';
import { Appwrite, Models } from 'appwrite';
import { defer, from, map, Observable, switchMap } from 'rxjs';

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
    return from(this.appwrite.account.createAnonymousSession()).pipe(
      switchMap((session) =>
        from(this.appwrite.account.get()).pipe(
          map((account) => ({
            session,
            account,
          }))
        )
      )
    );
  }
}
