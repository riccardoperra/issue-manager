import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { APP_PROVIDERS } from './app/app.providers';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EventPluginsModule } from '@tinkoff/ng-event-plugins';
import { RouterModule } from '@angular/router';
import { ROUTES } from './app/app.routes';
import { iconsPathFactory, TUI_ICONS, TUI_ICONS_PATH } from '@taiga-ui/core';

if (environment.production) {
  enableProdMode();
}

// This assumes that icons were properly processed
export function iconsPath(name: string): string {
  return `assets/icons/${name}.svg#}`;
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
      {
        provide: TUI_ICONS,
        useValue: {
          google: 'google.svg',
        },
      },
      {
        provide: TUI_ICONS_PATH,
        useValue: iconsPathFactory('assets/icons'),
      },
    ],
  }).catch((err) => console.error(err))
);
// );
