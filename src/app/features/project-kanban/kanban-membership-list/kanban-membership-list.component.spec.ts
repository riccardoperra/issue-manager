import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanMembershipListComponent } from './kanban-membership-list.component';

describe('KanbanMembershipListComponent', () => {
  let component: KanbanMembershipListComponent;
  let fixture: ComponentFixture<KanbanMembershipListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KanbanMembershipListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanMembershipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
