import {
  Component,
  Inject,
  Input,
  NgZone,
  TrackByFunction,
} from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Category } from '../../data/categories.service';
import { Card } from '../../data/cards.service';
import { IssueCategoryComponent } from './issue-category/issue-category.component';
import { IssueCardListComponent } from './issue-card-list/issue-card-list.component';
import { IssueCardComponent } from './issue-card/issue-card.component';
import { getNextRank, moveRank } from '../../shared/utils/ranking';
import { RxActionFactory } from '../../shared/rxa-custom/actions/actions.factory';
import { map, tap, withLatestFrom } from 'rxjs';
import { TuiNotification } from '@taiga-ui/core/enums/notification';
import {
  TuiAlertService,
  TuiDialogService,
  TuiScrollbarModule,
} from '@taiga-ui/core';
import { ProjectKanbanAdapter } from '../project-kanban/project-kanban.adapter';
import {
  TuiElementModule,
  TuiOverscrollModule,
  TuiScrollService,
} from '@taiga-ui/cdk';
import { IssueAddCategoryComponent } from './issue-add-category/issue-add-category.component';
import { LetModule } from '@rx-angular/template';
import { ForModule } from '@rx-angular/template/experimental/for';
import { HasAuthorizationDirective } from '../../shared/permissions/has-authorization.directive';

interface LocalActions {
  moveCategory: CdkDragDrop<readonly Category[], readonly Category[], Category>;
  moveCard: CdkDragDrop<readonly Card[], readonly Card[], Card>;
  addCategory: { name: string; scrollRef: Element };
  addCard: { name: string; $categoryId: string };
  archiveCategory: { $id: string };
  archiveCard: { $id: string };
}

@Component({
  selector: 'app-issues-kanban',
  templateUrl: './issues-kanban.component.html',
  styleUrls: ['./issues-kanban.component.scss'],
  standalone: true,
  providers: [RxActionFactory],
  imports: [
    IssueCategoryComponent,
    IssueCardListComponent,
    IssueCardComponent,
    IssueAddCategoryComponent,
    TuiElementModule,
    TuiScrollbarModule,
    TuiOverscrollModule,
    DragDropModule,
    LetModule,
    ForModule,
    HasAuthorizationDirective,
  ],
})
export class IssuesKanbanComponent {
  @Input()
  readOnly: boolean = false;

  readonly ui = this.rxActionFactory.create();
  readonly categories$ = this.adapter.sortedCategories$;
  readonly groupedCards$ = this.adapter.cardsByCategory$;
  readonly project$ = this.adapter.project$;

  readonly categoriesTrackBy: TrackByFunction<Category> = (index, category) =>
    `${category.$id}`;

  constructor(
    @Inject(RxActionFactory)
    private readonly rxActionFactory: RxActionFactory<LocalActions>,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(ProjectKanbanAdapter)
    readonly adapter: ProjectKanbanAdapter,
    @Inject(TuiScrollService)
    private readonly scrollService: TuiScrollService,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService,
    @Inject(NgZone)
    private readonly ngZone: NgZone
  ) {
    this.adapter.hold(
      this.ui.moveCard$.pipe(
        withLatestFrom(this.groupedCards$),
        map(([event, groupedCards]) =>
          this.getUpdatedCardRank(event, groupedCards)
        )
      ),
      (event) => {
        if (!event) return;
        if (!event.categoryId) {
          return this.adapter.ui.updateCardPosition({
            $id: event.target,
            rank: event.newRank,
          });
        }
        this.adapter.ui.updateCardCategory({
          rank: event.newRank,
          $id: event.target,
          categoryId: event.categoryId,
        });
      }
    );

    this.adapter.hold(
      this.ui.addCategory$.pipe(
        tap(({ scrollRef }) => {
          this.ngZone.run(() => {
            this.scrollService
              .scroll$(scrollRef, 0, scrollRef.scrollWidth, 150)
              .subscribe();
          });
        }),
        withLatestFrom(this.project$, this.categories$),
        map(([{ name }, project, categories]) => ({
          name,
          $projectId: project.$id,
          rank: getNextRank(
            categories.map((category) => category.rank)
          ).format(),
        }))
      ),
      this.adapter.ui.addCategory
    );

    this.adapter.hold(
      this.ui.archiveCategory$.pipe(
        map(({ $id }) => ({ $id: $id, archived: true })),
        tap(() =>
          this.alertService
            .open('List archived successfully', {
              status: TuiNotification.Success,
            })
            .subscribe()
        )
      ),
      this.adapter.ui.updateArchivedCategory
    );

    this.adapter.hold(
      this.ui.archiveCard$.pipe(
        map(({ $id }) => ({ $id: $id, archived: true })),
        tap(() =>
          this.alertService
            .open('Card archived successfully', {
              status: TuiNotification.Success,
            })
            .subscribe()
        )
      ),
      this.adapter.ui.updateArchivedCard
    );

    this.adapter.hold(
      this.ui.addCard$.pipe(
        withLatestFrom(this.groupedCards$),
        map(([event, groupedCards]) => {
          const cards = groupedCards[event.$categoryId];
          const last = getNextRank(cards.map(({ rank }) => rank)).format();
          return {
            name: event.name,
            $categoryId: event.$categoryId,
            rank: last,
          };
        })
      ),
      this.adapter.ui.addCard
    );
  }

  onCategoryDrop(
    event: CdkDragDrop<readonly Category[], readonly Category[], Category>
  ): void {
    if (event.previousIndex === event.currentIndex) return;
    const ranks = event.container.data.map(({ rank }) => rank);
    const updatedRank = moveRank(
      ranks,
      event.previousIndex,
      event.currentIndex
    );
    this.adapter.ui.updateCategoryPosition({
      $id: event.item.data.$id,
      rank: updatedRank.format(),
    });
  }

  private getUpdatedCardRank(
    event: CdkDragDrop<readonly Card[], readonly Card[], Card>,
    groupedCards: Record<string, readonly Card[]>
  ): { target: Card['$id']; newRank: string; categoryId?: string } | null {
    const categoryId = event.container.id.replace('list-', '');
    if (event.previousContainer === event.container) {
      if (event.previousIndex === event.currentIndex) {
        return null;
      }
      const ranks = groupedCards[categoryId].map(({ rank }) => rank);
      const updatedRank = moveRank(
        ranks,
        event.previousIndex,
        event.currentIndex
      );
      return { target: event.item.data.$id, newRank: updatedRank.format() };
    } else {
      const ranks = groupedCards[categoryId].map(({ rank }) => rank);
      const updatedRank = moveRank(ranks, 0, event.currentIndex);
      return {
        target: event.item.data.$id,
        newRank: updatedRank.format(),
        categoryId,
      };
    }
  }
}
