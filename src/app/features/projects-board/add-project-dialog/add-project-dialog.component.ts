import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';
import { AddProjectRequest } from '../../../data/projects.service';

@Component({
  selector: 'app-add-project-dialog',
  templateUrl: './add-project-dialog.component.html',
  styleUrls: ['./add-project-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProjectDialogComponent {
  readonly form = this.fb.group({
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
    this.context.completeWith(this.form.value);
  }
}
