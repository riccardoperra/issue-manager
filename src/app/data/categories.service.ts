import { Appwrite, Models, Query } from 'appwrite';
import { Inject, Injectable } from '@angular/core';
import { APPWRITE } from '../providers/appwrite.provider';
import { from, Observable } from 'rxjs';
import { realtimeListener } from '../shared/utils/realtime';
import { Card } from './cards.service';

export interface Category extends Models.Document {
  readonly name: string;
  readonly projectId: string;
  readonly archived: boolean;
  readonly rank: string;
}

export type AddCategory = Pick<Category, 'name' | 'rank' | 'projectId'>;

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

  addCategory(request: AddCategory): Observable<Category> {
    return from(
      this.appwrite.database.createDocument<Category>(
        CategoriesService.collectionId,
        'unique()',
        request
      )
    );
  }

  archiveCategory($id: Category['$id']): Observable<Category> {
    return from(
      this.appwrite.database.updateDocument<Category>(
        CategoriesService.collectionId,
        $id,
        { archived: true } as Pick<Category, 'archived'>
      )
    );
  }

  readonly changes$ = realtimeListener<Category>(
    this.appwrite,
    `collections.${CategoriesService.collectionId}.documents`
  );
}
