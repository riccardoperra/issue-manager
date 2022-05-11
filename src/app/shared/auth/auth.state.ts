import { RxState } from '@rx-angular/state';
import { Inject, Injectable } from '@angular/core';
import { AuthStateModel } from './auth-state.model';
import { WithInitializer } from '../rxa-custom/initializer';
import { AccountService } from '../../data/account.service';
import { RxActionFactory } from '../rxa-custom/actions/actions.factory';
import { catchError, exhaustMap, map, of, switchMap, tap } from 'rxjs';
import { TeamsService } from '../../data/team.service';

export interface AuthCommand {
  fetchAccount: void;
  fetchTeams: void;
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

  readonly fetchTeams$ = this.actions.fetchTeams$;
  readonly fetchTeams = this.actions.fetchTeams;

  constructor(
    @Inject(AccountService) private readonly accountService: AccountService,
    @Inject(TeamsService) private readonly teamService: TeamsService,
    @Inject(RxActionFactory)
    private readonly rxAction: RxActionFactory<AuthCommand>
  ) {
    super();

    this.connect(
      'account',
      this.actions.fetchAccount$.pipe(
        switchMap(() => this.accountService.getAccount()),
        tap(() => this.fetchTeams()),
        catchError(() => of(null))
      )
    );

    this.connect(
      'teams',
      this.actions.fetchTeams$.pipe(
        tap((x) => console.log('fetch team')),
        switchMap(() =>
          this.teamService.getCurrentTeams().pipe(catchError(() => of(null)))
        )
      )
    );
  }

  initialize(): void {
    this.actions.fetchAccount();
  }
}
