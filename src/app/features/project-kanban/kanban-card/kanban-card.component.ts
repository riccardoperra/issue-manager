import { Component, ElementRef, Inject, Input } from '@angular/core';
import { Card } from '../../../data/cards.service';
import { TuiIslandModule, TuiTagModule } from '@taiga-ui/kit';
import { TuiSvgModule } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kanban-card',
  templateUrl: './kanban-card.component.html',
  styleUrls: ['./kanban-card.component.scss'],
  imports: [CommonModule, TuiTagModule, TuiIslandModule, TuiSvgModule],
  standalone: true,
})
export class KanbanCardComponent {
  @Input()
  card: Card | null = null;

  constructor(
    @Inject(ElementRef)
    private readonly elementRef: ElementRef<HTMLElement>
  ) {}
}
