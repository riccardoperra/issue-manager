import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsBoardComponent } from './projects-board.component';
import { ForModule } from '@rx-angular/template/experimental/for';
import {
  TuiAvatarModule,
  TuiFieldErrorModule,
  TuiInputModule,
  TuiInputTagModule,
  TuiIslandModule,
  TuiRadioBlockModule,
  TuiTagModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiGroupModule,
  TuiLabelModule,
  TuiLinkModule,
  TuiModeModule,
  TuiTextfieldControllerModule,
  TuiTooltipModule,
} from '@taiga-ui/core';
import { ProjectCardComponent } from './project-card/project-card.component';
import { LetModule, PushModule } from '@rx-angular/template';
import { TuiAutoFocusModule, TuiRepeatTimesModule } from '@taiga-ui/cdk';
import { HeaderComponent } from './header/header.component';
import { AddProjectDialogComponent } from './add-project-dialog/add-project-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProjectsBoardComponent,
    ProjectCardComponent,
    HeaderComponent,
    AddProjectDialogComponent,
  ],
  imports: [
    CommonModule,
    ForModule,
    TuiIslandModule,
    TuiTagModule,
    TuiLinkModule,
    TuiGroupModule,
    LetModule,
    TuiRepeatTimesModule,
    TuiAvatarModule,
    PushModule,
    TuiButtonModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiAutoFocusModule,
    TuiTextfieldControllerModule,
    TuiTextAreaModule,
    TuiRadioBlockModule,
    TuiTooltipModule,
    TuiLabelModule,
    TuiFieldErrorModule,
    TuiInputTagModule,
    TuiModeModule,
  ],
})
export class ProjectsBoardModule {}
