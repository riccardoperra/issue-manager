import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
  TrackByFunction,
} from '@angular/core';
import { Category } from 'src/app/data/categories.service';
import { Card } from '../../../data/cards.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { RxState } from '@rx-angular/state';
import { distinctUntilChanged, from, map, of, switchMap } from 'rxjs';
import { TuiDialogService, tuiFadeIn } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'app-kanban-card-list',
  templateUrl: './kanban-card-list.component.html',
  styleUrls: ['./kanban-card-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [tuiFadeIn],
})
export class KanbanCardListComponent extends RxState<{
  category: Category;
  cards: readonly Card[];
}> {
  @Input()
  set list(category: Category) {
    this.connect('category', of(category));
  }

  @Input()
  set cards(cards: readonly Card[]) {
    this.connect('cards', of(cards));
  }

  readonly cards$ = this.select('cards').pipe(
    distinctUntilChanged(),
    map((cards) => cards.filter((card) => !card.archived))
  );

  readonly list$ = this.select('category');

  @Output()
  dropEvent = new EventEmitter<
    CdkDragDrop<readonly Card[], readonly Card[], Card>
  >();

  @Output()
  archiveCard = new EventEmitter<string>();

  readonly cardTrackBy: TrackByFunction<Card> = (index, card) => card.$id;

  constructor(
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService
  ) {
    super();
  }

  openIssue(card: Card): void {
    const detail = import('../../issue-detail/issue-detail.component').then(
      (m) => m.IssueDetailComponent
    );

    from(detail)
      .pipe(
        switchMap((component) =>
          this.dialogService.open(new PolymorpheusComponent(component), {
            size: 'page',
            data: { cardId: card.$id },
          })
        )
      )
      .subscribe();
  }
}
