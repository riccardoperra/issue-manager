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

@Component({
  selector: 'app-projects-board-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
