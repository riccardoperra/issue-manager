import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptMembershipComponent } from './accept-membership.component';

describe('AcceptMembershipComponent', () => {
  let component: AcceptMembershipComponent;
  let fixture: ComponentFixture<AcceptMembershipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptMembershipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptMembershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
