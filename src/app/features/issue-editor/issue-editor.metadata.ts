import { KanbanCardEditorAdapter } from './kanban-card-editor.adapter';
import { RxActionFactory } from '../../shared/rxa-custom/actions/actions.factory';
import { LetModule, PushModule } from '@rx-angular/template';
import { CommonModule } from '@angular/common';
import {
  TuiButtonModule,
  TuiLoaderModule,
  TuiNotificationModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiInputModule, TuiTagModule } from '@taiga-ui/kit';
import { TuiActiveZoneModule, TuiAutoFocusModule } from '@taiga-ui/cdk';
import { PlaygroundEditorModule } from '../../shared/lexical/editor/editor.module';
import { KanbanAttachmentsTableComponent } from '../project-kanban/kanban-attachments-table/kanban-attachments-table.component';

export const ISSUE_EDITOR_PROVIDERS = [
  KanbanCardEditorAdapter,
  RxActionFactory,
];

export const ISSUE_EDITOR_IMPORTS = [
  LetModule,
  CommonModule,
  TuiButtonModule,
  ReactiveFormsModule,
  TuiInputModule,
  TuiAutoFocusModule,
  TuiTextfieldControllerModule,
  TuiActiveZoneModule,
  TuiNotificationModule,
  TuiTagModule,
  TuiSvgModule,
  PlaygroundEditorModule,
  TuiLoaderModule,
  KanbanAttachmentsTableComponent,
  PushModule,
];

export const ISSUES_EDITOR_METADATA = {
  imports: ISSUE_EDITOR_IMPORTS,
  providers: ISSUE_EDITOR_PROVIDERS,
};
