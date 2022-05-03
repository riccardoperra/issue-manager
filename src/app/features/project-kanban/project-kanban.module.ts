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
  TuiFilesModule,
  TuiInputDateTimeModule,
  TuiInputFileModule,
  TuiInputInlineModule,
  TuiInputModule,
  TuiIslandModule,
  TuiMultiSelectModule,
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
import { KanbanCardComponent } from './kanban-card/kanban-card.component';
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
import { KanbanListComponent } from './kanban-list/kanban-list.component';
import { LetModule, PushModule } from '@rx-angular/template';
import { KanbanAddListComponent } from './kanban-add-list/kanban-add-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KanbanArchivedMenuComponent } from './kanban-archived-menu/kanban-archived-menu.component';
import { KanbanAddCardComponent } from './kanban-add-card/kanban-add-card.component';
import { KanbanMembershipListComponent } from './kanban-membership-list/kanban-membership-list.component';
import { KanbanCardListComponent } from './kanban-card-list/kanban-card-list.component';
import { PlaygroundEditorModule } from '../../shared/lexical/editor/editor.module';
import { KanbanCardEditorComponent } from './kanban-card-editor/kanban-card-editor.component';
import { KanbanAttachmentsTableComponent } from './kanban-attachments-table/kanban-attachments-table.component';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiPreviewModule } from '@taiga-ui/addon-preview';
import { KanbanAttachmentPreviewComponent } from './kanban-attachments-table/kanban-attachment-preview/kanban-attachment-preview.component';

@NgModule({
  declarations: [
    ProjectKanbanComponent,
    KanbanCardComponent,
    KanbanListComponent,
    KanbanAddListComponent,
    KanbanArchivedMenuComponent,
    KanbanAddCardComponent,
    KanbanMembershipListComponent,
    KanbanCardListComponent,
    KanbanCardEditorComponent,
    KanbanAttachmentsTableComponent,
    KanbanAttachmentPreviewComponent,
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
    TuiMultiSelectModule,
    TuiInputDateTimeModule,
    TuiInputFileModule,
    TuiFilesModule,
    TuiTableModule,
    TuiPreviewModule,
  ],
})
export class ProjectKanbanModule {}
