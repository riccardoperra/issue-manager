import {
  ChangeDetectorRef,
  Directive,
  HostListener,
  Inject,
} from '@angular/core';
import { AuthEffects } from '../auth.effects';
import { TuiButtonComponent } from '@taiga-ui/core';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: 'button[tuiButton][githubSignInButton]',
  standalone: true,
})
export class GithubSignInButtonComponent {
  constructor(
    @Inject(AuthEffects)
    private readonly effects: AuthEffects,
    @Inject(TuiButtonComponent)
    private readonly tuiButton: TuiButtonComponent,
    @Inject(DomSanitizer)
    private readonly sanitizer: DomSanitizer,
    @Inject(ChangeDetectorRef)
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {
    this.tuiButton.icon = 'assets/icons/github.svg';
    this.tuiButton.appearance = 'github';
  }

  @HostListener('click')
  onClick(): void {
    this.effects.loginWithGithub();
  }
}
