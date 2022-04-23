import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectKanbanComponent } from './project-kanban.component';
import { ForModule } from '@rx-angular/template/experimental/for';
import { RouterModule } from '@angular/router';
import { ROUTES } from './project-kanban.routes';
import { TuiIslandModule, TuiTagModule } from '@taiga-ui/kit';
import { TuiSvgModule } from '@taiga-ui/core';
import { KanbanCardComponent } from './kanban-card/kanban-card.component';
import { TuiDragModule, TuiDroppableModule } from '@taiga-ui/cdk';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [ProjectKanbanComponent, KanbanCardComponent],
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
  ],
})
export class ProjectKanbanModule {}
