import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { RxState, selectSlice } from '@rx-angular/state';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { CategoriesService, Category } from '../../data/categories.service';
import { RxActionFactory } from '../../shared/rxa-custom/actions/actions.factory';
import { Card, CardsService } from '../../data/cards.service';
import { patch } from '@rx-angular/cdk/transformations';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

export interface ProjectKanbanActions {
  fetch: string;
}

export interface ProjectKanbanModel {
  projectId: string;
  loading: boolean;
  categories: readonly Category[];
  cards: readonly Card[];
}

@Component({
  selector: 'app-project-kanban',
  templateUrl: './project-kanban.component.html',
  styleUrls: ['./project-kanban.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxActionFactory],
})
export class ProjectKanbanComponent
  extends RxState<ProjectKanbanModel>
  implements OnInit
{
  readonly actions = this.rxAction.create();
  readonly projectId$ = this.select('projectId');
  readonly categories$ = this.select('categories');
  readonly cards$ = this.select('cards');

  readonly categoriesTrackBy: TrackByFunction<Category> = (index, category) =>
    `${category.$id}_${index}`;

  readonly cardTrackBy: TrackByFunction<Card> = (index, card) =>
    `${card.$id}_${index}`;

  constructor(
    @Inject(ActivatedRoute)
    private readonly activatedRoute: ActivatedRoute,
    @Inject(RxActionFactory)
    private readonly rxAction: RxActionFactory<ProjectKanbanActions>,
    @Inject(CategoriesService)
    private readonly categoriesService: CategoriesService,
    @Inject(CardsService)
    private readonly cardsService: CardsService
  ) {
    super();

    this.connect(
      'projectId',
      this.activatedRoute.paramMap.pipe(map((param) => param.get('projectId')!))
    );

    this.connect(
      this.actions.fetch$.pipe(
        switchMap((projectId) =>
          forkJoin([
            this.categoriesService
              .getByProjectId(projectId)
              .pipe(map((content) => content.documents)),
            this.cardsService
              .getByProjectId(projectId)
              .pipe(map((content) => content.documents)),
          ])
        )
      ),
      (state, [categories, cards]) => patch(state, { categories, cards })
    );

    this.hold(this.projectId$, this.actions.fetch);
  }

  readonly groupedCardsByCategory$: Observable<
    readonly (Category & { cards: readonly Card[] })[]
  > = this.select(
    selectSlice(['cards', 'categories']),
    map(({ cards, categories }) => {
      return categories.map((category) => ({
        ...category,
        cards: cards.filter((card) => card.categoryId === category.$id),
      }));
    })
  );

  ngOnInit(): void {}
}
