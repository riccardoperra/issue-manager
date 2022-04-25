import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanAddListComponent } from './kanban-add-list.component';

describe('KanbanAddListComponent', () => {
  let component: KanbanAddListComponent;
  let fixture: ComponentFixture<KanbanAddListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KanbanAddListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanAddListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
