import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { LexicalComposerConfig } from 'lexical-angular';
import { editorTheme } from './theme';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-lexical-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaygroundEditorComponent implements OnInit {
  @Input()
  richText: boolean = true;

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

  ngOnInit() {
    this.testing.valueChanges.subscribe(console.log);
  }
}
