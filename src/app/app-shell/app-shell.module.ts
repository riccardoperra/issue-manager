import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppShellComponent } from './app-shell.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppShellComponent],
  imports: [CommonModule, RouterModule],
  exports: [AppShellComponent],
})
export class AppShellModule {}
