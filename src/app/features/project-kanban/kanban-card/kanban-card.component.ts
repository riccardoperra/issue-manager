import { Component, ElementRef, Inject, Input } from '@angular/core';
import { Card } from '../../../data/cards.service';

@Component({
  selector: 'app-kanban-card',
  templateUrl: './kanban-card.component.html',
  styleUrls: ['./kanban-card.component.scss'],
  providers: [],
})
export class KanbanCardComponent {
  @Input()
  card: Card | null = null;

  constructor(
    @Inject(ElementRef)
    private readonly elementRef: ElementRef<HTMLElement>
  ) {}
}
