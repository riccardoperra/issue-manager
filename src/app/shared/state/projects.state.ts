import { RxState } from '@rx-angular/state';
import { WithInitializer } from '../rxa-custom/initializer';
import { Project, ProjectsService } from '../../data/projects.service';
import { Injectable } from '@angular/core';
import { map, startWith, Subject, switchMap } from 'rxjs';
import { patch } from '@rx-angular/cdk/transformations';

export interface ProjectsModel {
  readonly projects: readonly Project[];
}

@Injectable({ providedIn: 'root' })
export class ProjectsState
  extends RxState<ProjectsModel>
  implements WithInitializer
{
  readonly projects$ = this.select(map((state) => state.projects)).pipe(
    startWith(null)
  );

  readonly addProject$ = new Subject<Project>();
  readonly updateProject$ = new Subject<{
    $id: Project['$id'];
    data: Project;
  }>();

  readonly removeProject$ = new Subject<string>();
  readonly fetchProjects$ = new Subject<void>();

  fetchProjects(): void {
    this.fetchProjects$.next();
  }

  addProject(project: Project): void {
    this.addProject$.next(project);
  }

  updateProject(data: { $id: Project['$id']; data: Project }): void {
    this.updateProject$.next(data);
  }

  removeProject($id: Project['$id']): void {
    this.removeProject$.next($id);
  }

  constructor(private readonly projectsService: ProjectsService) {
    super();

    this.connect(
      'projects',
      this.fetchProjects$.pipe(
        switchMap(() =>
          this.projectsService.getList().pipe(map((list) => list.documents))
        )
      )
    );

    this.connect('projects', this.addProject$, (state, project) => [
      ...state.projects,
      project,
    ]);

    this.connect('projects', this.removeProject$, (state, projectId) =>
      state.projects.filter(({ $id }) => $id !== projectId)
    );

    this.connect('projects', this.updateProject$, (state, { $id, data }) =>
      state.projects.map((project) =>
        project.$id === $id ? patch(project, data) : project
      )
    );
  }

  initialize(): void {
    this.fetchProjects();

    this.projectsService.changes$.subscribe((event) => {
      if (event.event === 'database.documents.create') {
        this.addProject(event.payload);
      } else if (event.event === 'database.documents.delete') {
        this.removeProject(event.payload.$id);
      } else if (event.event === 'database.documents.update') {
        this.updateProject({ $id: event.payload.$id, data: event.payload });
      }
    });
  }
}
