import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShellComponent } from './app-shell.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { PushModule } from '@rx-angular/template';

@NgModule({
  declarations: [AppShellComponent],
  imports: [CommonModule, RouterModule, PushModule, HeaderComponent],
  exports: [AppShellComponent],
})
export class AppShellModule {}
