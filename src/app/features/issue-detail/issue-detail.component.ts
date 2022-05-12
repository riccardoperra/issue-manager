import { Component, Inject, OnInit } from '@angular/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { CardsService } from '../../data/cards.service';
import { IssueEditorAdapter } from './issue-detail-adapter.service';
import { TuiDialogContext } from '@taiga-ui/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { EditorState } from 'lexical';
import {
  ISSUE_DETAIL_IMPORTS,
  ISSUE_DETAIL_PROVIDERS,
} from './issue-detail.metadata';
import { TuiDay, TuiTime } from '@taiga-ui/cdk';
import { PermissionsService } from '../../shared/permissions/permissions.service';
import { map } from 'rxjs';

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
export class IssueDetailComponent implements OnInit {
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
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<void, KanbanCardEditorContext>,
    @Inject(CardsService)
    private readonly cardsService: CardsService,
    @Inject(IssueEditorAdapter)
    readonly adapter: IssueEditorAdapter,
    @Inject(FormBuilder)
    private readonly fb: FormBuilder,
    @Inject(PermissionsService)
    private readonly permissionsService: PermissionsService
  ) {
    this.adapter.actions.fetch({ $id: this.context.data.cardId });
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
