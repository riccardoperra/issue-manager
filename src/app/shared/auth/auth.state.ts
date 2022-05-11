import { RxState } from '@rx-angular/state';
import { Inject, Injectable } from '@angular/core';
import { AuthStateModel } from './auth-state.model';
import { WithInitializer } from '../rxa-custom/initializer';
import { AccountService } from '../../data/account.service';
import { RxActionFactory } from '../rxa-custom/actions/actions.factory';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';
import { TeamsService } from '../../data/team.service';

export interface AuthCommand {
  fetchAccount: void;
}

@Injectable({
  providedIn: 'root',
})
export class AuthState
  extends RxState<AuthStateModel>
  implements WithInitializer
{
  readonly actions = this.rxAction.create();
  readonly session$ = this.select('session');
  readonly teams$ = this.select('teams');
  readonly account$ = this.select('account');

  readonly preferences$ = this.account$.pipe(
    map((account) => (account ? account.prefs : {}))
  );

  readonly isGuest$ = this.preferences$.pipe(
    map((prefs) => prefs.hasOwnProperty('guest') && prefs.guest === true)
  );

  constructor(
    @Inject(AccountService) private readonly accountService: AccountService,
    @Inject(TeamsService) private readonly teamService: TeamsService,
    @Inject(RxActionFactory)
    private readonly rxAction: RxActionFactory<AuthCommand>
  ) {
    super();

    this.connect(
      this.actions.fetchAccount$.pipe(
        exhaustMap(() =>
          this.accountService.getAccount().pipe(
            switchMap((account) =>
              this.teamService.getCurrentTeams().pipe(
                map((teams) => ({
                  teams,
                  account,
                }))
              )
            ),
            catchError(() => of({ teams: null, account: null }))
          )
        )
      )
    );
  }

  initialize(): void {
    this.actions.fetchAccount();
  }
}
