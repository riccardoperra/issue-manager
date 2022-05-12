import { Inject, Injectable } from '@angular/core';
import { APPWRITE } from '../providers/appwrite.provider';
import { Appwrite, Models } from 'appwrite';
import { realtimeListener } from '../shared/utils/realtime';
import { delay, from, map, Observable, tap } from 'rxjs';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { EditProjectDialogComponent } from '../features/dashboard/edit-project-dialog/edit-project-dialog.component';

export const enum ProjectVisibility {
  'public' = 'public',
  'private' = 'private',
  'notVisible' = 'notListed',
}

export interface Project extends Models.Document {
  readonly name: string;
  readonly description: string | null;
  readonly imageUrl: string | null;
  readonly tags: string[];
  readonly visibility: ProjectVisibility;
  readonly bucketId: string;
}

export type AddProjectRequest = Pick<
  Project,
  'name' | 'description' | 'visibility' | 'tags'
>;

export type EditProjectRequest = Pick<Project, 'name' | 'description' | 'tags'>;

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  static collectionId = '6260423eee67978fa0da';

  constructor(
    @Inject(APPWRITE)
    private readonly appwrite: Appwrite,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {}

  getList(): Observable<Models.DocumentList<Project>> {
    return from(
      this.appwrite.database.listDocuments<Project>(
        ProjectsService.collectionId
      )
    );
  }

  getById($id: Project['$id']): Observable<Project> {
    return from(
      this.appwrite.database.getDocument<Project>(
        ProjectsService.collectionId,
        $id
      )
    );
  }

  updateProject($id: string, project: EditProjectRequest): Observable<Project> {
    return from(
      this.appwrite.database.updateDocument<Project>(
        ProjectsService.collectionId,
        $id,
        project
      )
    );
  }

  createProject(project: AddProjectRequest): Observable<unknown> {
    return from(
      this.appwrite.functions.createExecution(
        'create-project',
        JSON.stringify({
          ...project,
          $collectionId: ProjectsService.collectionId,
        })
      )
    ).pipe(
      tap(() =>
        this.alertService
          .open(`Initializing "${project.name}" project...`, {
            status: TuiNotification.Info,
            hasIcon: true,
            hasCloseButton: false,
          })
          .subscribe()
      )
    );
  }

  deleteProject(project: Project): Observable<unknown> {
    return from(
      this.appwrite.functions.createExecution(
        'delete-project',
        JSON.stringify(project)
      )
    ).pipe(
      tap(() =>
        this.alertService
          .open(`Closing project...`, {
            status: TuiNotification.Info,
            hasIcon: true,
            hasCloseButton: false,
          })
          .subscribe()
      )
    );
  }

  readonly changes$ = realtimeListener<Project>(
    this.appwrite,
    `collections.${ProjectsService.collectionId}.documents`
  );
}
