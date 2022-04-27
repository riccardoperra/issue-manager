import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcceptMembershipComponent } from './accept-membership/accept-membership.component';
import { RouterModule } from '@angular/router';
import { ROUTES } from './team.routes';

@NgModule({
  declarations: [AcceptMembershipComponent],
  imports: [CommonModule, RouterModule.forChild(ROUTES)],
})
export class TeamModule {}
