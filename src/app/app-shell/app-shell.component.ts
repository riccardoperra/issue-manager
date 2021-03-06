import { Component, Inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthState } from '../shared/auth/auth.state';
import { distinctUntilChanged, map } from 'rxjs';
import { isPresent } from '@taiga-ui/cdk';
import { CommonModule } from '@angular/common';
import { PushModule } from '@rx-angular/template';
import { HeaderComponent } from './header/header.component';
import { TuiAlertModule, TuiDialogModule, TuiRootModule } from '@taiga-ui/core';
import { TuiPreviewModule } from '@taiga-ui/addon-preview';

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PushModule,
    HeaderComponent,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    TuiPreviewModule,
  ],
})
export class AppShellComponent implements OnInit {
  readonly authenticated$ = this.authState.account$.pipe(map(isPresent));

  constructor(
    @Inject(Router)
    private readonly router: Router,
    @Inject(AuthState)
    private authState: AuthState
  ) {
    setTimeout(() => {
      this.authState.account$
        .pipe(
          map((account) => !!account),
          distinctUntilChanged()
        )
        .subscribe((loggedIn) => {
          if (loggedIn) {
            const route = document.location.pathname;
            const params = new URLSearchParams(window.location.search);
            // @ts-ignore
            const p = Object.fromEntries([...params.entries()]);
            this.router.navigate(
              [route !== '/' && route !== '/login' ? route : '/'],
              { queryParams: p }
            );
          } else {
            this.router.navigate(['/login']);
          }
        });
    });
  }

  ngOnInit(): void {}
}
