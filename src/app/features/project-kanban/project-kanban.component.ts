import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, tap, withLatestFrom } from 'rxjs';
import { Category } from '../../data/categories.service';
import { RxActionFactory } from '../../shared/rxa-custom/actions/actions.factory';
import { Card } from '../../data/cards.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { moveRank } from '../../shared/utils/ranking';
import { ProjectKanbanAdapter } from './project-kanban.adapter';

interface LocalActions {
  moveCategory: CdkDragDrop<readonly Category[], readonly Category[], Category>;
  moveCard: CdkDragDrop<readonly Card[], readonly Card[], Card>;
}

@Component({
  selector: 'app-project-kanban',
  templateUrl: './project-kanban.component.html',
  styleUrls: ['./project-kanban.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxActionFactory, ProjectKanbanAdapter],
})
export class ProjectKanbanComponent implements OnInit {
  readonly ui = this.rxActionFactory.create();
  readonly breadcrumb = [{ caption: 'Dashboard', routerLink: '/' }];
  readonly project$ = this.adapter.project$;
  readonly categories$ = this.adapter.sortedCategories$;
  readonly groupedCards$ = this.adapter.cardsByCategory$;

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
    private readonly rxActionFactory: RxActionFactory<LocalActions>
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
      const updatedRank = moveRank(ranks, -1, event.currentIndex);

      return {
        target: event.item.data.$id,
        newRank: updatedRank.format(),
        categoryId,
      };
    }
  }

  ngOnInit(): void {}

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
