import { NgModule } from '@angular/core';

import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  TuiButtonModule,
  TuiLinkModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiFieldErrorModule,
  TuiInputModule,
  TuiInputPasswordModule,
} from '@taiga-ui/kit';
import { ROUTES } from './login.routes';

@NgModule({
  imports: [
    ReactiveFormsModule,
    TuiLinkModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiFieldErrorModule,
    TuiInputPasswordModule,
    TuiButtonModule,
    RouterModule.forChild(ROUTES),
  ],
  exports: [],
  declarations: [LoginComponent],
  providers: [],
})
export class LoginModule {}
