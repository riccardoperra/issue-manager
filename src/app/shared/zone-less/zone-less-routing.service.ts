import {isPlatformBrowser} from '@angular/common';
import {ApplicationRef, ErrorHandler, Inject, Injectable, PLATFORM_ID,} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {isZonePresent} from './is-zone-present';
import {RxEffects} from '@rx-angular/state/effects';


@Injectable({
  providedIn: 'root',
  deps: [RxEffects],
})
export class ZonelessRouting extends RxEffects {
  constructor(
    private router: Router,
    private appRef: ApplicationRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    errorHandler: ErrorHandler
  ) {
    super(errorHandler);
  }

  init() {
    if (isPlatformBrowser(this.platformId) && !isZonePresent()) {
      this.register(
        this.router.events,
        (e) => {
          if (e instanceof NavigationEnd) {
            this.appRef.tick();
          }
        }
      );
    }
  }
}
