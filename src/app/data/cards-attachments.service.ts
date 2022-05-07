import { Appwrite, Models, Query } from 'appwrite';
import { Inject, Injectable } from '@angular/core';
import { APPWRITE } from '../providers/appwrite.provider';
import { from, Observable } from 'rxjs';
import { realtimeListener } from '../shared/utils/realtime';
import { Card } from './cards.service';
import { Project } from './projects.service';

export interface CardAttachment extends Models.Document {
  readonly projectId: string;
  readonly ref: string;
  readonly bucketId: string;
}

export type AddCardAttachment = Omit<CardAttachment, keyof Models.Document>;

@Injectable({ providedIn: 'root' })
export class CardAttachmentsService {
  static collectionId = '62762b0405e1a79b02fb';

  constructor(
    @Inject(APPWRITE)
    private readonly appwrite: Appwrite
  ) {}

  addAttachment(
    project: Project,
    card: Card,
    ref: Models.File
  ): Observable<CardAttachment> {
    return from(
      this.appwrite.database.createDocument<CardAttachment>(
        CardAttachmentsService.collectionId,
        ref.$id,
        {
          ref: ref.$id,
          cardId: card.$id,
          projectId: card.projectId,
          bucketId: project.bucketId,
        } as AddCardAttachment,
        ref.$read,
        ref.$write
      )
    );
  }

  deleteAttachment($id: string): Observable<{}> {
    return from(
      this.appwrite.database.deleteDocument(
        CardAttachmentsService.collectionId,
        $id
      )
    );
  }

  getAttachments(
    $cardId: string
  ): Observable<Models.DocumentList<CardAttachment>> {
    return from(
      this.appwrite.database.listDocuments<CardAttachment>(
        CardAttachmentsService.collectionId,
        [Query.equal('cardId', $cardId)]
      )
    );
  }
}
