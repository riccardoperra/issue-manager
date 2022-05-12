import { Component, Inject } from '@angular/core';
import { RxActionFactory } from '../../shared/rxa-custom/actions/actions.factory';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RxEffects } from '@rx-angular/state/effects';
import { AuthEffects } from '../../shared/auth/auth.effects';
import { filter } from 'rxjs';
import {
  TuiButtonModule,
  TuiLinkModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiFieldErrorModule,
  TuiInputModule,
  TuiInputPasswordModule,
} from '@taiga-ui/kit';
import { RouterModule } from '@angular/router';
import { GoogleSignInButtonComponent } from '../../shared/auth/components/google-sign-in-button.component';
import { GithubSignInButtonComponent } from '../../shared/auth/components/github-sign-in-button.component';

interface LoginCommands {
  loginWithGithub: void;
  loginWithGoogle: void;
  login: { email: string; password: string };
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [RxActionFactory, RxEffects],
  imports: [
    ReactiveFormsModule,
    TuiLinkModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiFieldErrorModule,
    TuiInputPasswordModule,
    TuiButtonModule,
    RouterModule,
    GoogleSignInButtonComponent,
    GithubSignInButtonComponent,
  ],
  standalone: true,
})
export class LoginComponent {
  readonly actions = this.rxActions.create();

  readonly form = this.fb.group<any>({
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', Validators.required),
  });

  constructor(
    @Inject(RxActionFactory)
    private readonly rxActions: RxActionFactory<LoginCommands>,
    @Inject(FormBuilder)
    private readonly fb: FormBuilder,
    @Inject(RxEffects)
    private readonly rxEffects: RxEffects,
    @Inject(AuthEffects)
    private readonly authEffects: AuthEffects
  ) {
    this.rxEffects.register(
      this.actions.login$.pipe(filter(() => this.form.valid)),
      authEffects.loginWithCredentials
    );

    this.rxEffects.register(
      this.actions.loginWithGithub$,
      authEffects.loginWithGithub
    );

    this.rxEffects.register(
      this.actions.loginWithGoogle$,
      authEffects.loginWithGoogle
    );
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;
    const { email, password } = this.form.value;
    this.actions.login({ email, password });
  }
}
