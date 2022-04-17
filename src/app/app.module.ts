import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TuiAlertModule, TuiButtonModule, TuiDialogModule, TuiRootModule} from "@taiga-ui/core";
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {RXA_PROVIDER} from "./shared/rxa-custom/rxa.provider";

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
    TuiAlertModule,
    TuiButtonModule
  ],
  providers: [
    RXA_PROVIDER
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
