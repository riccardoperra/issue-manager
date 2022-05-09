import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RxActionFactory } from '../../shared/rxa-custom/actions/actions.factory';
import { ProjectKanbanAdapter } from './project-kanban.adapter';
import { TuiButtonModule, TuiLinkModule, tuiSlideIn } from '@taiga-ui/core';
import { withWorkspaceContext } from '../../shared/permissions/context.provider';
import { TuiBreadcrumbsModule } from '@taiga-ui/kit';
import { HasAuthorizationDirective } from '../../shared/permissions/has-authorization.directive';
import { KanbanMembershipListComponent } from './kanban-membership-list/kanban-membership-list.component';
import { IssuesKanbanComponent } from '../issues-kanban/issues-kanban.component';
import { KanbanArchivedMenuComponent } from './kanban-archived-menu/kanban-archived-menu.component';
import { CommonModule } from '@angular/common';
import { LetModule } from '@rx-angular/template';

@Component({
  selector: 'app-project-kanban',
  templateUrl: './project-kanban.component.html',
  styleUrls: ['./project-kanban.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxActionFactory, ProjectKanbanAdapter, withWorkspaceContext()],
  animations: [tuiSlideIn],
  standalone: true,
  imports: [
    CommonModule,
    LetModule,
    TuiButtonModule,
    TuiBreadcrumbsModule,
    TuiLinkModule,
    RouterModule,
    HasAuthorizationDirective,
    KanbanMembershipListComponent,
    IssuesKanbanComponent,
    KanbanArchivedMenuComponent,
  ],
})
export class ProjectKanbanComponent {
  readonly breadcrumb = [{ caption: 'Dashboard', routerLink: '/' }];
  readonly project$ = this.adapter.project$;
  showArchived = false;

  constructor(
    @Inject(ChangeDetectorRef)
    private readonly changeDetectorRef: ChangeDetectorRef,
    @Inject(ActivatedRoute)
    private readonly activatedRoute: ActivatedRoute,
    @Inject(ProjectKanbanAdapter)
    readonly adapter: ProjectKanbanAdapter
  ) {}
}
