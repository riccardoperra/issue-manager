import { Appwrite, Models, Query } from 'appwrite';
import { Inject, Injectable } from '@angular/core';
import { APPWRITE } from '../providers/appwrite.provider';
import { from, Observable } from 'rxjs';
import { realtimeListener } from '../shared/utils/realtime';
import { Card } from './cards.service';
import { Project } from './projects.service';

export interface Category extends Models.Document {
  readonly name: string;
  readonly projectId: string;
  readonly archived: boolean;
  readonly rank: string;
}

export type AddCategory = Pick<Category, 'name' | 'rank'>;

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  static collectionId = '62604a098cb45c928e5b';

  constructor(
    @Inject(APPWRITE)
    private readonly appwrite: Appwrite
  ) {}

  getByProjectId(projectId: string): Observable<Models.DocumentList<Category>> {
    return from(
      this.appwrite.database.listDocuments<Category>(
        CategoriesService.collectionId,
        [Query.equal('projectId', projectId)]
      )
    );
  }

  updatePosition($id: Category['$id'], rank: string): Observable<Category> {
    return from(
      this.appwrite.database.updateDocument<Category>(
        CategoriesService.collectionId,
        $id,
        {
          rank: rank,
        } as Pick<Category, 'rank'>
      )
    );
  }

  addCategory(project: Project, request: AddCategory): Observable<Category> {
    return from(
      this.appwrite.database.createDocument<Category>(
        CategoriesService.collectionId,
        'unique()',
        { ...request, projectId: project.$id, archived: false },
        project.$read,
        project.$write
      )
    );
  }

  archiveCategory(
    $id: Category['$id'],
    archived: boolean
  ): Observable<Category> {
    return from(
      this.appwrite.database.updateDocument<Category>(
        CategoriesService.collectionId,
        $id,
        { archived } as Pick<Category, 'archived'>
      )
    );
  }

  readonly changes$ = realtimeListener<Category>(
    this.appwrite,
    `collections.${CategoriesService.collectionId}.documents`
  );
}
