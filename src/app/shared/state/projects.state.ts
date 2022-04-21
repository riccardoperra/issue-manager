import { RxState } from '@rx-angular/state';
import { WithInitializer } from '../rxa-custom/initializer';
import {
  AddProjectRequest,
  Project,
  ProjectsService,
} from '../../data/projects.service';
import { Inject, Injectable } from '@angular/core';
import { map, merge, startWith, switchMap, tap } from 'rxjs';
import { patch } from '@rx-angular/cdk/transformations';
import { RxActionFactory } from '../rxa-custom/actions/actions.factory';
import { TuiAlertService } from '@taiga-ui/core';

export interface ProjectsModel {
  readonly projects: readonly Project[];
}

export interface ProjectsActions {
  addProject: AddProjectRequest;
  addProjectSync: Project;
  updateProjectSync: { $id: Project['$id']; data: Project };
  removeProjectSync: string;
  fetchProjects: void;
}

@Injectable({ providedIn: 'root' })
export class ProjectsState
  extends RxState<ProjectsModel>
  implements WithInitializer
{
  readonly actions = this.rxActions.create();

  readonly projects$ = this.select(map((state) => state.projects)).pipe(
    startWith(null)
  );

  private readonly sideEffects$ = merge(
    this.actions.addProject$.pipe(
      switchMap((request) => this.projectsService.createProject(request))
    )
  );

  constructor(
    private readonly projectsService: ProjectsService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    @Inject(RxActionFactory)
    private readonly rxActions: RxActionFactory<ProjectsActions>
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
    });
  }
}
