import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectKanbanComponent } from './project-kanban.component';
import { ForModule } from '@rx-angular/template/experimental/for';
import { RouterModule } from '@angular/router';
import { ROUTES } from './project-kanban.routes';
import {
  TuiActionModule,
  TuiAvatarModule,
  TuiBadgedContentModule,
  TuiBadgeModule,
  TuiBreadcrumbsModule,
  TuiDropdownContextModule,
  TuiDropdownHoverModule,
  TuiInputInlineModule,
  TuiInputModule,
  TuiIslandModule,
  TuiTabsModule,
  TuiTagModule,
} from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownControllerModule,
  TuiDropdownModule,
  TuiExpandModule,
  TuiHostedDropdownModule,
  TuiLabelModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiNotificationModule,
  TuiScrollbarModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiActiveZoneModule,
  TuiAutoFocusModule,
  TuiDragModule,
  TuiDroppableModule,
  TuiElementModule,
  TuiHoveredModule,
  TuiLetModule,
  TuiMapperPipeModule,
  TuiOverscrollModule,
} from '@taiga-ui/cdk';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LetModule, PushModule } from '@rx-angular/template';
import { KanbanAddListComponent } from './kanban-add-list/kanban-add-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KanbanArchivedMenuComponent } from './kanban-archived-menu/kanban-archived-menu.component';
import { KanbanMembershipListComponent } from './kanban-membership-list/kanban-membership-list.component';
import { PlaygroundEditorModule } from '../../shared/lexical/editor/editor.module';
import { KanbanListComponent } from './kanban-list/kanban-list.component';
import { HasAuthorizationDirective } from '../../shared/permissions/has-authorization.directive';

@NgModule({
  declarations: [
    ProjectKanbanComponent,
    KanbanAddListComponent,
    KanbanArchivedMenuComponent,
    KanbanMembershipListComponent,
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
    TuiOverscrollModule,
    TuiElementModule,
    TuiTabsModule,
    TuiInputInlineModule,
    TuiAvatarModule,
    TuiDropdownHoverModule,
    TuiDropdownModule,
    TuiHoveredModule,
    TuiLabelModule,
    TuiLetModule,
    PlaygroundEditorModule,
    TuiLoaderModule,
    FormsModule,
    TuiNotificationModule,
    TuiDropdownContextModule,
    KanbanListComponent,
    HasAuthorizationDirective,
  ],
})
export class ProjectKanbanModule {}
