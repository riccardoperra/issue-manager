import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ZonelessRouting } from './shared/zone-less/zone-less-routing.service';
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

  readonly projects$ = this.projectsState.$;

  constructor(
    private readonly zonelessRouting: ZonelessRouting,
    private readonly projectsState: ProjectsState,
    @Inject(AuthState)
    private readonly authState: AuthState,
    @Inject(AuthEffects)
    private readonly authEffects: AuthEffects,
    @Inject(APPWRITE) private readonly appwrite: Appwrite
  ) {
    this.zonelessRouting.init();

    this.authState.select().subscribe(console.log);
  }

  log(e: any) {
    console.log(e);
  }
}
