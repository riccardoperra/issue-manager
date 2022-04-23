import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsBoardComponent } from './features/projects-board/projects-board.component';
import { AuthGuard } from './shared/auth/auth.guard';

const routes: Routes = [
  { path: '', component: ProjectsBoardComponent, canActivate: [AuthGuard] },
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
    loadChildren: () =>
      import('./features/login/login.module').then((m) => m.LoginModule),
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
