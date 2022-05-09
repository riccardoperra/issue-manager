import {
  ChangeDetectorRef,
  Directive,
  EmbeddedViewRef,
  Inject,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AuthState } from '../auth/auth.state';
import { CURRENT_WORKSPACE_CONTEXT } from './current-team-context';
import { combineLatest, map, Observable, takeUntil } from 'rxjs';
import { Project } from '../../data/projects.service';
import { Models } from 'appwrite';
import { DestroyService } from '../utils/destroy';
import { PermissionsService } from './permissions.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[hasWorkspaceAuthorization]',
  providers: [DestroyService],
  standalone: true,
})
export class HasAuthorizationDirective implements OnInit {
  viewRef: EmbeddedViewRef<unknown> | null = null;

  constructor(
    @Inject(TemplateRef)
    private readonly templateRef: TemplateRef<unknown>,
    @Inject(ViewContainerRef)
    private readonly viewContainerRef: ViewContainerRef,
    @Inject(PermissionsService)
    private readonly permissionService: PermissionsService,
    @Inject(DestroyService)
    private readonly destroy$: Observable<void>,
    @Inject(ChangeDetectorRef)
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.permissionService.canWriteOnWorkspace$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isAllowed) => {
        if (isAllowed) {
          this.viewRef = this.viewContainerRef.createEmbeddedView(
            this.templateRef
          );
        } else if (this.viewRef) {
          this.viewRef.destroy();
        }
      });
  }
}
