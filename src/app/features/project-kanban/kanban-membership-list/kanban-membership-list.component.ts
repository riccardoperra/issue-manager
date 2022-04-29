import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
} from '@angular/core';
import { ProjectKanbanAdapter } from '../project-kanban.adapter';
import { tuiPure } from '@taiga-ui/cdk';
import { Models } from 'appwrite';
import { Observable } from 'rxjs';
import { AuthState } from '../../../shared/auth/auth.state';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-kanban-membership-list',
  templateUrl: './kanban-membership-list.component.html',
  styleUrls: ['./kanban-membership-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanMembershipListComponent {
  readonly members$: Observable<readonly Models.Membership[]> =
    this.adapter.members$;

  readonly currentUser$ = this.authState.account$;

  @Output()
  addMember = new EventEmitter<string>();

  @Output()
  removeMember = new EventEmitter<string>();

  addForm = new FormGroup<any>({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(
    @Inject(ProjectKanbanAdapter)
    private readonly adapter: ProjectKanbanAdapter,
    @Inject(AuthState)
    private readonly authState: AuthState
  ) {}

  @tuiPure
  isCurrentUser(
    member: Models.Membership,
    currentUser: Models.User<{}>
  ): boolean {
    console.log('is current user');
    return member.userId === currentUser.$id;
  }

  @tuiPure
  getAvatar(member: Models.Membership): string {
    return `https://avatars.dicebear.com/api/pixel-art-neutral/${member.name}.svg`;
  }

  @tuiPure
  getJoinedDate(member: Models.Membership): number {
    return member.joined * 1000;
  }
}
