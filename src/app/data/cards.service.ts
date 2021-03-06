import { Appwrite, Models, Query } from 'appwrite';
import { Inject, Injectable } from '@angular/core';
import { APPWRITE } from '../providers/appwrite.provider';
import { from, Observable } from 'rxjs';
import { realtimeListener } from '../shared/utils/realtime';
import { Project } from './projects.service';

export interface Card extends Models.Document {
  readonly name: string;
  readonly content: string;
  readonly projectId: string; // projectId;
  readonly tags: string[];
  readonly archived: boolean;
  readonly categoryId: string;
  readonly rank: string;
  readonly expiryDate?: string;
  readonly priority?: string;
  readonly attachments?: string[];
}

export type AddCard = Omit<
  Card,
  keyof Models.Document | 'tags' | 'archived' | 'content' | 'projectId'
>;

@Injectable({ providedIn: 'root' })
export class CardsService {
  static collectionId = '626044d20dbc091c2598';

  constructor(
    @Inject(APPWRITE)
    private readonly appwrite: Appwrite
  ) {}

  getByProjectId(projectId: string): Observable<Models.DocumentList<Card>> {
    return from(
      this.appwrite.database.listDocuments<Card>(CardsService.collectionId, [
        Query.equal('projectId', projectId),
      ])
    );
  }

  getById($id: string): Observable<Card> {
    return from(
      this.appwrite.database.getDocument<Card>(CardsService.collectionId, $id)
    );
  }

  addCard(project: Project, card: AddCard): Observable<Card> {
    return from(
      this.appwrite.database.createDocument<Card>(
        CardsService.collectionId,
        'unique()',
        { ...card, projectId: project.$id } as Card,
        project.$read,
        project.$write
      )
    );
  }

  deleteCard($id: Card['$id']): Observable<{}> {
    return from(
      this.appwrite.database.deleteDocument(CardsService.collectionId, $id)
    );
  }

  updateCardRank($id: Card['$id'], updatedRank: string): Observable<Card> {
    return from(
      this.appwrite.database.updateDocument<Card>(
        CardsService.collectionId,
        $id,
        { rank: updatedRank } as Pick<Card, 'rank'>
      )
    );
  }

  updateTitle($id: Card['$id'], title: string): Observable<Card> {
    return from(
      this.appwrite.database.updateDocument<Card>(
        CardsService.collectionId,
        $id,
        {
          name: title,
        } as Pick<Card, 'name'>
      )
    );
  }

  updatePriority(
    $id: Card['$id'],
    priority: Card['priority']
  ): Observable<Card> {
    return from(
      this.appwrite.database.updateDocument<Card>(
        CardsService.collectionId,
        $id,
        {
          priority,
        } as Pick<Card, 'priority'>
      )
    );
  }

  updateExpiryDate(
    $id: Card['$id'],
    expiryDate: Card['expiryDate']
  ): Observable<Card> {
    return from(
      this.appwrite.database.updateDocument<Card>(
        CardsService.collectionId,
        $id,
        {
          expiryDate,
        } as Pick<Card, 'expiryDate'>
      )
    );
  }

  updateContent($id: Card['$id'], content: string): Observable<Card> {
    return from(
      this.appwrite.database.updateDocument<Card>(
        CardsService.collectionId,
        $id,
        {
          content,
        } as Pick<Card, 'content'>
      )
    );
  }

  updateArchived($id: Card['$id'], archived: boolean): Observable<Card> {
    return from(
      this.appwrite.database.updateDocument<Card>(
        CardsService.collectionId,
        $id,
        {
          archived,
        } as Pick<Card, 'archived'>
      )
    );
  }

  updateCategory(
    $id: Card['$id'],
    categoryId: string,
    rank: string
  ): Observable<Card> {
    return from(
      this.appwrite.database.updateDocument<Card>(
        CardsService.collectionId,
        $id,
        {
          rank,
          categoryId,
        } as Pick<Card, 'rank' | 'categoryId'>
      )
    );
  }

  updatePosition($id: Card['$id'], rank: string): Observable<Card> {
    return from(
      this.appwrite.database.updateDocument<Card>(
        CardsService.collectionId,
        $id,
        {
          rank: rank,
        } as Pick<Card, 'rank'>
      )
    );
  }

  readonly changes$ = realtimeListener<Card>(
    this.appwrite,
    `collections.${CardsService.collectionId}.documents`
  );

  readonly observeCardChanges = ($id: string) =>
    realtimeListener<Card>(
      this.appwrite,
      `collections.${CardsService.collectionId}.documents.${$id}`
    );
}
