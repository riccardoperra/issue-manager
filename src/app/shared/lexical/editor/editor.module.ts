import { NgModule } from '@angular/core';
import { LexicalModule } from 'lexical-angular';
import { PlaygroundEditorComponent } from './editor.component';
import { CommonModule } from '@angular/common';
import { LexicalToolbarComponent } from './toolbar/toolbar.component';
import { LexicalToolbarBlockDropdownComponent } from './toolbar/block-dropdown/block-dropdown.component';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownControllerModule,
  TuiDropdownModule,
  TuiHintModule,
  TuiHostedDropdownModule,
  TuiLinkModule,
  TuiTextfieldControllerModule,
  TuiWrapperModule,
} from '@taiga-ui/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TuiDataListWrapperModule,
  TuiInputModule,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { LexicalFloatingLinkEditorComponent } from './toolbar/floating-link-editor/floating-link-editor.component';
import { TuiAutoFocusModule } from '@taiga-ui/cdk';

@NgModule({
  imports: [
    CommonModule,
    LexicalModule,
    TuiDropdownModule,
    TuiButtonModule,
    TuiHostedDropdownModule,
    TuiDropdownControllerModule,
    TuiDataListModule,
    FormsModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    TuiHintModule,
    TuiInputModule,
    TuiAutoFocusModule,
    TuiWrapperModule,
    TuiLinkModule,
  ],
  exports: [PlaygroundEditorComponent],
  declarations: [
    PlaygroundEditorComponent,
    LexicalToolbarComponent,
    LexicalToolbarBlockDropdownComponent,
    LexicalFloatingLinkEditorComponent,
  ],
  providers: [],
})
export class PlaygroundEditorModule {}
