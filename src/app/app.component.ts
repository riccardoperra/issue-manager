import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Appwrite } from 'appwrite';
import { APPWRITE } from './providers/appwrite.provider';
import { ProjectsState } from './shared/state/projects.state';
import { AuthState } from './shared/auth/auth.state';
import { AuthEffects } from './shared/auth/auth.effects';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'appwrite-hackathon';

  constructor(
    private readonly projectsState: ProjectsState,
    @Inject(AuthState)
    private readonly authState: AuthState,
    @Inject(AuthEffects)
    private readonly authEffects: AuthEffects,
    @Inject(APPWRITE) private readonly appwrite: Appwrite
  ) {}
}
