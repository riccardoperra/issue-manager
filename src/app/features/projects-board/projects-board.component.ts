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
  TuiGroupModule,
  TuiLabelModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiModeModule,
  TuiTextfieldControllerModule,
  TuiTooltipModule,
} from '@taiga-ui/core';
import { AddProjectRequest, Project } from '../../data/projects.service';
import { AuthState } from '../../shared/auth/auth.state';
import { RxActionFactory } from '../../shared/rxa-custom/actions/actions.factory';
import { RxState } from '@rx-angular/state';
import { AddProjectDialogComponent } from './add-project-dialog/add-project-dialog.component';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { startWith } from 'rxjs';
import { ForModule } from '@rx-angular/template/experimental/for';
import {
  TuiFieldErrorModule,
  TuiInputTagModule,
  TuiIslandModule,
  TuiRadioBlockModule,
  TuiTagModule,
  TuiTextAreaModule,
} from '@taiga-ui/kit';
import { LetModule, PushModule } from '@rx-angular/template';
import { TuiAutoFocusModule } from '@taiga-ui/cdk';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ProjectCardComponent } from './project-card/project-card.component';

interface ProjectsBoardActions {
  openCreateProjectDialog: void;
}

interface ProjectsBoardState {
  boardMode: 'grid' | 'card';
}

@Component({
  selector: 'app-projects-board',
  templateUrl: './projects-board.component.html',
  styleUrls: ['./projects-board.component.scss'],
  animations: [tuiFadeIn],
  standalone: true,
  imports: [
    RouterModule,
    ForModule,
    LetModule,
    PushModule,
    TuiLoaderModule,
    HeaderComponent,
    ProjectCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxActionFactory],
})
export class ProjectsBoardComponent
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
