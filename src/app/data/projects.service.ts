import { Inject, Injectable } from '@angular/core';
import { APPWRITE } from '../providers/appwrite.provider';
import { Appwrite, Models } from 'appwrite';
import { realtimeListener } from '../shared/utils/realtime';
import { from, map, Observable } from 'rxjs';

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
  'name' | 'description' | 'visibility' | 'tags' | 'imageUrl'
>;

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  static collectionId = '6260423eee67978fa0da';

  constructor(
    @Inject(APPWRITE)
    private readonly appwrite: Appwrite
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

  createProject(project: AddProjectRequest): Observable<Project> {
    return from(
      this.appwrite.functions.createExecution(
        'create-project',
        JSON.stringify({
          ...project,
          $collectionId: ProjectsService.collectionId,
        }),
        false
      )
    ).pipe(map((x) => JSON.parse(x.stdout)));
  }

  deleteProject($id: Project['$id']): Observable<{}> {
    return from(
      this.appwrite.database.deleteDocument(ProjectsService.collectionId, $id)
    );
  }

  readonly changes$ = realtimeListener<Project>(
    this.appwrite,
    `collections.${ProjectsService.collectionId}.documents`
  );
}
