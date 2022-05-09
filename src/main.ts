import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { APP_PROVIDERS } from './app/app.providers';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EventPluginsModule } from '@tinkoff/ng-event-plugins';
import { RouterModule } from '@angular/router';
import { ROUTES } from './app/app.routes';

if (environment.production) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', () =>
  bootstrapApplication(AppComponent, {
    providers: [
      APP_PROVIDERS,
      importProvidersFrom(BrowserAnimationsModule, EventPluginsModule),
      importProvidersFrom(
        RouterModule.forRoot(ROUTES, {
          enableTracing: false,
          initialNavigation: 'disabled',
        })
      ),
    ],
  }).catch((err) => console.error(err))
);
// );
