import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import {
  LexicalComposerConfig,
  LexicalComposerDirective,
} from 'lexical-angular';
import { editorTheme } from './theme';
import { FormControl } from '@angular/forms';
import { CLEAR_HISTORY_COMMAND, EditorState } from 'lexical';

@Component({
  selector: 'app-lexical-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaygroundEditorComponent implements AfterViewInit {
  @Input()
  content: string = '';

  @Input()
  disabled: boolean = false;

  @Input()
  richText: boolean = true;

  @ViewChild(LexicalComposerDirective, { static: true })
  composer!: LexicalComposerDirective;

  @Output()
  editorChange = new EventEmitter<EditorState>();

  config: LexicalComposerConfig = {
    namespace: 'PlaygroundEditor',
    onError: (error) => {
      throw error;
    },
    theme: editorTheme,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      // CodeNode,
      // TableNode,
      // TableCellNode,
      // TableRowNode,
      // HashtagNode,
      // CodeHighlightNode,
      AutoLinkNode,
      LinkNode,
      // OverflowNode,
      // PollNode,
      // StickyNode,
      // ImageNode,
    ],
  };

  testing = new FormControl();

  constructor() {}

  ngAfterViewInit() {
    const editor = this.composer.editor!;
    const json = JSON.parse(this.content);
    if (json && json.editorState) {
      const editorState = editor.parseEditorState(
        JSON.stringify(json.editorState)
      );
      editor.setEditorState(editorState);
    }
    editor.dispatchCommand(CLEAR_HISTORY_COMMAND, null);

    if (this.disabled) {
      editor.setReadOnly(true);
    }
  }
}
