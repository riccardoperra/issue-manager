import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Injector,
  Input,
  Output,
  TrackByFunction,
} from '@angular/core';
import { Category } from 'src/app/data/categories.service';
import { Card } from '../../../data/cards.service';
import {
  CdkDragDrop,
  CdkDragStart,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { RxState } from '@rx-angular/state';
import { distinctUntilChanged, from, map, of, switchMap } from 'rxjs';
import {
  TuiDataListModule,
  TuiDialogService,
  tuiFadeIn,
  TuiSvgModule,
} from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { LetModule } from '@rx-angular/template';
import { ForModule } from '@rx-angular/template/experimental/for';
import { TuiDropdownContextModule } from '@taiga-ui/kit';
import { TuiActiveZoneModule } from '@taiga-ui/cdk';
import { CommonModule } from '@angular/common';
import { IssueCardComponent } from '../issue-card/issue-card.component';

@Component({
  selector: 'app-issue-card-list',
  templateUrl: './issue-card-list.component.html',
  styleUrls: ['./issue-card-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [tuiFadeIn],
  standalone: true,
  imports: [
    CommonModule,
    LetModule,
    DragDropModule,
    ForModule,
    TuiDropdownContextModule,
    TuiDataListModule,
    TuiActiveZoneModule,
    TuiSvgModule,
    IssueCardComponent,
  ],
})
export class IssueCardListComponent extends RxState<{
  category: Category;
  cards: readonly Card[];
}> {
  @Input()
  readOnly: boolean = false;

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
    private readonly dialogService: TuiDialogService,
    @Inject(Injector)
    private readonly injector: Injector
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
          this.dialogService.open(
            new PolymorpheusComponent(component, this.injector),
            {
              size: 'page',
              data: { cardId: card.$id },
            }
          )
        )
      )
      .subscribe();
  }
}
