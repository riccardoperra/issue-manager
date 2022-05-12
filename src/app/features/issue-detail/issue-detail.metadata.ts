import { IssueEditorAdapter } from './issue-detail-adapter.service';
import { RxActionFactory } from '../../shared/rxa-custom/actions/actions.factory';
import { LetModule, PushModule } from '@rx-angular/template';
import { CommonModule } from '@angular/common';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiLoaderModule,
  TuiNotificationModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TuiBadgeModule,
  TuiDataListWrapperModule,
  TuiInputDateModule,
  TuiInputModule,
  TuiInputTagModule,
  TuiSelectModule,
  TuiTagModule,
} from '@taiga-ui/kit';
import { TuiActiveZoneModule, TuiAutoFocusModule } from '@taiga-ui/cdk';
import { PlaygroundEditorModule } from '../../shared/lexical/editor/editor.module';
import { IssueAttachmentsUploaderComponent } from './issue-attachments-uploader/issue-attachments-uploader.component';
import { IssueAttachmentsTableComponent } from './issue-attachments-table/issue-attachments-table.component';
import { ToNativeDateDirective } from '../../shared/directives/native-date';
import { TuiUnfinishedValidatorModule } from '@taiga-ui/kit/directives/unfinished-validator/unfinished-validator.module';

export const ISSUE_DETAIL_PROVIDERS = [IssueEditorAdapter, RxActionFactory];

export const ISSUE_DETAIL_IMPORTS = [
  LetModule,
  CommonModule,
  TuiButtonModule,
  FormsModule,
  ReactiveFormsModule,
  TuiInputModule,
  TuiAutoFocusModule,
  TuiTextfieldControllerModule,
  TuiActiveZoneModule,
  TuiInputDateModule,
  TuiSelectModule,
  TuiDataListModule,
  TuiDataListWrapperModule,
  TuiInputTagModule,
  TuiNotificationModule,
  TuiTagModule,
  TuiSvgModule,
  PlaygroundEditorModule,
  TuiLoaderModule,
  PushModule,
  IssueAttachmentsTableComponent,
  IssueAttachmentsUploaderComponent,
  ToNativeDateDirective,
  TuiBadgeModule,
  TuiUnfinishedValidatorModule,
];
