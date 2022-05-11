import { Pipe, PipeTransform } from '@angular/core';
import { Card } from '../../../data/cards.service';

@Pipe({
  name: 'issuePriorityColor',
  standalone: true,
})
export class IssuePriorityColorPipePipe implements PipeTransform {
  transform(card: Card | null): any {
    if (!card?.priority) return '';
    return `priority-${card.priority.toLowerCase()}`;
  }
}
