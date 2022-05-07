import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  BehaviorSubject,
  delay,
  filter,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { isPresent } from '@taiga-ui/cdk';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';
import { Models } from 'appwrite';
import { BucketService } from '../../../../data/bucket.service';

interface AttachmentPreviewContext {
  files: readonly Models.File[];
}

@Component({
  selector: 'app-kanban-attachment-preview',
  templateUrl: 'kanban-attachment-preview.component.html',
  styleUrls: ['./kanban-attachment-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanAttachmentPreviewComponent {
  get files() {
    return this.context.data.files;
  }

  readonly index$ = new BehaviorSubject<number>(0);

  readonly item$ = this.index$.pipe(
    map((index) => this.files[index]),
    filter(isPresent)
  );

  readonly downloadLink$ = this.item$.pipe(
    map((file) => this.bucketService.getDownload(file.bucketId, file.$id))
  );

  readonly title$ = this.item$.pipe(map((item) => item.name));

  readonly contentUnavailable$ = this.item$.pipe(map(() => false));

  readonly imageSrc$ = this.item$.pipe(
    switchMap((item) =>
      of(this.bucketService.getPreview(item.bucketId, item.$id)).pipe(
        delay(500),
        map(({ href }) => href),
        startWith(null)
      )
    )
  );

  close(): void {
    this.context.completeWith();
  }

  readonly loading$ = this.imageSrc$.pipe(map((src) => !src));

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<void, AttachmentPreviewContext>,
    @Inject(BucketService)
    private readonly bucketService: BucketService
  ) {}
}
