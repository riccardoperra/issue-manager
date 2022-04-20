import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsBoardComponent } from './features/projects-board/projects-board.component';

const routes: Routes = [{ path: '', component: ProjectsBoardComponent }];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false,
      // initialNavigation: 'disabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
