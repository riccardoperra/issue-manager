import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { ProjectKanbanAdapter } from '../project-kanban.adapter';
import { TuiAutoFocusModule, tuiPure } from '@taiga-ui/cdk';
import { Models } from 'appwrite';
import { AuthState } from '../../../shared/auth/auth.state';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  TuiButtonModule,
  TuiDropdownControllerModule,
  TuiHostedDropdownModule,
  TuiLabelModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiAvatarModule, TuiBadgeModule, TuiInputModule } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';
import { LetModule } from '@rx-angular/template';
import { ForModule } from '@rx-angular/template/experimental/for';

@Component({
  selector: 'app-kanban-membership-list',
  templateUrl: './kanban-membership-list.component.html',
  styleUrls: ['./kanban-membership-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    TuiTextfieldControllerModule,
    TuiAutoFocusModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiLabelModule,
    TuiHostedDropdownModule,
    TuiDropdownControllerModule,
    TuiButtonModule,
    TuiBadgeModule,
    CommonModule,
    TuiAvatarModule,
    TuiSvgModule,
    LetModule,
    ForModule,
  ],
})
export class KanbanMembershipListComponent {
  readonly currentUser$ = this.authState.account$;

  @Input()
  members: readonly Models.Membership[] = [];

  @Output()
  addMember = new EventEmitter<string>();

  @Output()
  removeMember = new EventEmitter<string>();

  addForm = this.fb.group({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(
    @Inject(ProjectKanbanAdapter)
    private readonly adapter: ProjectKanbanAdapter,
    @Inject(AuthState)
    private readonly authState: AuthState,
    @Inject(FormBuilder)
    private readonly fb: FormBuilder
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
