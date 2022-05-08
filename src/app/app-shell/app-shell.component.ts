import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthState } from '../shared/auth/auth.state';
import { distinctUntilChanged, map } from 'rxjs';
import { isPresent } from '@taiga-ui/cdk';

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
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
