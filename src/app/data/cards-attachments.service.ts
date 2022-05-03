import { Appwrite, Models, Query } from 'appwrite';
import { Inject, Injectable } from '@angular/core';
import { APPWRITE } from '../providers/appwrite.provider';
import { from, Observable } from 'rxjs';
import { realtimeListener } from '../shared/utils/realtime';
import { Card } from './cards.service';

export interface CardAttachment extends Models.Document {
  readonly cardId: string;
  readonly projectId: string;
  readonly ref: string;
}

export type AddCardAttachment = Omit<CardAttachment, keyof Models.Document>;

@Injectable({ providedIn: 'root' })
export class CardAttachmentsService {
  static collectionId = '62716cf0c3363422b66a';

  constructor(
    @Inject(APPWRITE)
    private readonly appwrite: Appwrite
  ) {}

  addAttachment(card: Card, ref: Models.File): Observable<CardAttachment> {
    return from(
      this.appwrite.database.createDocument<CardAttachment>(
        CardAttachmentsService.collectionId,
        ref.$id,
        {
          ref: ref.$id,
          cardId: card.$id,
          projectId: card.projectId,
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
