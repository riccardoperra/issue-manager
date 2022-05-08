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
import { CdkDragDrop, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { RxState, selectSlice } from '@rx-angular/state';
import { distinctUntilChanged, of } from 'rxjs';
import { tuiFadeIn } from '@taiga-ui/core';

@Component({
  selector: 'app-kanban-list',
  templateUrl: './kanban-list.component.html',
  styleUrls: ['./kanban-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [tuiFadeIn],
})
export class KanbanListComponent extends RxState<{
  list: Category;
  cards: readonly Card[];
}> {
  @Input()
  set list(list: Category) {
    this.connect('list', of(list));
  }

  @Input()
  set cards(cards: readonly Card[]) {
    this.connect('cards', of(cards));
  }

  readonly cards$ = this.select('cards').pipe(distinctUntilChanged());
  readonly list$ = this.select('list');

  readonly vm$ = this.select(selectSlice(['cards', 'list']));

  @Output()
  dropEvent = new EventEmitter<
    CdkDragDrop<readonly Card[], readonly Card[], Card>
  >();

  @Output()
  archiveCategory = new EventEmitter<any>();

  @Output()
  archiveCard = new EventEmitter<string>();

  @Output()
  addCard = new EventEmitter<any>();

  @Output()
  moveCard = new EventEmitter<any>();

  readonly cardTrackBy: TrackByFunction<Card> = (index, card) => card.$id;

  constructor(readonly c: CdkDropListGroup<any>) {
    super();
  }
}
