import { Appwrite, Models, Query } from 'appwrite';
import { Inject, Injectable } from '@angular/core';
import { APPWRITE } from '../providers/appwrite.provider';
import { from, Observable } from 'rxjs';

export interface Category extends Models.Document {
  readonly name: string;
  readonly projectId: string;
  rank: string;
}

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
}
