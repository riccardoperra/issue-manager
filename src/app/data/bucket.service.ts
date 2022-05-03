import { Inject, Injectable } from '@angular/core';
import { APPWRITE } from '../providers/appwrite.provider';
import { Appwrite, Models, Query } from 'appwrite';
import {
  catchError,
  forkJoin,
  from,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { Card, CardsService } from './cards.service';
import { Project } from './projects.service';

@Injectable({ providedIn: 'root' })
export class BucketService {
  constructor(
    @Inject(APPWRITE)
    private readonly appwrite: Appwrite,
    @Inject(CardsService)
    private readonly cardsService: CardsService
  ) {}

  addAttachment(
    currentProject: Project,
    file: File,
    onProgress?: Parameters<Appwrite['storage']['createFile']>[5]
  ): Observable<Models.File> {
    return from(
      this.appwrite.storage.createFile(
        'public',
        'unique()',
        file,
        currentProject.$read,
        currentProject.$write,
        (update) => onProgress?.(update)
      )
    );
  }

  getFileView($id: string): URL {
    return this.appwrite.storage.getFileView('public', $id);
  }

  getPreview($id: string): URL {
    return this.appwrite.storage.getFilePreview('public', $id);
  }

  getDownload($id: string): URL {
    return this.appwrite.storage.getFileDownload('public', $id);
  }

  deleteFile($id: string): Observable<{}> {
    return from(this.appwrite.storage.deleteFile('public', $id));
  }

  getAttachments($ids: string[]): Observable<Models.FileList> {
    if ($ids.length === 0) {
      return of({ total: 0, files: [] });
    }

    return forkJoin(
      $ids.map((id) =>
        from(this.appwrite.storage.getFile('public', id)).pipe(
          catchError(() => of(null))
        )
      )
    ).pipe(
      map((files) => files.filter((file) => !!file) as Models.File[]),
      map((files: Models.File[]) => {
        return {
          total: files.length,
          files: files,
        } as Models.FileList;
      })
    );
  }

  // getAttachment(projectId: string): Observable<Models.DocumentList<Card>> {
  //   return from(
  //     this.appwrite.database.listDocuments<Card>(CardsService.collectionId, [
  //       Query.equal('projectId', projectId),
  //     ])
  //   );
  // }
}
