import { Inject, Injectable } from '@angular/core';
import { APPWRITE } from '../providers/appwrite.provider';
import { Appwrite, Models } from 'appwrite';
import { catchError, defer, from, map, Observable, of, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TeamsService {
  constructor(
    @Inject(APPWRITE)
    private readonly appwrite: Appwrite
  ) {}

  getAccount(): Observable<Models.User<{}>> {
    return defer(() => from(this.appwrite.account.get()));
  }

  getTeamDetail($projectId: string): Observable<{
    team: Models.Team | null;
    members: readonly Models.Membership[];
  }> {
    return from(this.appwrite.teams.get($projectId)).pipe(
      switchMap((team) => {
        if (team.total === 0) return of({ team, members: [] });
        return from(this.appwrite.teams.getMemberships(team.$id)).pipe(
          map((members) => ({
            team,
            members: members.memberships,
          }))
        );
      }),
      catchError(() =>
        of({
          members: [],
          team: null,
        } as unknown as { team: Models.Team; members: readonly Models.Membership[] })
      )
    );
  }

  addMembership($projectId: string, email: string) {
    return from(
      this.appwrite.teams.createMembership(
        $projectId,
        email,
        ['member'],
        `http://localhost:4200/team/memberships/accept`
      )
    );
  }

  updateMembershipStatus(
    teamId: string,
    membershipId: string,
    userId: string,
    secret: string
  ): Observable<Models.Membership> {
    return from(
      this.appwrite.teams.updateMembershipStatus(
        teamId!,
        membershipId!,
        userId!,
        secret!
      )
    );
  }

  removeMembership($projectId: string, $id: string) {
    return from(this.appwrite.teams.deleteMembership($projectId, $id));
  }
}
