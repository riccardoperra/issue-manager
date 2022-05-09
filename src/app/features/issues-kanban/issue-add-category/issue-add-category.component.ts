import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  TuiButtonModule,
  TuiExpandModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiInputModule, TuiIslandModule } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';
import { TuiActiveZoneModule, TuiAutoFocusModule } from '@taiga-ui/cdk';

@Component({
  selector: 'app-kanban-add-list',
  templateUrl: './issue-add-category.component.html',
  styleUrls: ['./issue-add-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiExpandModule,
    TuiIslandModule,
    TuiInputModule,
    CommonModule,
    TuiAutoFocusModule,
    TuiTextfieldControllerModule,
    TuiButtonModule,
    TuiSvgModule,
    TuiActiveZoneModule,
  ],
})
export class IssueAddCategoryComponent {
  readonly form = this.fb.group({
    name: this.fb.control('', Validators.required),
  });

  edit: boolean = false;

  @Output()
  readonly confirmEvent = new EventEmitter<string>();

  constructor(
    @Inject(FormBuilder)
    private readonly fb: FormBuilder
  ) {}

  add(): void {
    this.edit = true;
  }

  close(): void {
    this.edit = false;
    this.form.reset({ name: this.form.value.name });
  }

  zoneChange(inZone: boolean): void {
    if (!inZone) {
      this.close();
    }
  }

  confirm(): void {
    if (this.form.invalid) return;
    this.edit = false;
    this.confirmEvent.emit(this.form.value.name as any);
    this.form.reset({ name: '' });
  }
}
