import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import { Card } from '../../../data/cards.service';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { RxStrategyProvider } from '@rx-angular/cdk/render-strategies';
import { KanbanCardEditorComponent } from '../kanban-card-editor/kanban-card-editor.component';

@Component({
  selector: 'app-kanban-card',
  templateUrl: './kanban-card.component.html',
  styleUrls: ['./kanban-card.component.scss'],
  providers: [],
})
export class KanbanCardComponent implements OnInit {
  @Input()
  card: Card | null = null;

  onClick(card: Card): void {
    this.dialogService
      .open(new PolymorpheusComponent(KanbanCardEditorComponent), {
        size: 'page',
        data: {
          cardId: card.$id,
        },
      })
      .subscribe();
  }

  constructor(
    @Inject(ElementRef)
    private readonly elementRef: ElementRef<HTMLElement>,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService,
    private readonly strategy: RxStrategyProvider,
    private readonly cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}
}
