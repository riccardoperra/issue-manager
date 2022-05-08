import { Component, Input } from '@angular/core';
import { Project } from '../../../data/projects.service';
import { TuiIslandModule, TuiTagModule } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
  standalone: true,
  imports: [CommonModule, TuiIslandModule, TuiTagModule],
})
export class ProjectCardComponent {
  @Input()
  project: Project | null = null;

  constructor() {}
}
