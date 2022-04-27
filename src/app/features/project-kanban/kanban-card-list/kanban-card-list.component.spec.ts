import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanCardListComponent } from './kanban-card-list.component';

describe('KanbanListComponent', () => {
  let component: KanbanCardListComponent;
  let fixture: ComponentFixture<KanbanCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KanbanCardListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
