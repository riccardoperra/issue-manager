import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/auth/auth.guard';

const routes: Routes = [
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
    loadChildren: () =>
      import('./features/project-kanban/project-kanban.module').then(
        (m) => m.ProjectKanbanModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'team',
    loadChildren: () =>
      import('./features/team/team.module').then((m) => m.TeamModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false,
      initialNavigation: 'disabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
