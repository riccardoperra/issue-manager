import {
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  OnInit,
  Output,
} from '@angular/core';
import {
  TuiButtonModule,
  tuiFadeIn,
  TuiScrollbarModule,
  tuiSlideIn,
  TuiSvgModule,
} from '@taiga-ui/core';
import { combineLatest, map } from 'rxjs';
import { ProjectKanbanAdapter } from '../project-kanban.adapter';
import { Category } from '../../../data/categories.service';
import { Card } from '../../../data/cards.service';
import { TuiBadgeModule, TuiIslandModule, TuiTabsModule } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';
import { ForModule } from '@rx-angular/template/experimental/for';
import { LetModule } from '@rx-angular/template';

@Component({
  selector: 'app-kanban-archived-menu',
  templateUrl: './kanban-archived-menu.component.html',
  styleUrls: ['./kanban-archived-menu.component.scss'],
  animations: [tuiSlideIn, tuiFadeIn],
  standalone: true,
  imports: [
    TuiScrollbarModule,
    TuiTabsModule,
    TuiBadgeModule,
    CommonModule,
    TuiIslandModule,
    ForModule,
    TuiButtonModule,
    TuiSvgModule,
    LetModule,
  ],
})
export class KanbanArchivedMenuComponent implements OnInit {
  @HostBinding('@tuiSlideIn')
  readonly options = { value: 'right', duration: 50 };

  @Output()
  closeEvent = new EventEmitter<void>();

  activeIndex = 0;

  readonly archivedLists$ = this.adapter
    .select('categories')
    .pipe(
      map((categories) => categories.filter((category) => category.archived))
    );

  readonly archivedCards$ = this.adapter
    .select('cards')
    .pipe(map((cards) => cards.filter((cards) => cards.archived)));

  readonly vm$ = combineLatest([this.archivedLists$, this.archivedCards$]).pipe(
    map(([lists, cards]) => ({ lists, cards }))
  );

  constructor(
    @Inject(ProjectKanbanAdapter)
    private readonly adapter: ProjectKanbanAdapter
  ) {}

  undoArchiveCategory(list: Category): void {
    this.adapter.ui.updateArchivedCategory({ $id: list.$id, archived: false });
  }

  undoArchiveList(card: Card): void {
    this.adapter.ui.updateArchivedCard({ $id: card.$id, archived: false });
  }

  ngOnInit(): void {}
}
