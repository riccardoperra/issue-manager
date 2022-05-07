import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Models } from 'appwrite';
import { FormBuilder } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  mergeScan,
  Observable,
  pairwise,
  share,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { BucketService } from '../../../data/bucket.service';
import { Project } from '../../../data/projects.service';
import { isPresent, tuiPure } from '@taiga-ui/cdk';
import {
  CardAttachment,
  CardAttachmentsService,
} from '../../../data/cards-attachments.service';
import { Card } from '../../../data/cards.service';
import { PreviewDialogService } from '@taiga-ui/addon-preview';
import { DomSanitizer } from '@angular/platform-browser';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { KanbanAttachmentPreviewComponent } from './kanban-attachment-preview/kanban-attachment-preview.component';

@Component({
  selector: 'app-kanban-attachments-table',
  templateUrl: './kanban-attachments-table.component.html',
  styleUrls: ['./kanban-attachments-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanAttachmentsTableComponent implements OnInit {
  readonly files = this.fb.control([]);

  @Input()
  project!: Project;

  @Input()
  card!: Card;

  @Input()
  attachments: readonly (Models.File & {
    attachment: CardAttachment;
  })[] = [];

  @Output()
  deleteAttachment = new EventEmitter<
    Models.File & {
      attachment: CardAttachment;
    }
  >();

  @Output()
  addAttachment = new EventEmitter<
    Models.File & {
      attachment: CardAttachment;
    }
  >();

  readonly previewItem$ = new BehaviorSubject<Models.File | null>(null);

  private readonly files$ = this.files.valueChanges.pipe(
    startWith<File[]>([]),
    pairwise(),
    map(([prev, curr]) => curr.filter((item) => !prev.includes(item))),
    // @ts-ignore
    mergeScan((acc, curr) => {
      return combineLatest(
        curr.map((file) =>
          this.addFile(file).pipe(
            tap((file) => {
              if (!file || file instanceof Error) return;
              this.addAttachment.emit(file);
            }),
            startWith(file),
            takeUntil(
              // Cancel upload if file is removed from control
              this.files.valueChanges.pipe(
                filter((files) => !files.includes(file))
              )
            )
          )
        )
      ).pipe(map((files) => [...acc, ...files.filter(isPresent)]));
    }, [] as ReadonlyArray<Models.File>),
    share()
  );

  constructor(
    @Inject(BucketService)
    private readonly bucketService: BucketService,
    @Inject(CardAttachmentsService)
    private readonly cardAttachmentsService: CardAttachmentsService,
    @Inject(PreviewDialogService)
    private readonly previewDialogService: PreviewDialogService,
    @Inject(FormBuilder)
    private readonly fb: FormBuilder,
    @Inject(DomSanitizer)
    private readonly domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.files$.subscribe(console.log);
  }

  @tuiPure
  getDownloadUrl(item: Models.File): string {
    return this.bucketService.getDownload(item.bucketId, item.$id).href;
  }

  openPreview(item: Models.File, index: number): void {
    const component = new PolymorpheusComponent(
      KanbanAttachmentPreviewComponent
    );
    const files = this.attachments;

    this.previewDialogService
      .open(component, { data: { files, item, index } })
      .subscribe();
  }

  deleteFile(item: Models.File & { attachment: CardAttachment }): void {
    this.bucketService
      .deleteFile(item.attachment.projectId, item.$id)
      .pipe(
        switchMap(() => this.cardAttachmentsService.deleteAttachment(item.$id))
      )
      .subscribe(() => this.deleteAttachment.emit(item));
  }

  private addFile(
    file: File
  ): Observable<(Models.File & { attachment: CardAttachment }) | Error | null> {
    return this.bucketService.addAttachment(this.project, file).pipe(
      switchMap((ref) =>
        this.cardAttachmentsService
          .addAttachment(this.project, this.card, ref)
          .pipe(
            map((attachment) => ({
              ...ref,
              attachment,
            }))
          )
      )
    );
  }
}
