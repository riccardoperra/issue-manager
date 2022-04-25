import { Inject, Injectable } from '@angular/core';
import { APPWRITE } from '../providers/appwrite.provider';
import { Appwrite, Models } from 'appwrite';
import { defer, from, map, Observable, of, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsService {
  constructor(
    @Inject(APPWRITE)
    private readonly appwrite: Appwrite
  ) {}

  getAccount(): Observable<Models.User<{}>> {
    return defer(() => from(this.appwrite.account.get()));
  }

  getTeamDetail(
    $projectId: string
  ): Observable<{ team: Models.Team; members: readonly Models.Membership[] }> {
    return from(this.appwrite.teams.get($projectId)).pipe(
      switchMap((team) => {
        if (team.total === 0) return of({ team, members: [] });
        return from(this.appwrite.teams.getMemberships(team.$id)).pipe(
          map((members) => ({
            team,
            members: members.memberships,
          }))
        );
      })
    );
  }
}
