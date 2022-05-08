import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { AuthState } from '../../../shared/auth/auth.state';
import { Models } from 'appwrite';
import { TuiAvatarModule } from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiHintModule,
  TuiTooltipModule,
} from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { LetModule, PushModule } from '@rx-angular/template';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TuiAvatarModule,
    TuiButtonModule,
    PushModule,
    LetModule,
  ],
  standalone: true,
})
export class HeaderComponent {
  @Input()
  account: Models.User<{}> | null = null;

  @Output()
  createProject = new EventEmitter<void>();

  constructor(
    @Inject(AuthState)
    private readonly authState: AuthState
  ) {}

  readonly canAddNewProject$ = this.authState.isGuest$.pipe(
    map((guest) => !guest)
  );
}
