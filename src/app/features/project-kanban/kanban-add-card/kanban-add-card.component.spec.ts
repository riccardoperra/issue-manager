import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanAddCardComponent } from './kanban-add-card.component';

describe('KanbanAddCardComponent', () => {
  let component: KanbanAddCardComponent;
  let fixture: ComponentFixture<KanbanAddCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KanbanAddCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanAddCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
