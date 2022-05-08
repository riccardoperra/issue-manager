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
import { TuiButtonModule } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects-board-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TuiAvatarModule, TuiButtonModule],
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
}
