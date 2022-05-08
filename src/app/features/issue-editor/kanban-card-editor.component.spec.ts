import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanCardEditorComponent } from './kanban-card-editor.component';

describe('EditCardComponent', () => {
  let component: KanbanCardEditorComponent;
  let fixture: ComponentFixture<KanbanCardEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KanbanCardEditorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanCardEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
