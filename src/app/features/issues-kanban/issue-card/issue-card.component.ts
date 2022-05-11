import { Component, ElementRef, Inject, Input } from '@angular/core';
import { Card } from '../../../data/cards.service';
import { TuiIslandModule, TuiTagModule } from '@taiga-ui/kit';
import { TuiSvgModule } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { IssuePriorityColorPipePipe } from '../pipes/issue-priority-color.pipe';

@Component({
  selector: 'app-issue-card',
  templateUrl: './issue-card.component.html',
  styleUrls: ['./issue-card.component.scss'],
  imports: [
    CommonModule,
    TuiTagModule,
    TuiIslandModule,
    TuiSvgModule,
    IssuePriorityColorPipePipe,
  ],
  standalone: true,
})
export class IssueCardComponent {
  @Input()
  card: Card | null = null;

  constructor(
    @Inject(ElementRef)
    private readonly elementRef: ElementRef<HTMLElement>
  ) {}
}
