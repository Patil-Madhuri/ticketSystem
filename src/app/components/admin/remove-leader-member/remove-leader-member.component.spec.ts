import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveLeaderMemberComponent } from './remove-leader-member.component';

describe('RemoveLeaderMemberComponent', () => {
  let component: RemoveLeaderMemberComponent;
  let fixture: ComponentFixture<RemoveLeaderMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveLeaderMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveLeaderMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
