import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import { tuiFadeIn, tuiSlideIn } from '@taiga-ui/core';
import { combineLatest, map } from 'rxjs';
import { ProjectKanbanAdapter } from '../project-kanban.adapter';
import { Category } from '../../../data/categories.service';
import { Card } from '../../../data/cards.service';

@Component({
  selector: 'app-kanban-archived-menu',
  templateUrl: './kanban-archived-menu.component.html',
  styleUrls: ['./kanban-archived-menu.component.scss'],
  animations: [tuiSlideIn, tuiFadeIn],
})
export class KanbanArchivedMenuComponent implements OnInit {
  @HostBinding('@tuiSlideIn')
  readonly options = { value: 'right', duration: 100 };

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
