import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamsService } from '../../../data/team.service';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { from, switchMap } from 'rxjs';

@Component({
  selector: 'app-accept-membership',
  template: ``,
  standalone: true,
})
export class AcceptMembershipComponent implements OnInit {
  constructor(
    @Inject(ActivatedRoute)
    private readonly activatedRoute: ActivatedRoute,
    @Inject(Router)
    private readonly router: Router,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(TeamsService)
    private readonly teamsService: TeamsService
  ) {}

  ngOnInit(): void {
    const {
      teamId,
      membershipId,
      userId,
      secret,
      // prettier-ignore
    } = this.activatedRoute.snapshot.queryParams;

    if (!teamId || !membershipId || !userId || !secret) {
      this.router.navigate(['/not-found']);
    } else {
      this.teamsService
        .updateMembershipStatus(teamId, membershipId, userId, secret)
        .pipe(
          switchMap((membership) =>
            from(this.router.navigate(['/'])).pipe(
              switchMap(() =>
                this.alertService.open(
                  `You're now part of ${membership.name}`,
                  {
                    status: TuiNotification.Info,
                  }
                )
              )
            )
          )
        )

        .subscribe(() => {
          this.router
            .navigate(['/'])
            .then(() => this.alertService.open('Invite accepted successfully'));
        });
    }
  }
}
