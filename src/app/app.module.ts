import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TuiAlertModule, TuiDialogModule, TuiRootModule} from "@taiga-ui/core";
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TuiRootModule,
    BrowserAnimationsModule,
    TuiDialogModule,
    TuiAlertModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
