import { RxState } from '@rx-angular/state';
import { CardsService } from '../../data/cards.service';
import { Inject, Injectable } from '@angular/core';
import { RxActionFactory } from '../../shared/rxa-custom/actions/actions.factory';
import {
  concat,
  debounceTime,
  filter,
  map,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { patch } from '@rx-angular/cdk/transformations';
import { BucketService } from '../../data/bucket.service';
import { ProjectsService } from '../../data/projects.service';
import { CardAttachmentsService } from '../../data/cards-attachments.service';
import {
  KanbanCardEditorState,
  UploadedAttachment,
} from './issue-detail.model';
import { PermissionsService } from '../../shared/permissions/permissions.service';
import { isPresent } from '@taiga-ui/cdk';
import { realtimeListener } from '../../shared/utils/realtime';

interface Actions {
  fetch: { $id: string };
  fetchAttachments: { $ids: string[] };
  fetchProject: { $id: string };
  editTitle: string;
  updateContent: string;
  updateArchived: boolean;
  updatePriority: string | undefined;
  updateExpiryDate: string | undefined;
  addAttachment: UploadedAttachment;
  deleteAttachment: UploadedAttachment;
}

@Injectable()
export class IssueDetailAdapter extends RxState<KanbanCardEditorState> {
  readonly actions = this.rxActionFactory.create();

  readonly withAuthorization$ =
    this.permissionService.canWriteOnWorkspace$.pipe(
      filter((authorized) => authorized)
    );

  private readonly updateTitleEvent$ = this.actions.editTitle$.pipe(
    withLatestFrom(this.select('card'), this.withAuthorization$)
  );

  private readonly updateContentEvent$ = this.actions.updateContent$.pipe(
    withLatestFrom(this.select('card'), this.withAuthorization$)
  );

  private readonly updateArchivedEvent$ = this.actions.updateArchived$.pipe(
    withLatestFrom(this.select('card'), this.withAuthorization$)
  );

  private readonly updateExpiryDateEvent = this.actions.updateExpiryDate$.pipe(
    withLatestFrom(this.select('card'), this.withAuthorization$)
  );

  private readonly updatePriorityEvent = this.actions.updatePriority$.pipe(
    withLatestFrom(this.select('card'), this.withAuthorization$)
  );

  private readonly fetchAttachmentsEvent$ = this.actions.fetchAttachments$.pipe(
    withLatestFrom(this.select('card'))
  );

  constructor(
    @Inject(CardsService)
    private readonly cardsService: CardsService,
    @Inject(CardAttachmentsService)
    private readonly cardAttachmentsService: CardAttachmentsService,
    @Inject(ProjectsService)
    private readonly projectsService: ProjectsService,
    @Inject(BucketService)
    private readonly bucketService: BucketService,
    @Inject(RxActionFactory)
    private readonly rxActionFactory: RxActionFactory<Actions>,
    @Inject(PermissionsService)
    private readonly permissionService: PermissionsService
  ) {
    super();

    this.connect(
      'card',
      this.actions.fetch$.pipe(
        switchMap(({ $id }) =>
          this.cardsService.getById($id).pipe(
            tap((card) => {
              setTimeout(() => {
                this.actions.fetchProject({ $id: card.projectId });
                this.actions.fetchAttachments({ $ids: card.attachments || [] });
              });
            })
          )
        )
      )
    );

    this.connect(
      'project',
      this.actions.fetchProject$.pipe(
        switchMap(({ $id }) => this.projectsService.getById($id))
      )
    );

    this.connect(
      'attachmentList',
      this.fetchAttachmentsEvent$.pipe(
        switchMap(([, { $id }]) => {
          return this.cardAttachmentsService.getAttachments($id).pipe(
            map((attachments) => attachments.documents),
            switchMap((attachments) =>
              this.bucketService
                .getAttachments(
                  attachments.map((doc) => ({
                    id: doc.ref,
                    bucket: doc.bucketId,
                  }))
                )
                .pipe(
                  map((fileList) =>
                    fileList.files.map((file) => ({
                      ...file,
                      attachment: attachments.find(
                        (attachment) => attachment.$id === file.$id
                      )!,
                    }))
                  )
                )
            )
          );
        })
      )
    );

    this.connect(
      'attachmentList',
      this.actions.addAttachment$.pipe(
        withLatestFrom(this.select('attachmentList'), this.withAuthorization$),
        map(([newAttachment, attachments]) => {
          return [newAttachment, ...attachments];
        })
      )
    );

    this.connect(
      'attachmentList',
      this.actions.deleteAttachment$.pipe(
        withLatestFrom(this.select('attachmentList'), this.withAuthorization$),
        map(([{ $id }, attachments]) => {
          return attachments.filter((file) => file.$id !== $id);
        })
      )
    );

    this.connect(
      'card',
      this.updateTitleEvent$.pipe(
        switchMap(([title, card]) =>
          concat(
            of(patch(card, { name: title })),
            this.cardsService.updateTitle(card.$id, title)
          )
        )
      )
    );

    this.connect(
      'card',
      this.updateContentEvent$.pipe(
        debounceTime(1000),
        switchMap(([content, card]) =>
          this.cardsService.updateContent(card.$id, content)
        )
      )
    );

    this.connect(
      'card',
      this.updateArchivedEvent$.pipe(
        switchMap(([archived, card]) =>
          concat(
            of(patch(card, { archived })),
            this.cardsService.updateArchived(card.$id, archived)
          )
        )
      )
    );

    this.connect(
      'card',
      this.updatePriorityEvent.pipe(
        switchMap(([priority, card]) =>
          concat(
            of(patch(card, { priority })),
            this.cardsService.updatePriority(card.$id, priority)
          )
        )
      )
    );

    this.connect(
      'card',
      this.updateExpiryDateEvent.pipe(
        switchMap(([expiryDate, card]) =>
          concat(
            of(patch(card, { expiryDate })),
            this.cardsService.updateExpiryDate(card.$id, expiryDate)
          )
        )
      )
    );
  }
}
