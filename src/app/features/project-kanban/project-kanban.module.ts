import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectKanbanComponent } from './project-kanban.component';
import { ForModule } from '@rx-angular/template/experimental/for';
import { RouterModule } from '@angular/router';
import { ROUTES } from './project-kanban.routes';
import {
  TuiActionModule,
  TuiBadgedContentModule,
  TuiBadgeModule,
  TuiBreadcrumbsModule,
  TuiInputModule,
  TuiIslandModule,
  TuiTagModule,
} from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownControllerModule,
  TuiExpandModule,
  TuiHostedDropdownModule,
  TuiLinkModule,
  TuiScrollbarModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { KanbanCardComponent } from './kanban-card/kanban-card.component';
import {
  TuiActiveZoneModule,
  TuiAutoFocusModule,
  TuiDragModule,
  TuiDroppableModule,
  TuiMapperPipeModule,
} from '@taiga-ui/cdk';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { KanbanListComponent } from './kanban-list/kanban-list.component';
import { LetModule, PushModule } from '@rx-angular/template';
import { KanbanAddListComponent } from './kanban-add-list/kanban-add-list.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProjectKanbanComponent,
    KanbanCardComponent,
    KanbanListComponent,
    KanbanAddListComponent,
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
    TuiExpandModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiAutoFocusModule,
    TuiActiveZoneModule,
    ReactiveFormsModule,
    TuiHostedDropdownModule,
    TuiDropdownControllerModule,
    TuiDataListModule,
    TuiBadgeModule,
    TuiBadgedContentModule,
    TuiScrollbarModule,
  ],
})
export class ProjectKanbanModule {}
