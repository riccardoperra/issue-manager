import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  TrackByFunction,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, tap, withLatestFrom } from 'rxjs';
import { Category } from '../../data/categories.service';
import { RxActionFactory } from '../../shared/rxa-custom/actions/actions.factory';
import { Card } from '../../data/cards.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { getNextRank, moveRank } from '../../shared/utils/ranking';
import { ProjectKanbanAdapter } from './project-kanban.adapter';
import { TuiAlertService, TuiDialogService, tuiSlideIn } from '@taiga-ui/core';
import { TuiNotification } from '@taiga-ui/core/enums/notification';
import { TuiScrollService } from '@taiga-ui/cdk';

interface LocalActions {
  moveCategory: CdkDragDrop<readonly Category[], readonly Category[], Category>;
  moveCard: CdkDragDrop<readonly Card[], readonly Card[], Card>;
  addCategory: { name: string; scrollRef: Element };
  archiveCategory: { $id: string };
}

@Component({
  selector: 'app-project-kanban',
  templateUrl: './project-kanban.component.html',
  styleUrls: ['./project-kanban.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxActionFactory, ProjectKanbanAdapter],
  animations: [tuiSlideIn],
})
export class ProjectKanbanComponent {
  readonly ui = new RxActionFactory<LocalActions>().create();
  readonly breadcrumb = [{ caption: 'Dashboard', routerLink: '/' }];
  readonly project$ = this.adapter.project$;
  readonly categories$ = this.adapter.sortedCategories$;
  readonly archivedCount$ = this.adapter
    .select('categories')
    .pipe(map((cat) => cat.filter(({ archived }) => archived).length));
  readonly groupedCards$ = this.adapter.cardsByCategory$;

  showArchived = false;

  readonly categoriesTrackBy: TrackByFunction<Category> = (index, category) =>
    `${category.$id}`;

  constructor(
    @Inject(ChangeDetectorRef)
    private readonly changeDetectorRef: ChangeDetectorRef,
    @Inject(ActivatedRoute)
    private readonly activatedRoute: ActivatedRoute,
    @Inject(ProjectKanbanAdapter)
    readonly adapter: ProjectKanbanAdapter,
    @Inject(RxActionFactory)
    private readonly rxActionFactory: RxActionFactory<LocalActions>,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(TuiScrollService)
    private readonly scrollService: TuiScrollService,
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
        map(({ $id }) => ({ $id: $id })),
        tap(() =>
          this.alertService
            .open('List archived successfully', {
              status: TuiNotification.Success,
            })
            .subscribe()
        )
      ),
      this.adapter.ui.archiveCategory
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

  getUpdatedCardRank(
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
      const updatedRank = moveRank(
        ranks,
        event.previousIndex,
        event.currentIndex
      );

      return {
        target: event.item.data.$id,
        newRank: updatedRank.format(),
        categoryId,
      };
    }
  }

  addNew(): void {
    // const state = this.get();
    // const card = state.cards.filter(
    //   (card) => card.categoryId === '62630d8529e4d20b3938'
    // );
    // let pos;
    // if (card.length === 0) {
    //   pos = LexoRank.middle();
    // } else {
    //   const lastPos = card[card.length - 1].rank;
    //   const rank = LexoRank.parse(lastPos as unknown as string);
    //   pos = rank.genNext();
    // }
    // this.cardsService
    //   .add(pos.format())
    //   .subscribe(() => this.actions.fetch('62605f3cd11dd686fa41'));
  }
}
