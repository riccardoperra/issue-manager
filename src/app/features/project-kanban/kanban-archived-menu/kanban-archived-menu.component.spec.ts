import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanArchivedMenuComponent } from './kanban-archived-menu.component';

describe('KanbanArchivedMenuComponent', () => {
  let component: KanbanArchivedMenuComponent;
  let fixture: ComponentFixture<KanbanArchivedMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KanbanArchivedMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanArchivedMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
