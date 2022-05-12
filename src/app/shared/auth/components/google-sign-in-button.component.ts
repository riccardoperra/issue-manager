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
  selector: 'button[tuiButton][googleSignInButton]',
  standalone: true,
})
export class GoogleSignInButtonComponent {
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
    this.tuiButton.icon = 'assets/icons/google.svg';
    this.tuiButton.appearance = 'google';
  }

  @HostListener('click')
  onClick(): void {
    this.effects.loginWithGoogle();
  }
}
