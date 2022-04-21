import { Component, Inject } from '@angular/core';
import { RxActionFactory } from '../../shared/rxa-custom/actions/actions.factory';
import { FormBuilder, Validators } from '@angular/forms';
import { RxEffects } from '@rx-angular/state/effects';
import { AuthEffects } from '../../shared/auth/auth.effects';
import { filter } from 'rxjs';

interface LoginCommands {
  loginAsGuest: void;
  login: { email: string; password: string };
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [RxActionFactory, RxEffects],
})
export class LoginComponent {
  readonly actions = this.rxActions.create();

  readonly form = this.fb.group({
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
      this.actions.loginAsGuest$,
      authEffects.loginAsGuest
    );
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;
    const { email, password } = this.form.value;
    this.actions.login({ email, password });
  }
}
