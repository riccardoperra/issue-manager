import { RxState, selectSlice } from '@rx-angular/state';
import { ProjectKanbanPageModel } from './project-kanban.model';
import { Inject, Injectable } from '@angular/core';
import { RxActionFactory } from '../../shared/rxa-custom/actions/actions.factory';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { CategoriesService, Category } from '../../data/categories.service';
import { ActivatedRoute } from '@angular/router';
import {
  distinctUntilChanged,
  exhaustMap,
  filter,
  forkJoin,
  map,
  merge,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { Project, ProjectsService } from '../../data/projects.service';
import { Card, CardsService } from '../../data/cards.service';
import { patch } from '@rx-angular/cdk/transformations';
import { sortArrayByRankProperty } from '../../shared/utils/ranking';

interface Actions {
  fetch: { $projectId: string };
  fetchCategories: { $projectId: string };
  fetchCards: { $projectId: string };
  moveCategory: CdkDragDrop<readonly Category[], Category, Category>;
  updateCategoryPosition: { $id: string; rank: string };
  updateCardPosition: { $id: string; rank: string };
  updateCardCategory: { $id: string; rank: string; categoryId: string };
}

@Injectable()
export class ProjectKanbanAdapter extends RxState<ProjectKanbanPageModel> {
  readonly ui = this.rxActions.create();

  private readonly categories$ = this.select('categories');

  readonly project$ = this.select('project');

  readonly sortedCategories$ = this.categories$.pipe(
    map((categories) => sortArrayByRankProperty(categories, 'rank')),
    tap((x) => console.log('category change'))
  );

  readonly cardsByCategory$ = this.select(
    selectSlice(['cards']),
    withLatestFrom(this.categories$),
    map(([{ cards }, categories]) => {
      const initialValue = categories.reduce(
        (acc, category) => ({
          ...acc,
          [category.$id]: [],
        }),
        {}
      );
      return sortArrayByRankProperty(cards, 'rank').reduce<
        Record<string, readonly Card[]>
      >((acc, card) => {
        acc[card.categoryId] = (acc[card.categoryId] ?? []).concat(card);
        return acc;
      }, initialValue);
    })
  );

  private readonly routeProjectId$ = this.activatedRoute.paramMap.pipe(
    map((param) => param.get('projectId')),
    filter((id): id is NonNullable<string> => !!id),
    distinctUntilChanged()
  );

  private readonly sideEffects$ = merge(
    this.ui.updateCategoryPosition$.pipe(
      switchMap(({ $id, rank }) =>
        this.categoriesService.updatePosition($id, rank)
      )
    ),
    this.ui.updateCardPosition$.pipe(
      switchMap(({ $id, rank }) => this.cardsService.updatePosition($id, rank))
    ),
    this.ui.updateCardCategory$.pipe(
      switchMap(({ $id, categoryId, rank }) =>
        this.cardsService.updateCategory($id, categoryId, rank)
      )
    )
  );

  constructor(
    @Inject(RxActionFactory)
    private readonly rxActions: RxActionFactory<Actions>,
    @Inject(ActivatedRoute)
    private readonly activatedRoute: ActivatedRoute,
    @Inject(ProjectsService)
    private readonly projectsService: ProjectsService,
    @Inject(CategoriesService)
    private readonly categoriesService: CategoriesService,
    @Inject(CardsService)
    private readonly cardsService: CardsService
  ) {
    super();

    this.connect('projectId', this.routeProjectId$);

    this.connect(
      this.ui.fetch$.pipe(
        switchMap(({ $projectId }) => this.loadResources($projectId))
      ),
      (state, resources) => patch(state, resources)
    );

    this.hold(this.routeProjectId$, (id) => this.ui.fetch({ $projectId: id }));

    this.hold(this.sideEffects$);

    this.connect(
      'categories',
      this.ui.updateCategoryPosition$,
      (state, { $id, rank }) =>
        state.categories.map((category) =>
          category.$id === $id ? patch(category, { rank }) : category
        )
    );

    this.connect('cards', this.ui.updateCardPosition$, (state, { $id, rank }) =>
      state.cards.map((card) =>
        card.$id === $id ? patch(card, { rank }) : card
      )
    );

    this.connect(
      'cards',
      this.ui.updateCardCategory$,
      (state, { $id, rank, categoryId }) =>
        state.cards.map((card) =>
          card.$id === $id ? patch(card, { rank, categoryId }) : card
        )
    );

    this.initRealtime();
  }

  initRealtime(): void {
    this.hold(
      this.cardsService.changes$.pipe(
        tap((event) => {
          if (event.event === 'database.documents.create') {
            this.connect('cards', of(event), (state, event) => {
              return state.cards.concat(event.payload);
            });
          } else if (event.event === 'database.documents.delete') {
            this.connect('cards', of(event), (state, event) => {
              return state.cards.filter(
                (card) => card.$id !== event.payload.$id
              );
            });
          } else if (event.event === 'database.documents.update') {
            this.connect('cards', of(event), (state, event) => {
              return state.cards.map((card) =>
                card.$id === event.payload.$id ? event.payload : card
              );
            });
          }
        })
      )
    );

    this.hold(
      this.categoriesService.changes$.pipe(
        tap((event) => {
          if (event.event === 'database.documents.create') {
            this.connect('categories', of(event), (state, event) => {
              return state.categories.concat(event.payload);
            });
          } else if (event.event === 'database.documents.delete') {
            this.connect('categories', of(event), (state, event) => {
              return state.categories.filter(
                (card) => card.$id !== event.payload.$id
              );
            });
          } else if (event.event === 'database.documents.update') {
            this.connect('categories', of(event), (state, event) => {
              return state.categories.map((card) =>
                card.$id === event.payload.$id ? event.payload : card
              );
            });
          }
        })
      )
    );
  }

  private readonly loadResources = (projectId: string) =>
    this.projectsService.getById(projectId).pipe(
      exhaustMap((project) =>
        this.loadCategoriesAndCards(project).pipe(
          map(({ categories, cards }) => ({
            categories,
            cards,
            project,
          }))
        )
      )
    );

  private readonly loadCategoriesAndCards = (project: Project) =>
    forkJoin([
      this.categoriesService
        .getByProjectId(project.$id)
        .pipe(map((content) => content.documents)),
      this.cardsService
        .getByProjectId(project.$id)
        .pipe(map((content) => content.documents)),
    ]).pipe(map(([categories, cards]) => ({ categories, cards })));
}
