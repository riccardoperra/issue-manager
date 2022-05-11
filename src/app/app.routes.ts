import { Routes } from '@angular/router';
import { AuthGuard } from './shared/auth/auth.guard';

export const ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (e) => e.DashboardComponent
      ),
    canLoad: [AuthGuard],
  },
  {
    path: 'project/:projectId',
    loadComponent: () =>
      import('./features/project-kanban/project-kanban.component').then(
        (m) => m.ProjectKanbanComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'team',
    loadChildren: () =>
      import('./features/team/team.module').then((m) => m.TeamModule),
  },
];
