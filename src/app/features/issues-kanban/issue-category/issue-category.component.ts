import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TrackByFunction,
} from '@angular/core';
import { Category } from 'src/app/data/categories.service';
import { Card } from '../../../data/cards.service';
import {
  CdkDragDrop,
  CdkDragEnd,
  CdkDragStart,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { RxState, selectSlice } from '@rx-angular/state';
import { of } from 'rxjs';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownControllerModule,
  tuiFadeIn,
  TuiHostedDropdownModule,
  TuiScrollbarModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { TuiElementModule } from '@taiga-ui/cdk';
import { LetModule } from '@rx-angular/template';
import { HasAuthorizationDirective } from '../../../shared/permissions/has-authorization.directive';
import { IssueCardListComponent } from '../issue-card-list/issue-card-list.component';
import { AddIssueCardComponent } from '../issue-add-issue-card/add-issue-card.component';

@Component({
  selector: 'app-issue-category',
  templateUrl: './issue-category.component.html',
  styleUrls: ['./issue-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [tuiFadeIn],
  standalone: true,
  imports: [
    LetModule,
    TuiScrollbarModule,
    TuiIslandModule,
    DragDropModule,
    TuiElementModule,
    TuiHostedDropdownModule,
    TuiDropdownControllerModule,
    TuiButtonModule,
    TuiSvgModule,
    TuiDataListModule,
    AddIssueCardComponent,
    IssueCardListComponent,
    HasAuthorizationDirective,
  ],
})
export class IssueCategoryComponent extends RxState<{
  list: Category;
  cards: readonly Card[];
  readOnly: boolean;
}> {
  @Input()
  set readOnly(readOnly: boolean) {
    this.connect('readOnly', of(readOnly));
  }

  @Input()
  set list(list: Category) {
    this.connect('list', of(list));
  }

  @Input()
  set cards(cards: readonly Card[]) {
    this.connect('cards', of(cards));
  }

  readonly vm$ = this.select(selectSlice(['cards', 'list', 'readOnly']));

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

  @Output()
  dragStartEvent = new EventEmitter<CdkDragStart>();

  @Output()
  dragEndEvent = new EventEmitter<CdkDragEnd>();

  readonly cardTrackBy: TrackByFunction<Card> = (index, card) => card.$id;

  constructor() {
    super();
  }
}
