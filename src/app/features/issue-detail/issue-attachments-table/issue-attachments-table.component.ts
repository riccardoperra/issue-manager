import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { Models } from 'appwrite';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BucketService } from '../../../data/bucket.service';
import { TuiMapperPipeModule, tuiPure } from '@taiga-ui/cdk';
import { CardAttachmentsService } from '../../../data/cards-attachments.service';
import { PreviewDialogService } from '@taiga-ui/addon-preview';
import { DomSanitizer } from '@angular/platform-browser';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { CommonModule } from '@angular/common';
import { TuiButtonModule } from '@taiga-ui/core';
import { UploadedAttachment } from '../issue-detail.model';
import { from, switchMap } from 'rxjs';

@Component({
  selector: 'app-issue-attachments-table',
  templateUrl: './issue-attachments-table.component.html',
  styleUrls: ['./issue-attachments-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiTableModule,
    TuiButtonModule,
    TuiMapperPipeModule,
  ],
})
export class IssueAttachmentsTableComponent {
  @Input()
  attachments: readonly UploadedAttachment[] = [];

  @Output()
  deleteAttachment = new EventEmitter<UploadedAttachment>();

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

  @tuiPure
  getDownloadUrl(item: Models.File): string {
    return this.bucketService.getDownload(item.bucketId, item.$id).href;
  }

  openPreview(item: Models.File, index: number): void {
    const preview = import(
      '../issue-attachment-preview/issue-attachment-preview.component'
    ).then((m) => m.IssueAttachmentPreviewComponent);

    from(preview)
      .pipe(
        switchMap((component) =>
          this.previewDialogService.open(new PolymorpheusComponent(component), {
            data: { files: this.attachments, item, index },
          })
        )
      )
      .subscribe();
  }

  deleteFile(item: UploadedAttachment): void {
    this.cardAttachmentsService
      .deleteAttachment(item.attachment)
      .subscribe(() => this.deleteAttachment.emit(item));
  }
}
