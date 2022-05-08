import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
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
import { isPresent } from '@taiga-ui/cdk';
import { UploadedAttachment } from '../issue-detail.model';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BucketService } from '../../../data/bucket.service';
import { CardAttachmentsService } from '../../../data/cards-attachments.service';
import { Project } from '../../../data/projects.service';
import { Card } from '../../../data/cards.service';
import { TuiInputFileModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-issue-attachments-uploader',
  template: `
    <tui-input-file [multiple]="true" [formControl]="files"></tui-input-file>
  `,
  standalone: true,
  imports: [TuiInputFileModule, ReactiveFormsModule],
})
export class IssueAttachmentsUploaderComponent implements OnInit {
  @Input()
  project!: Project;

  @Input()
  card!: Card;

  @Output()
  addAttachment = new EventEmitter<UploadedAttachment>();

  readonly files = this.fb.control([] as File[]);

  private readonly files$ = this.files.valueChanges.pipe(
    startWith([] as File[]),
    pairwise(),
    map(([prev, curr]) => curr?.filter((item) => !prev?.includes(item)) || []),
    mergeScan((acc, curr) => {
      return combineLatest(
        curr!.map((file) =>
          this.addFile(file).pipe(
            tap((file) => {
              if (!file || file instanceof Error) return;
              this.addAttachment.emit(file);
            }),
            takeUntil(
              // Cancel upload if file is removed from control
              this.files.valueChanges.pipe(
                filter((files) => !files?.includes(file))
              )
            )
          )
        )
      ).pipe(map((files) => [...acc, ...files.filter(isPresent)]));
    }, [] as readonly (UploadedAttachment | Error)[]),
    share()
  );

  constructor(
    @Inject(FormBuilder)
    private readonly fb: FormBuilder,
    @Inject(BucketService)
    private readonly bucketService: BucketService,
    @Inject(CardAttachmentsService)
    private readonly cardAttachmentsService: CardAttachmentsService
  ) {}

  ngOnInit(): void {
    this.files$.subscribe();
  }

  private addFile(file: File): Observable<UploadedAttachment | Error | null> {
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
