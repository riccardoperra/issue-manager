import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  TrackByFunction,
} from '@angular/core';
import { ProjectsState } from '../../shared/state/projects.state';
import {
  TuiButtonModule,
  TuiDialogService,
  tuiFadeIn,
  TuiLoaderModule,
} from '@taiga-ui/core';
import { AddProjectRequest, Project } from '../../data/projects.service';
import { AuthState } from '../../shared/auth/auth.state';
import { RxActionFactory } from '../../shared/rxa-custom/actions/actions.factory';
import { RxState } from '@rx-angular/state';
import { AddProjectDialogComponent } from './add-project-dialog/add-project-dialog.component';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { from, startWith, switchMap } from 'rxjs';
import { ForModule } from '@rx-angular/template/experimental/for';
import { TuiTagModule } from '@taiga-ui/kit';
import { LetModule, PushModule } from '@rx-angular/template';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ProjectCardComponent } from './project-card/project-card.component';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { CommonModule } from '@angular/common';

interface ProjectsBoardActions {
  openCreateProjectDialog: void;
  deleteProject: string;
}

interface ProjectsBoardState {
  boardMode: 'grid' | 'card';
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [tuiFadeIn],
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ForModule,
    LetModule,
    PushModule,
    TuiLoaderModule,
    HeaderComponent,
    ProjectCardComponent,
    TuiButtonModule,
    TuiTagModule,
    TuiTableModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxActionFactory],
})
export class DashboardComponent
  extends RxState<ProjectsBoardState>
  implements OnInit
{
  readonly actions = this.rxActions.create();
  readonly projects$ = this.projectsState.projects$;
  readonly loading$ = this.projectsState.loading$.pipe(startWith(false));
  readonly account$ = this.authState.account$;

  readonly boardMode$ = this.select('boardMode');

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

    this.projectsState.initialize();

    this.set({
      boardMode: 'card',
    });
  }

  toggleBoard(): void {
    this.set('boardMode', (state) =>
      state.boardMode === 'grid' ? 'card' : 'grid'
    );
  }

  ngOnInit(): void {
    this.hold(this.actions.openCreateProjectDialog$, () => this.openDialog());
    this.hold(this.actions.deleteProject$, ($id) =>
      this.projectsState.actions.deleteProject({ $id })
    );
  }

  openDialog(): void {
    const dialog = import(
      './add-project-dialog/add-project-dialog.component'
    ).then((m) => m.AddProjectDialogComponent);

    from(dialog)
      .pipe(
        switchMap((component) =>
          this.dialogService.open<AddProjectRequest | null>(
            new PolymorpheusComponent(component),
            {
              size: 'l',
              closeable: true,
              dismissible: true,
            }
          )
        )
      )
      .subscribe((result) => {
        if (!result) return;
        return this.projectsState.actions.addProject(result);
      });
  }
}
