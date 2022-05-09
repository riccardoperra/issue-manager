import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewContainerRef,
} from '@angular/core';
import { UnpatchEventsModule } from '@rx-angular/template';
import { provideRoutes } from '@angular/router';
import { ROUTES } from './app.routes';

@Component({
  selector: 'app-root',
  template: '',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [UnpatchEventsModule],
  providers: [provideRoutes(ROUTES)],
})
export class AppComponent implements AfterViewInit {
  title = 'appwrite-hackathon';

  private readonly shell = import('./app-shell/app-shell.component').then(
    (m) => m.AppShellComponent
  );

  constructor(
    @Inject(ViewContainerRef)
    private readonly viewContainerRef: ViewContainerRef
  ) {}

  ngAfterViewInit() {
    this.shell.then((component) => {
      this.viewContainerRef?.createComponent(component);
    });
  }
}
