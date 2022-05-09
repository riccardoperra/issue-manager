import { Inject, Injectable } from '@angular/core';
import { AuthState } from '../auth/auth.state';
import { CURRENT_WORKSPACE_CONTEXT } from './current-team-context';
import { map, Observable, tap } from 'rxjs';
import { smosh } from '../utils/smosh';
import { shareReplay } from 'rxjs/operators';

@Injectable()
export class PermissionsService {
  constructor(
    @Inject(AuthState)
    private readonly authState: AuthState,
    @Inject(CURRENT_WORKSPACE_CONTEXT)
    private readonly currentWorkspace: Observable<string>
  ) {}

  private readonly state$ = smosh({
    workspaceId: this.currentWorkspace,
    teams: this.authState.teams$,
  });

  private readonly includesCurrentWorkspace$ = this.state$.pipe(
    tap((x) => console.log(x)),
    map(({ workspaceId, teams }) => {
      if (!teams) return false;
      return teams.map((team) => team.$id).includes(workspaceId);
    }),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  readonly canWriteOnWorkspace$: Observable<boolean> =
    this.includesCurrentWorkspace$;
}
