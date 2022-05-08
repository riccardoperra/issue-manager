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
  Observable,
  of,
  pluck,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { Project, ProjectsService } from '../../data/projects.service';
import { Card, CardsService } from '../../data/cards.service';
import { patch } from '@rx-angular/cdk/transformations';
import { sortArrayByRankProperty } from '../../shared/utils/ranking';
import { TeamsService } from '../../data/team.service';
import { ProjectsState } from '../../shared/state/projects.state';

interface Actions {
  fetch: { $projectId: string };
  fetchCategories: { $projectId: string };
  fetchCards: { $projectId: string };
  moveCategory: CdkDragDrop<readonly Category[], Category, Category>;
  updateCategoryPosition: { $id: string; rank: string };
  updateCardPosition: { $id: string; rank: string };
  updateCardCategory: { $id: string; rank: string; categoryId: string };
  addCategory: { name: string; rank: string; $projectId: string };
  updateArchivedCategory: { $id: string; archived: boolean };
  updateArchivedCard: { $id: string; archived: boolean };
  addCard: { name: string; rank: string; $categoryId: string };
  addMember: string;
  removeMember: string;
}

@Injectable()
export class ProjectKanbanAdapter extends RxState<ProjectKanbanPageModel> {
  readonly ui = this.rxActions.create();

  private readonly categories$ = this.select('categories');

  readonly project$ = this.select('project');
  readonly members$ = this.select('workspace', 'members');

  readonly sortedCategories$: Observable<readonly Category[]> =
    this.categories$.pipe(
      map((categories) => categories.filter((category) => !category.archived)),
      map((categories) => sortArrayByRankProperty(categories, 'rank'))
    );

  readonly cardsByCategory$ = this.select(
    selectSlice(['cards', 'categories']),
    map(({ cards, categories }) => {
      const initialValue = categories.reduce(
        (acc, category) =>
          !category.archived
            ? {
                ...acc,
                [category.$id]: [],
              }
            : acc,
        {}
      );
      return sortArrayByRankProperty(cards, 'rank').reduce<
        Record<string, readonly Card[]>
      >((acc, card) => {
        if (!acc[card.categoryId]) return acc;
        acc[card.categoryId] = acc[card.categoryId].concat(card);
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
    ),
    this.ui.addCategory$.pipe(
      switchMap(({ $projectId, rank, name }) =>
        this.categoriesService.addCategory({
          projectId: $projectId,
          rank,
          name,
        })
      )
    ),
    this.ui.updateArchivedCategory$.pipe(
      switchMap(({ $id, archived }) =>
        this.categoriesService.archiveCategory($id, archived)
      )
    ),
    this.ui.updateArchivedCard$.pipe(
      switchMap(({ $id, archived }) =>
        this.cardsService.updateArchived($id, archived)
      )
    ),
    this.ui.addCard$.pipe(
      withLatestFrom(this.project$.pipe(pluck('$id'))),
      switchMap(([{ name, rank, $categoryId }, $projectId]) =>
        this.cardsService.addCard({
          name,
          rank,
          categoryId: $categoryId,
          projectId: $projectId,
        })
      )
    ),
    this.ui.addMember$.pipe(
      withLatestFrom(this.project$.pipe(pluck('$id'))),
      switchMap(([email, $projectId]) =>
        this.teamsService.addMembership($projectId, email).pipe(
          tap((membership) => {
            return this.set('workspace', (state) =>
              patch(state.workspace, {
                members: [...state.workspace.members, membership],
              })
            );
          })
        )
      )
    ),
    this.ui.removeMember$.pipe(
      withLatestFrom(this.project$.pipe(pluck('$id'))),
      switchMap(([$id, $projectId]) =>
        this.teamsService.removeMembership($projectId, $id).pipe(
          tap((membership) =>
            this.set('workspace', (state) =>
              patch(state.workspace, {
                members: state.workspace.members.filter((m) => m.$id !== $id),
              })
            )
          )
        )
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
    private readonly cardsService: CardsService,
    @Inject(TeamsService)
    private readonly teamsService: TeamsService,
    @Inject(ProjectsState)
    private readonly projectsState: ProjectsState
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

    this.connect(
      'categories',
      this.ui.updateArchivedCategory$,
      (state, { $id, archived }) =>
        state.categories.map((category) =>
          category.$id === $id ? patch(category, { archived }) : category
        )
    );

    this.connect('cards', this.ui.updateCardPosition$, (state, { $id, rank }) =>
      state.cards.map((card) =>
        card.$id === $id ? patch(card, { rank }) : card
      )
    );

    this.connect(
      'cards',
      this.ui.updateArchivedCard$,
      (state, { $id, archived }) =>
        state.cards.map((card) =>
          card.$id === $id ? patch(card, { archived }) : card
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
        forkJoin([
          this.teamsService.getTeamDetail(projectId),
          this.loadCategoriesAndCards(project),
        ]).pipe(
          map(([workspace, { categories, cards }]) => ({
            categories,
            cards,
            project,
            workspace,
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
