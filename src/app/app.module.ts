import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  TuiAlertModule,
  TuiButtonModule,
  TuiDialogModule,
  TuiRootModule,
} from '@taiga-ui/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { APP_PROVIDERS } from './app.providers';
import { UnpatchEventsModule } from '@rx-angular/template';
import { ProjectsBoardModule } from './features/projects-board/projects-board.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    UnpatchEventsModule,
    AppRoutingModule,
    TuiRootModule,
    BrowserAnimationsModule,
    TuiDialogModule,
    TuiAlertModule,
    TuiButtonModule,
    ProjectsBoardModule,
  ],
  providers: [APP_PROVIDERS],
  bootstrap: [AppComponent],
})
export class AppModule {}
