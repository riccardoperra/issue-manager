import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthState } from '../shared/auth/auth.state';
import { distinctUntilChanged, map } from 'rxjs';

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
})
export class AppShellComponent implements OnInit {
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
            this.router.navigate([
              route !== '/' && route !== '/login' ? route : '/',
            ]);
          } else {
            this.router.navigate(['/login']);
          }
        });
    });
  }

  ngOnInit(): void {}
}
