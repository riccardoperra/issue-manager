import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsBoardComponent } from './projects-board.component';
import { ForModule } from '@rx-angular/template/experimental/for';
import { TuiIslandModule, TuiTagModule } from '@taiga-ui/kit';
import { TuiGroupModule, TuiLinkModule } from '@taiga-ui/core';
import { ProjectCardComponent } from './project-card/project-card.component';
import { LetModule } from '@rx-angular/template';
import { TuiRepeatTimesModule } from '@taiga-ui/cdk';

@NgModule({
  declarations: [ProjectsBoardComponent, ProjectCardComponent],
  imports: [
    CommonModule,
    ForModule,
    TuiIslandModule,
    TuiTagModule,
    TuiLinkModule,
    TuiGroupModule,
    LetModule,
    TuiRepeatTimesModule,
  ],
})
export class ProjectsBoardModule {}
