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
import { CommonModule } from '@angular/common';
import { TuiInputInlineModule, TuiIslandModule } from '@taiga-ui/kit';
import { TuiActiveZoneModule, TuiAutoFocusModule } from '@taiga-ui/cdk';

interface Actions {
  close: void;
  edit: void;
  confirm: string;
}

@Component({
  selector: 'app-kanban-add-card',
  templateUrl: './kanban-add-card.component.html',
  styleUrls: ['./kanban-add-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TuiButtonModule,
    CommonModule,
    TuiSvgModule,
    TuiExpandModule,
    TuiIslandModule,
    TuiInputInlineModule,
    TuiTextfieldControllerModule,
    TuiAutoFocusModule,
    TuiActiveZoneModule,
  ],
})
export class KanbanAddCardComponent {
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
    this.confirmEvent.emit(this.form.value.name as string);
    this.form.reset({ name: '' });
  }
}
