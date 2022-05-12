import { Component, Inject, TemplateRef } from '@angular/core';
import { AuthState } from '../../shared/auth/auth.state';
import { AuthEffects } from '../../shared/auth/auth.effects';
import { RxActionFactory } from '../../shared/rxa-custom/actions/actions.factory';
import { TuiAvatarModule } from '@taiga-ui/kit';
import { LetModule } from '@rx-angular/template';
import { TuiButtonModule, TuiDialogService } from '@taiga-ui/core';

@Component({
  selector: '[shellHeader]',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  providers: [RxActionFactory],
  imports: [LetModule, TuiButtonModule, TuiAvatarModule],
})
export class HeaderComponent {
  readonly user$ = this.authState.account$;

  constructor(
    @Inject(AuthState)
    private readonly authState: AuthState,
    @Inject(AuthEffects)
    private readonly authEffects: AuthEffects,
    @Inject(RxActionFactory)
    private readonly rxActionsFactory: RxActionFactory<any>,
    @Inject(TuiDialogService)
    private readonly dialogService: TuiDialogService
  ) {}

  logout(): void {
    this.authEffects.logout();
  }

  deleteAccount(template: TemplateRef<any>): void {
    this.dialogService.open<boolean>(template).subscribe();
  }

  deleteAccountConfirm(): void {
    this.authEffects.deleteAccount();
  }
}
