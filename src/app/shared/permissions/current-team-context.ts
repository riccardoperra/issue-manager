import { InjectionToken } from '@angular/core';
import { Project } from '../../data/projects.service';
import { BehaviorSubject } from 'rxjs';

export const CURRENT_WORKSPACE_CONTEXT = new InjectionToken<
  BehaviorSubject<string>
>('current team token context');
