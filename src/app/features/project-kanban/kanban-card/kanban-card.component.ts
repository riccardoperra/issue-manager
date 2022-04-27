import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import { Card } from '../../../data/cards.service';
import { TuiDialogService } from '@taiga-ui/core';
import { EditCardComponent } from '../edit-card/edit-card.component';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { RxStrategyProvider } from '@rx-angular/cdk/render-strategies';

@Component({
  selector: 'app-kanban-card',
  templateUrl: './kanban-card.component.html',
  styleUrls: ['./kanban-card.component.scss'],
  providers: [],
})
export class KanbanCardComponent implements OnInit {
  @Input()
  card: Card | null = null;

  onClick(h: any): void {
    this.dialogService
      .open(new PolymorpheusComponent(EditCardComponent), {
        size: 'page',
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
