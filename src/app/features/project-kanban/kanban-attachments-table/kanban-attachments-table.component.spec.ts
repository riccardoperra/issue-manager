import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanAttachmentsTableComponent } from './kanban-attachments-table.component';

describe('KanbanAttachmentsTableComponent', () => {
  let component: KanbanAttachmentsTableComponent;
  let fixture: ComponentFixture<KanbanAttachmentsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KanbanAttachmentsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanAttachmentsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
