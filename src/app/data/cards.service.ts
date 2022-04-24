import { Appwrite, Models, Query } from 'appwrite';
import { Inject, Injectable } from '@angular/core';
import { APPWRITE } from '../providers/appwrite.provider';
import { from, Observable } from 'rxjs';

export interface Card extends Models.Document {
  readonly name: string;
  readonly content: string;
  readonly boardId: string; // projectId;
  readonly tags: string[];
  readonly archived: boolean;
  readonly categoryId: string;
  readonly rank: string;
}

export type AddCard = Omit<
  Card,
  keyof Models.Document | 'tags' | 'archived' | 'content'
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

  addCard(card: AddCard): Observable<Card> {
    return from(
      this.appwrite.database.createDocument<Card>(
        CardsService.collectionId,
        'unique()',
        card
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
}
