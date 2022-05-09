import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueCardListComponent } from './issue-card-list.component';

describe('KanbanListComponent', () => {
  let component: IssueCardListComponent;
  let fixture: ComponentFixture<IssueCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IssueCardListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
