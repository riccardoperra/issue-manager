import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectKanbanComponent } from './project-kanban.component';
import { ForModule } from '@rx-angular/template/experimental/for';
import { RouterModule } from '@angular/router';
import { ROUTES } from './project-kanban.routes';
import {
  TuiActionModule,
  TuiBreadcrumbsModule,
  TuiIslandModule,
  TuiTagModule,
} from '@taiga-ui/kit';
import { TuiButtonModule, TuiLinkModule, TuiSvgModule } from '@taiga-ui/core';
import { KanbanCardComponent } from './kanban-card/kanban-card.component';
import {
  TuiDragModule,
  TuiDroppableModule,
  TuiMapperPipeModule,
} from '@taiga-ui/cdk';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { KanbanListComponent } from './kanban-list/kanban-list.component';
import { LetModule, PushModule } from '@rx-angular/template';

@NgModule({
  declarations: [
    ProjectKanbanComponent,
    KanbanCardComponent,
    KanbanListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    ForModule,
    TuiIslandModule,
    TuiTagModule,
    TuiSvgModule,
    TuiDragModule,
    TuiDroppableModule,
    DragDropModule,
    TuiMapperPipeModule,
    PushModule,
    LetModule,
    TuiButtonModule,
    TuiActionModule,
    TuiBreadcrumbsModule,
    TuiLinkModule,
  ],
})
export class ProjectKanbanModule {}
