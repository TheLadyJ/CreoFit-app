import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyWorkoutsPage } from './my-workouts.page';

describe('MyWorkoutsPage', () => {
  let component: MyWorkoutsPage;
  let fixture: ComponentFixture<MyWorkoutsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyWorkoutsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
