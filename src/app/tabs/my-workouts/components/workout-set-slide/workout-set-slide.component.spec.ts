import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WorkoutSetSlideComponent } from './workout-set-slide.component';

describe('WorkoutSetSlideComponent', () => {
  let component: WorkoutSetSlideComponent;
  let fixture: ComponentFixture<WorkoutSetSlideComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkoutSetSlideComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutSetSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
