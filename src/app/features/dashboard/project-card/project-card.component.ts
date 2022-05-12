import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import {
  AddProjectRequest,
  EditProjectRequest,
  Project,
} from '../../../data/projects.service';
import { TuiBadgeModule, TuiIslandModule, TuiTagModule } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDialogService,
  TuiHostedDropdownModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { AuthState } from '../../../shared/auth/auth.state';
import { LetModule, PushModule, PushPipe } from '@rx-angular/template';
import { PermissionsService } from '../../../shared/permissions/permissions.service';
import { CURRENT_WORKSPACE_CONTEXT } from '../../../shared/permissions/current-team-context';
import { withWorkspaceContext } from '../../../shared/permissions/context.provider';
import { EMPTY, from, map, of, ReplaySubject, switchMap, tap } from 'rxjs';
import { RxState } from '@rx-angular/state';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';

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
    TuiBadgeModule,
    LetModule,
    TuiSvgModule,
  ],
  providers: [withWorkspaceContext()],
})
export class ProjectCardComponent extends RxState<{ project: Project }> {
  readonly project$ = this.select('project');
  readonly allowedWrite$ = this.permissionsService.canWriteOnWorkspace$;

  @Input() set project(project: Project) {
    this.workspace.next(project.$id);
    this.connect('project', of(project));
  }

  @Output()
  deleteProject = new EventEmitter<Project>();

  @Output()
  updateProject = new EventEmitter<EditProjectRequest>();

  constructor(
    @Inject(CURRENT_WORKSPACE_CONTEXT)
    private readonly workspace: ReplaySubject<string>,
    @Inject(PermissionsService)
    private readonly permissionsService: PermissionsService,
    @Inject(AuthState)
    private readonly authState: AuthState,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService
  ) {
    super();
  }

  onUpdateProject(project: Project): void {
    from(
      import('../edit-project-dialog/edit-project-dialog.component').then(
        (m) => m.EditProjectDialogComponent
      )
    )
      .pipe(
        map((component) => new PolymorpheusComponent(component)),
        switchMap((component) =>
          this.dialogService.open<EditProjectRequest | void>(component, {
            data: project,
          })
        )
      )
      .subscribe((result) => {
        if (!result) return;
        this.updateProject.emit(result);
      });
  }
}
