import { RxState } from '@rx-angular/state';
import { Card, CardsService } from '../../../data/cards.service';
import { Inject, Injectable } from '@angular/core';
import { RxActionFactory } from '../../../shared/rxa-custom/actions/actions.factory';
import { concat, debounceTime, of, switchMap, withLatestFrom } from 'rxjs';
import { patch } from '@rx-angular/cdk/transformations';

interface KanbanCardEditorState {
  card: Card;
}

interface Actions {
  fetch: { $id: string };
  editTitle: string;
  updateContent: string;
  updateArchived: boolean;
}

@Injectable()
export class KanbanCardEditorAdapter extends RxState<KanbanCardEditorState> {
  readonly actions = this.rxActionFactory.create();

  private readonly updateTitleEvent$ = this.actions.editTitle$.pipe(
    withLatestFrom(this.select('card'))
  );

  private readonly updateContentEvent$ = this.actions.updateContent$.pipe(
    withLatestFrom(this.select('card'))
  );

  private readonly updateArchivedEvent$ = this.actions.updateArchived$.pipe(
    withLatestFrom(this.select('card'))
  );

  constructor(
    @Inject(CardsService)
    private readonly cardsService: CardsService,
    @Inject(RxActionFactory)
    private readonly rxActionFactory: RxActionFactory<Actions>
  ) {
    super();

    this.connect(
      'card',
      this.actions.fetch$.pipe(
        switchMap(({ $id }) => this.cardsService.getById($id))
      )
    );

    this.connect(
      'card',
      this.updateTitleEvent$.pipe(
        switchMap(([title, card]) =>
          concat(
            of(patch(card, { name: title })),
            this.cardsService.updateTitle(card.$id, title)
          )
        )
      )
    );

    this.connect(
      'card',
      this.updateContentEvent$.pipe(
        debounceTime(1000),
        switchMap(([content, card]) =>
          this.cardsService.updateContent(card.$id, content)
        )
      )
    );

    this.connect(
      'card',
      this.updateArchivedEvent$.pipe(
        switchMap(([archived, card]) =>
          concat(
            of(patch(card, { archived })),
            this.cardsService.updateArchived(card.$id, archived)
          )
        )
      )
    );
  }
}
