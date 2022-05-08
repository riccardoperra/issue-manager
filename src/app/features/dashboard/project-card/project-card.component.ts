import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Project } from '../../../data/projects.service';
import { TuiIslandModule, TuiTagModule } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiHostedDropdownModule,
} from '@taiga-ui/core';
import { AuthState } from '../../../shared/auth/auth.state';
import { PushModule, PushPipe } from '@rx-angular/template';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TuiIslandModule,
    TuiTagModule,
    TuiButtonModule,
    TuiHostedDropdownModule,
    TuiDataListModule,
    PushModule,
  ],
})
export class ProjectCardComponent {
  @Input()
  project: Project | null = null;

  @Output()
  deleteProject = new EventEmitter<Project>();

  readonly isGuest$ = this.authState.isGuest$;

  constructor(
    @Inject(AuthState)
    private readonly authState: AuthState
  ) {}
}
