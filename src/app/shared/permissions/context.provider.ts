import { Provider, Type } from '@angular/core';
import { CURRENT_WORKSPACE_CONTEXT } from './current-team-context';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { Project } from '../../data/projects.service';
import { PermissionsService } from './permissions.service';

type MapDeps<T extends InstanceType<Type<unknown>>[]> = T extends [
  infer T,
  ...infer Rest
]
  ? [Type<T>, ...MapDeps<Rest>]
  : [];

export const withWorkspaceContext = <Deps extends unknown[]>(): Provider[] => {
  return [
    {
      provide: CURRENT_WORKSPACE_CONTEXT,
      useFactory: () => new ReplaySubject<Project>(1),
    },
    PermissionsService,
  ];
};
