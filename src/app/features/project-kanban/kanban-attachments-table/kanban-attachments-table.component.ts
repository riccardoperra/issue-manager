import { Component, Inject, Input, OnInit } from '@angular/core';
import { Models } from 'appwrite';
import { FormBuilder } from '@angular/forms';
import {
  catchError,
  combineLatestWith,
  filter,
  map,
  mapTo,
  mergeScan,
  Observable,
  of,
  pairwise,
  share,
  startWith,
  takeUntil,
} from 'rxjs';
import { BucketService } from '../../../data/bucket.service';
import { Project } from '../../../data/projects.service';
import { combineLatest } from 'rxjs';
import { isPresent } from '@taiga-ui/cdk';

@Component({
  selector: 'app-kanban-attachments-table',
  templateUrl: './kanban-attachments-table.component.html',
  styleUrls: ['./kanban-attachments-table.component.scss'],
})
export class KanbanAttachmentsTableComponent implements OnInit {
  readonly files = this.fb.control([]);

  @Input()
  project!: Project;

  @Input()
  attachments: readonly Models.File[] = [];

  private readonly files$ = this.files.valueChanges.pipe(
    startWith<File[]>([]),
    pairwise(),
    map(([prev, curr]) => curr.filter((item) => !prev.includes(item))),
    // @ts-ignore
    mergeScan((acc, curr) => {
      return combineLatest(
        curr.map((file) =>
          this.addFile(file).pipe(
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

  private addFile(file: File): Observable<Models.File | Error | null> {
    return this.bucketService
      .addAttachment(this.project, file)
      .pipe(catchError((e) => of(e)));
    // .pipe(map(() => file));
  }

  constructor(
    @Inject(BucketService)
    private readonly bucketService: BucketService,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.files$.subscribe(console.log);
  }
}
