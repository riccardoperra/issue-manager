import { IssueEditorAdapter } from './issue-detail-adapter.service';
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
import { IssueAttachmentsUploaderComponent } from './issue-attachments-uploader/issue-attachments-uploader.component';
import { IssueAttachmentsTableComponent } from './issue-attachments-table/issue-attachments-table.component';

export const ISSUE_DETAIL_PROVIDERS = [IssueEditorAdapter, RxActionFactory];

export const ISSUE_DETAIL_IMPORTS = [
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
  PushModule,
  IssueAttachmentsTableComponent,
  IssueAttachmentsUploaderComponent,
];
