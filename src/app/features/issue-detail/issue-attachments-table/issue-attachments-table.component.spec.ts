import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueAttachmentsTableComponent } from './issue-attachments-table.component';

describe('KanbanAttachmentsTableComponent', () => {
  let component: IssueAttachmentsTableComponent;
  let fixture: ComponentFixture<IssueAttachmentsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IssueAttachmentsTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueAttachmentsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
