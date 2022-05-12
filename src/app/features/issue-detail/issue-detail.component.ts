import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { CardsService } from '../../data/cards.service';
import { IssueDetailAdapter } from './issue-detail-adapter.service';
import { TuiDialogContext } from '@taiga-ui/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { EditorState } from 'lexical';
import {
  ISSUE_DETAIL_IMPORTS,
  ISSUE_DETAIL_PROVIDERS,
} from './issue-detail.metadata';
import { PermissionsService } from '../../shared/permissions/permissions.service';
import { filter, finalize, map, Observable, takeUntil, tap } from 'rxjs';
import { DestroyService } from '../../shared/utils/destroy';

export interface KanbanCardEditorContext {
  cardId: string;
}

@Component({
  selector: 'app-kanban-card-editor',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.scss'],
  standalone: true,
  providers: [ISSUE_DETAIL_PROVIDERS],
  imports: [ISSUE_DETAIL_IMPORTS],
})
export class IssueDetailComponent implements OnInit, OnDestroy {
  readonly card$ = this.adapter.select('card');
  readonly title = new FormControl<any>('');
  readonly project$ = this.adapter.select('project');
  readonly attachments$ = this.adapter.select('attachmentList');
  readonly readOnly$ = this.permissionsService.canWriteOnWorkspace$.pipe(
    map((enabled) => !enabled)
  );

  editingTitle: boolean = false;

  onEsc(e: Event): void {
    e.stopImmediatePropagation();
    this.onZoneChange(false);
  }

  onZoneChange(zone: boolean): void {
    if (!zone) {
      this.editingTitle = false;
    }
  }

  onUpdateTitle(): void {
    this.adapter.actions.editTitle(this.title.value);
    this.editingTitle = false;
  }

  constructor(
    @Inject(DestroyService)
    private readonly destroy$: Observable<void>,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<void, KanbanCardEditorContext>,
    @Inject(CardsService)
    private readonly cardsService: CardsService,
    @Inject(IssueDetailAdapter)
    readonly adapter: IssueDetailAdapter,
    @Inject(FormBuilder)
    private readonly fb: FormBuilder,
    @Inject(PermissionsService)
    private readonly permissionsService: PermissionsService
  ) {
    this.adapter.actions.fetch({ $id: this.context.data.cardId });

    this.adapter.connect(
      'card',
      this.cardsService.observeCardChanges(this.context.data.cardId).pipe(
        filter((evt) => evt.event === 'database.documents.update'),
        map((evt) => evt.payload)
      )
    );
  }

  editorChange(editor: EditorState) {
    const state = {
      editorState: editor,
      lastSaved: Date.now(),
    };

    this.adapter.actions.updateContent(JSON.stringify(state));
  }

  archive(): void {
    this.adapter.actions.updateArchived(true);
  }

  undoArchive(): void {
    this.adapter.actions.updateArchived(false);
  }

  ngOnInit(): void {}
}
