import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import {
  TuiButtonModule,
  TuiDialogContext,
  TuiGroupModule,
  TuiLabelModule,
  TuiTextfieldControllerModule,
  TuiTooltipModule,
} from '@taiga-ui/core';
import {
  AddProjectRequest,
  EditProjectRequest,
  Project,
} from '../../../data/projects.service';
import {
  TuiFieldErrorModule,
  TuiInputModule,
  TuiInputTagModule,
  TuiRadioBlockModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';

@Component({
  selector: 'app-edit-project-dialog',
  templateUrl: './edit-project-dialog.component.html',
  styleUrls: ['./edit-project-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    TuiTextfieldControllerModule,
    TuiTextAreaModule,
    TuiRadioBlockModule,
    TuiTooltipModule,
    TuiLabelModule,
    TuiInputTagModule,
    TuiInputModule,
    TuiFieldErrorModule,
    TuiGroupModule,
    ReactiveFormsModule,
    TuiButtonModule,
  ],
})
export class EditProjectDialogComponent {
  readonly form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    tags: [[] as string[]],
    visibility: ['private'],
  });

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<
      EditProjectRequest | void,
      Project
    >,
    @Inject(FormBuilder)
    private readonly fb: FormBuilder
  ) {
    this.form.patchValue(context.data);
  }

  close(): void {
    this.context.completeWith();
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;
    this.context.completeWith(this.form.value as AddProjectRequest);
  }
}
