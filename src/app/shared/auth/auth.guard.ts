import { Inject, Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad } from '@angular/router';
import { AuthState } from './auth.state';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(@Inject(AuthState) private authState: AuthState) {}

  canActivate(): Observable<boolean> | boolean {
    return this.checkLogin();
  }

  canActivateChild(): boolean | Observable<boolean> {
    return this.canActivate();
  }

  canLoad(): boolean | Observable<boolean> {
    return this.checkLogin();
  }

  checkLogin(): Observable<boolean> {
    return this.authState.account$.pipe(map((account) => !!account));
  }
}
