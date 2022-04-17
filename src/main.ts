import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', () =>
  platformBrowserDynamic()
    /**
     * **🚀 Perf Tip for LCP, TTI, TBT:**
     *
     * Disable zone.js as change detection system.
     * Add { ngZone: 'noop' } to the bootstrap options
     *
     * ⚠ Notice:
     * Don't forget to:
     * - remove `zone.js` import from the `polyfills.ts` file
     * - trigger change detection manually after NavigationEnd (or use the provided helper `ZonelessRouting`)
     *
     * 💡 Additional Optimization:
     * Remove the `polyfills` option from your `angular.json` to save 1 request and 118b
     *
     */
    .bootstrapModule(AppModule, {ngZone: 'noop'})
    .catch((err) => console.error(err))
);
