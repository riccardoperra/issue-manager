import { Inject, Injectable } from '@angular/core';
import { APPWRITE } from '../providers/appwrite.provider';
import { Appwrite, Models } from 'appwrite';
import { realtimeListener } from '../shared/utils/realtime';
import { from, Observable } from 'rxjs';

export interface Project extends Models.Document {
  readonly name: string;
  readonly description: string | null;
  readonly imageUrl: string | null;
  readonly public: boolean;
  readonly tags: string[];
}

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

  readonly changes$ = realtimeListener<Project>(
    this.appwrite,
    `collections.${ProjectsService.collectionId}.documents`
  );
}
