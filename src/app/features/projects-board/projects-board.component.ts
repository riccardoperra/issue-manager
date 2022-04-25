import { Component, Inject, OnInit, TrackByFunction } from '@angular/core';
import { ProjectsState } from '../../shared/state/projects.state';
import { TuiDialogService, tuiFadeIn } from '@taiga-ui/core';
import { AddProjectRequest, Project } from '../../data/projects.service';
import { AuthState } from '../../shared/auth/auth.state';
import { RxActionFactory } from '../../shared/rxa-custom/actions/actions.factory';
import { RxState } from '@rx-angular/state';
import { AddProjectDialogComponent } from './add-project-dialog/add-project-dialog.component';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { startWith } from 'rxjs';

interface ProjectsBoardActions {
  openCreateProjectDialog: void;
}

@Component({
  selector: 'app-projects-board',
  templateUrl: './projects-board.component.html',
  styleUrls: ['./projects-board.component.scss'],
  animations: [tuiFadeIn],
  providers: [RxActionFactory],
})
export class ProjectsBoardComponent extends RxState<never> implements OnInit {
  readonly actions = this.rxActions.create();
  readonly projects$ = this.projectsState.projects$;
  readonly loading$ = this.projectsState.loading$.pipe(startWith(false));
  readonly account$ = this.authState.account$;

  readonly projectTrackBy: TrackByFunction<Project> = (index, { $id }) => $id;

  constructor(
    @Inject(AuthState)
    private readonly authState: AuthState,
    @Inject(ProjectsState)
    private readonly projectsState: ProjectsState,
    @Inject(RxActionFactory)
    private readonly rxActions: RxActionFactory<ProjectsBoardActions>,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService
  ) {
    super();
  }

  ngOnInit(): void {
    this.hold(this.actions.openCreateProjectDialog$, () => this.openDialog());
  }

  openDialog(): void {
    const content = new PolymorpheusComponent(AddProjectDialogComponent);

    this.dialogService
      .open<AddProjectRequest | null>(content, {
        size: 'l',
        closeable: true,
        dismissible: true,
      })
      .subscribe((result) => {
        if (!result) return;
        return this.projectsState.actions.addProject(result);
      });
  }
}
