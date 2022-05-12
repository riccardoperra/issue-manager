import { RxState } from '@rx-angular/state';
import { WithInitializer } from '../rxa-custom/initializer';
import {
  AddProjectRequest,
  EditProjectRequest,
  Project,
  ProjectsService,
} from '../../data/projects.service';
import { Inject, Injectable } from '@angular/core';
import { finalize, map, merge, switchMap, tap } from 'rxjs';
import { patch } from '@rx-angular/cdk/transformations';
import { RxActionFactory } from '../rxa-custom/actions/actions.factory';
import { TuiAlertService } from '@taiga-ui/core';
import { AuthState } from '../auth/auth.state';

export interface ProjectsModel {
  readonly projects: readonly Project[];
  readonly loading: boolean;
}

export interface ProjectsActions {
  addProject: AddProjectRequest;
  addProjectSync: Project;
  deleteProject: Project;
  updateProject: { $id: Project['$id']; data: EditProjectRequest };
  updateProjectSync: { $id: Project['$id']; data: Project };
  removeProjectSync: string;
  fetchProjects: void;
  refetchTeams: void;
}

@Injectable({ providedIn: 'root' })
export class ProjectsState
  extends RxState<ProjectsModel>
  implements WithInitializer
{
  readonly actions = this.rxActions.create();

  readonly projects$ = this.select('projects');
  readonly loading$ = this.select('loading');

  private readonly sideEffects$ = merge(
    this.actions.addProject$.pipe(
      tap(() => this.set({ loading: true })),
      switchMap((request) =>
        this.projectsService
          .createProject(request)
          .pipe(finalize(() => this.set({ loading: false })))
      )
    ),
    this.actions.updateProject$.pipe(
      tap(() => this.set({ loading: true })),
      switchMap(({ $id, data }) =>
        this.projectsService
          .updateProject($id, data)
          .pipe(finalize(() => this.set({ loading: false })))
      )
    ),
    this.actions.deleteProject$.pipe(
      tap(() => this.set({ loading: true })),
      switchMap((project) =>
        this.projectsService
          .deleteProject(project)
          .pipe(finalize(() => this.set({ loading: false })))
      )
    ),
    this.actions.refetchTeams$.pipe(tap(() => this.authState.fetchTeams()))
  );

  constructor(
    @Inject(ProjectsService)
    private readonly projectsService: ProjectsService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(RxActionFactory)
    private readonly rxActions: RxActionFactory<ProjectsActions>,
    @Inject(AuthState)
    private readonly authState: AuthState
  ) {
    super();

    this.connect(
      'projects',
      this.actions.fetchProjects$.pipe(
        switchMap(() =>
          this.projectsService.getList().pipe(map((list) => list.documents))
        )
      )
    );

    this.connect('projects', this.actions.addProjectSync$, (state, project) => [
      ...state.projects,
      project,
    ]);

    this.connect(
      'projects',
      this.actions.removeProjectSync$,
      (state, projectId) =>
        state.projects.filter(({ $id }) => $id !== projectId)
    );

    this.connect(
      'projects',
      this.actions.updateProjectSync$,
      (state, { $id, data }) =>
        state.projects.map((project) =>
          project.$id === $id ? patch(project, data) : project
        )
    );

    this.hold(this.sideEffects$);
  }

  initialize(): void {
    const {
      removeProjectSync,
      addProjectSync,
      updateProjectSync,
      fetchProjects,
      refetchTeams,
    } = this.actions;

    fetchProjects();

    this.projectsService.changes$.subscribe((event) => {
      if (event.event === 'database.documents.create') {
        addProjectSync(event.payload);
      } else if (event.event === 'database.documents.delete') {
        removeProjectSync(event.payload.$id);
      } else if (event.event === 'database.documents.update') {
        updateProjectSync({ $id: event.payload.$id, data: event.payload });
      }
      refetchTeams();
    });
  }
}
