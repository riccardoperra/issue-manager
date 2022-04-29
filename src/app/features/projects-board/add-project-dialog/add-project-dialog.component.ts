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
import { AddProjectRequest } from '../../../data/projects.service';
import {
  TuiFieldErrorModule,
  TuiInputModule,
  TuiInputTagModule,
  TuiRadioBlockModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';

@Component({
  selector: 'app-add-project-dialog',
  templateUrl: './add-project-dialog.component.html',
  styleUrls: ['./add-project-dialog.component.scss'],
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
export class AddProjectDialogComponent {
  readonly form = this.fb.group<any>({
    name: ['', Validators.required],
    description: [''],
    imageUrl: [null],
    tags: [[]],
    visibility: ['private'],
  });

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<void, AddProjectRequest>,
    @Inject(FormBuilder)
    private readonly fb: FormBuilder
  ) {}

  close(): void {
    this.context.completeWith();
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;
    this.context.completeWith(this.form.value as any);
  }
}
