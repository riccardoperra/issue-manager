import { Component, Inject, OnInit } from '@angular/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { CardsService } from '../../data/cards.service';
import { KanbanCardEditorAdapter } from './kanban-card-editor.adapter';
import { TuiDialogContext } from '@taiga-ui/core';
import { FormControl } from '@angular/forms';
import { EditorState } from 'lexical';
import {
  ISSUE_EDITOR_IMPORTS,
  ISSUE_EDITOR_PROVIDERS,
} from './issue-editor.metadata';

export interface KanbanCardEditorContext {
  cardId: string;
}

@Component({
  selector: 'app-kanban-card-editor',
  templateUrl: './kanban-card-editor.component.html',
  styleUrls: ['./kanban-card-editor.component.scss'],
  standalone: true,
  providers: [ISSUE_EDITOR_PROVIDERS],
  imports: [ISSUE_EDITOR_IMPORTS],
})
export class KanbanCardEditorComponent implements OnInit {
  readonly card$ = this.adapter.select('card');
  readonly title = new FormControl<any>('');
  readonly project$ = this.adapter.select('project');
  readonly attachments$ = this.adapter.select('attachmentList');

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
    @Inject(KanbanCardEditorAdapter)
    readonly adapter: KanbanCardEditorAdapter
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
