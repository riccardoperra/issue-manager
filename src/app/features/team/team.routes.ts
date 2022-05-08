import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: 'memberships/accept',
    loadComponent: () =>
      import('./accept-membership/accept-membership.component').then(
        (m) => m.AcceptMembershipComponent
      ),
  },
];
