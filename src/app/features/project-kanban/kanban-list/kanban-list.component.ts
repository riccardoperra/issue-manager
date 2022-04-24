import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TrackByFunction,
} from '@angular/core';
import { Category } from 'src/app/data/categories.service';
import { Card } from '../../../data/cards.service';
import { sortByRank } from '../../../shared/utils/ranking';
import { CdkDragDrop, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { RxState } from '@rx-angular/state';
import { map, of, tap } from 'rxjs';

@Component({
  selector: 'app-kanban-list',
  templateUrl: './kanban-list.component.html',
  styleUrls: ['./kanban-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanListComponent
  extends RxState<{ category: Category; cards: readonly Card[] }>
  implements OnInit
{
  @Input()
  set list(category: Category) {
    this.connect('category', of(category));
  }

  @Input()
  set cards(cards: readonly Card[]) {
    this.connect('cards', of(cards));
  }

  readonly cards$ = this.select('cards').pipe(
    tap((x) => console.log(x)),
    map((cards) => [...cards].sort((a, b) => sortByRank(a.rank, b.rank)))
  );

  readonly list$ = this.select('category');

  @Output()
  dropEvent = new EventEmitter<
    CdkDragDrop<readonly Card[], readonly Card[], Card>
  >();

  readonly cardTrackBy: TrackByFunction<Card> = (index, card) => card.rank;

  constructor(readonly c: CdkDropListGroup<any>) {
    super();
  }

  ngOnInit(): void {}
}