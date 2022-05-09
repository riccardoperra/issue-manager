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
        currentProject.bucketId,
        'unique()',
        file,
        undefined,
        undefined,
        (update) => onProgress?.(update)
      )
    );
  }

  getFileView(bucket: string, $id: string): URL {
    return this.appwrite.storage.getFileView(bucket, $id);
  }

  getPreview(bucket: string, $id: string): URL {
    return this.appwrite.storage.getFilePreview(bucket, $id);
  }

  getDownload(bucket: string, $id: string): URL {
    return this.appwrite.storage.getFileDownload(bucket, $id);
  }

  deleteFile(bucket: string, $id: string): Observable<{}> {
    return from(this.appwrite.storage.deleteFile(bucket, $id));
  }

  getAttachments(
    refs: { id: string; bucket: string }[]
  ): Observable<Models.FileList> {
    if (refs.length === 0) {
      return of({ total: 0, files: [] });
    }

    return forkJoin(
      refs.map(({ id, bucket }) =>
        from(this.appwrite.storage.getFile(bucket, id)).pipe(
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
